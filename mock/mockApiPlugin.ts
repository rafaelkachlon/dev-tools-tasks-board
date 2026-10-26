import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Connect, Plugin } from 'vite';
import { tasks as seedTasks, team } from './seed.ts';

const RESPONSE_DELAY_MS = 400;

type Json = Record<string, unknown> | unknown[];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sendJson(res: ServerResponse, status: number, body: Json) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.setEncoding('utf8');
    req.on('data', (chunk: string) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) return resolve(undefined);
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function mockApiPlugin(): Plugin {
  const tasks = structuredClone(seedTasks) as Array<Record<string, unknown>>;
  let nextId = tasks.length + 1;

  async function createTask(req: IncomingMessage, res: ServerResponse) {
    let body: unknown;
    try {
      body = await readJsonBody(req);
    } catch {
      return sendJson(res, 400, { error: 'Request body must be valid JSON' });
    }

    if (!isRecord(body) || typeof body.title !== 'string' || body.title.trim() === '') {
      return sendJson(res, 400, { error: "Field 'title' is required" });
    }

    const estimate = Number(body.estimateHours);
    const task = {
      id: nextId++,
      title: body.title.trim(),
      description: typeof body.description === 'string' ? body.description : '',
      status: 'todo',
      assignee: team.find((member) => member.id === body.assigneeId) ?? null,
      estimateHours: Number.isFinite(estimate) && estimate >= 0 ? estimate : 0,
      urgent: body.urgent === true,
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    return sendJson(res, 201, task);
  }

  const handler: Connect.NextHandleFunction = (req, res, next) => {
    const { pathname } = new URL(req.url ?? '/', 'http://localhost');
    if (!pathname.startsWith('/api/')) return next();

    const method = req.method ?? 'GET';
    void (async () => {
      await sleep(RESPONSE_DELAY_MS);
      try {
        if (pathname === '/api/tasks') {
          if (method === 'GET') return sendJson(res, 200, tasks);
          if (method === 'POST') return await createTask(req, res);
          return sendJson(res, 405, { error: `Method ${method} not allowed` });
        }
        if (pathname === '/api/team') {
          if (method === 'GET') return sendJson(res, 200, team);
          return sendJson(res, 405, { error: `Method ${method} not allowed` });
        }
        return sendJson(res, 404, { error: `Cannot ${method} ${pathname}` });
      } catch (error) {
        console.error('[mock-api]', error);
        return sendJson(res, 500, { error: 'Internal server error' });
      }
    })();
  };

  return {
    name: 'tdp-mock-api',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}
