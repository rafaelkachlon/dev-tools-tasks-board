# Debugging with Chrome DevTools: session recap

This is a recap of the DevTools session. The `main` branch has **6 bugs** in it on purpose. Each section below shows you how to **reproduce** the bug, how we **debugged** it in DevTools, and how we **fixed** it. The fixes are on the [`solutions`](https://github.com/rafaelkachlon/dev-tools-tasks-board/tree/solutions) branch.

The goal isn't this app. It's the workflow you'll use in your final project: **see the symptom → pick the right DevTools panel → find the real cause → fix it.**

## Setup

1. Install and run the app (see the [README](README.md)):
   ```bash
   npm install
   npm run dev
   ```
2. Open <http://localhost:5173> in **Google Chrome**.
3. Install the [React Developer Tools](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) extension (needed for step 4).
4. Open DevTools: <kbd>F12</kbd>, or <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd> (Windows/Linux) / <kbd>Cmd</kbd>+<kbd>Opt</kbd>+<kbd>I</kbd> (Mac).

> **Tip:** restart `npm run dev` to reset the data. Any tasks you created disappear.

## Which panel answers which question?

| Question | Panel |
| -------- | ----- |
| Did something crash? What's the error? | **Console** |
| What did we send to the server, and what came back? | **Network** |
| What are the values *right now*, line by line? | **Sources** (breakpoints) |
| Why does this element look like that? | **Elements** (Styles / Computed) |
| What props and state does this component *really* have? | **⚛️ Components** (React DevTools) |

## Keyboard shortcuts used below

| Action | Windows / Linux | Mac |
| ------ | --------------- | --- |
| Reload the page | <kbd>Ctrl</kbd>+<kbd>R</kbd> | <kbd>Cmd</kbd>+<kbd>R</kbd> |
| Open a file in Sources | <kbd>Ctrl</kbd>+<kbd>P</kbd> | <kbd>Cmd</kbd>+<kbd>P</kbd> |
| Search across all files | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> | <kbd>Cmd</kbd>+<kbd>Opt</kbd>+<kbd>F</kbd> |
| Resume (when paused) | <kbd>F8</kbd> | <kbd>F8</kbd> |
| Deactivate all breakpoints | <kbd>Ctrl</kbd>+<kbd>F8</kbd> | <kbd>Cmd</kbd>+<kbd>F8</kbd> |
| Open the Console drawer under any panel | <kbd>Esc</kbd> | <kbd>Esc</kbd> |

---

## Step 1: The empty Assignee dropdown (Console → Network)

**Symptom:** the Assignee dropdown in **New Task** only has "Unassigned", even though the team has 4 people. The UI shows no error.

**Reproduce:** click **New Task** and open the **Assignee** dropdown.

**Debug it:**

1. Open DevTools → **Console**. There's a red `Failed to load resource: the server responded with a status of 404 (Not Found)`. The app hid the error, but the browser still reported it.
2. Switch to **Network**. If it's empty, that's normal: **Network only records while DevTools is open.** Reload the page.
3. Click the **Fetch/XHR** filter. There are two requests: `tasks` (200) and `team-members` in red (**404**).
4. Click `team-members`:
   - **Headers**: Request URL is `/api/team-members`, Status is `404`.
   - **Response**: `{"error":"Cannot GET /api/team-members"}`.
5. Compare with the API table in the [README](README.md#mock-rest-api): the real endpoint is **`/api/team`**.
6. Why didn't the app tell us? Open the **Initiator** tab, follow the stack to `App.tsx`, and you'll find `.catch(() => setTeam([]))`. It swallows the error and shows an empty list.

**Fix:** [`src/api/team.ts`](src/api/team.ts)

```diff
- return request<TeamMember[]>('/api/team-members');
+ return request<TeamMember[]>('/api/team');
```

See the full fix: `git show solutions~5`

**Takeaway:** "no error on screen" doesn't mean "no error". Check **Network** for red rows. A `catch` that just returns empty data hides bugs.

---

## Step 2: "Something went wrong" (Network)

**Symptom:** saving a new task shows a toast that just says **"Something went wrong"**. The modal stays open.

**Reproduce:** click **New Task**, type a title, and click **Save**.

**Debug it:**

1. Open **Network → Fetch/XHR** *before* clicking Save (or click Save again).
2. There's a red `tasks` row: method **POST**, status **400**. Click it:
   - **Payload**: `{"name":"…","assigneeId":…,"estimateHours":…,"urgent":…}`
   - **Response**: `{"error":"Field 'title' is required"}`
3. The server told us exactly what's wrong. The UI threw that message away.
4. Where does `name` come from? Search all files for `name: name.trim` (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> / <kbd>Cmd</kbd>+<kbd>Opt</kbd>+<kbd>F</kbd>). You land in `NewTaskModal.tsx`.
5. *Bonus:* test the fix without touching any code. Right-click the request → **Copy → Copy as fetch**, paste it into the Console, change `name` to `title`, and press Enter. Network shows **201 Created**.

**Fix:** rename the field from `name` to `title` in [`src/types/task.ts`](src/types/task.ts) (`TaskDraft`) and in [`src/components/NewTaskModal/NewTaskModal.tsx`](src/components/NewTaskModal/NewTaskModal.tsx):

```diff
- name: name.trim(),
+ title: name.trim(),
```

See the full fix: `git show solutions~4`

**Takeaway:** for a failed request, read **Status → Payload → Response**. The response body usually says exactly what's wrong.

---

## Step 3: The Save text vanishes on hover (Elements)

**Symptom:** the text on the **Save** button disappears when you hover over it.

**Reproduce:** click **New Task** and hover over **Save**.

**Debug it:**

1. Right-click **Save** → **Inspect**.
2. Problem: moving your mouse to DevTools ends the hover. Solution: in **Styles**, click **:hov** and tick **:hover**. The button stays in its hover state.
3. Find the `.NewTaskModal-module__saveButton___…:hover` rule. `background` and `color` are both `var(--color-primary-600)`: blue text on a blue background.
4. Click the color value and change it to `#fff`. It's fixed live in the browser, but not in your code yet.
5. Click the `NewTaskModal.module.css:169` link next to the rule to jump to the source file.
6. Untick **:hover** when you're done.

**Fix:** [`src/components/NewTaskModal/NewTaskModal.module.css`](src/components/NewTaskModal/NewTaskModal.module.css), inside `.saveButton:hover`:

```diff
- color: var(--color-primary-600);
+ color: #fff;
```

See the full fix: `git show solutions~1`

**Takeaway:** use **:hov** to force `:hover`, `:focus` or `:active` and inspect styles that disappear. Try fixes live in **Styles**, then copy them into your code.

---

## Step 4: Every task is "Urgent" (React DevTools)

**Symptom:** every task card shows a red **Urgent** badge, but only 2 tasks are actually urgent.

**Reproduce:** load the page. Then click **Set up routing**: the details panel says **Priority: Normal**, but the card says Urgent.

**Debug it:**

1. Open DevTools → **⚛️ Components** (from the React DevTools extension).
2. Click the picker icon (top-left of the panel) and click a task card.
3. The selected `TaskCard` has the prop `isUrgent: "false"`. It's **in quotes, so it's a string**. Expand `task`: `task.urgent` is `false`, a real boolean.
4. Is the string `"false"` truthy or falsy? **Truthy**, because it's a non-empty string. So `{isUrgent && <UrgentBadge />}` always renders.
5. Who passes that prop? Look at **rendered by** → `TaskList`. Open `TaskList.tsx` and you'll find `isUrgent={String(task.urgent)}`.

**Fix:** [`src/components/TaskList/TaskList.tsx`](src/components/TaskList/TaskList.tsx), and type the prop as `boolean` in [`src/components/TaskCard/TaskCard.tsx`](src/components/TaskCard/TaskCard.tsx):

```diff
- isUrgent={String(task.urgent)}
+ isUrgent={task.urgent}
```

See the full fix: `git show solutions`

**Takeaway:** React DevTools shows the **real runtime props**, and strings appear in quotes. Loose types like `boolean | string` let bugs like this compile.

---

## Step 5: Total hours shows "1010835122h" (Sources)

**Symptom:** the summary card says **Total estimated hours: 1010835122h**. The tasks add up to about 50.

**Reproduce:** load the page.

**Debug it:**

1. **Sources** → open `stats.ts` (<kbd>Ctrl</kbd>+<kbd>P</kbd> / <kbd>Cmd</kbd>+<kbd>P</kbd>). Click line number **6** (`total = total + task.estimateHours;`) to add a breakpoint.
2. Reload. The page pauses on that line. Look at **Scope** (`task`, `total`) and hover over variables in the code.
3. Press **Resume** (<kbd>F8</kbd>) a few times and watch `total`: `0` → `6` → `10` → **`"1010"`**. It suddenly becomes a string.
4. Smarter: right-click the breakpoint → **Edit breakpoint** → enter the condition `typeof task.estimateHours !== 'number'`. Reload, and it pauses **only** on the bad task ("Connect to tasks API").
5. While paused, type `typeof task.estimateHours` in the Console (<kbd>Esc</kbd>). It returns `'string'`.
6. Root cause: **Network** → `tasks` → **Preview**. That task has `estimateHours: "10"` in quotes. The TypeScript type says `number`, but `data as Task[]` in `src/api/tasks.ts` simply trusted the server.
7. **Remove the breakpoint** when you're done (click line 6 again). Otherwise it keeps pausing on every render.

**Fix:** [`src/utils/stats.ts`](src/utils/stats.ts)

```diff
- total = total + task.estimateHours;
+ total = total + Number(task.estimateHours);
```

See the full fix: `git show solutions~3`

**Takeaway:** **TypeScript types don't exist at runtime.** Use breakpoints, especially **conditional** ones, to see the real values. In JavaScript, `+` with a string concatenates instead of adding.

---

## Step 6: White screen after clicking a task (Console)

**Symptom:** clicking **Add loading skeletons** makes the **whole app turn white**. Other tasks open fine.

**Reproduce:** click the **Add loading skeletons** card (it's the unassigned one).

**Debug it:**

1. **Console** shows a red `Uncaught TypeError: Cannot read properties of null (reading 'name')`, with `at TaskDetails (TaskDetails.tsx:57)` below it.
2. Read it in three parts:
   - **What:** reading `name`
   - **On what:** `null`
   - **Where:** the first stack frame in *your* code, `TaskDetails.tsx:57`
3. Click the `TaskDetails.tsx:57` link. Sources opens on `task.assignee.name`. This task has no assignee, so `task.assignee` is `null`.
4. Why is the *whole* page white? When a component throws while rendering and there's no **error boundary**, React removes the entire app from the page. React's warning in the Console says this.
5. *Catch it live:* reload, then in **Sources → Breakpoints** tick **Pause on caught exceptions** and click the card again. It pauses on line 57 with `task.assignee: null` in **Scope**. **Untick it before resuming.**
   - Use *caught*, not *uncaught*: React catches render errors internally, so "uncaught" never pauses here.
   - A normal breakpoint on line 57 **won't** pause. JSX compiles into nested function calls, and the error is thrown before the line's pause point. If you want a regular breakpoint, put it on line 16 with the condition `task.assignee === null`.

**Fix:** make the type honest in [`src/types/task.ts`](src/types/task.ts) (`assignee: TeamMember | null`), then handle `null` in [`src/components/TaskDetails/TaskDetails.tsx`](src/components/TaskDetails/TaskDetails.tsx):

```diff
- {task.assignee.name}
+ {task.assignee?.name ?? 'Unassigned'}
```

See the full fix: `git show solutions~2`

**Takeaway:** read the error message top to bottom (**what**, **on what**, **where**) and click the link to your own file. Data from an API can be `null` even when your type says it can't.

---

## Seeing the fixes

The fixes are in the `solutions` branch, one commit per bug:

```bash
git log --oneline main..solutions     # list the fixes
git show solutions~5                  # one fix (see each step above for the right one)
git diff main solutions               # all fixes at once
git checkout solutions                # run the fixed app (git checkout main to go back)
```

> The commit messages say "bug 1–6" and are numbered differently from the steps here. Use the `git show` command listed in each step.

## Extra challenges (optional)

Want more practice? Try these on `main` after fixing the bugs:

1. **Show the real error.** On a failed save, the toast in `App.tsx` always says "Something went wrong". Show the server's message instead. The `ApiError` thrown in `src/api/client.ts` already contains it.
2. **Don't hide failures.** Replace the silent `.catch(() => setTeam([]))` in `App.tsx` so the user sees when the team can't be loaded.
3. **Add an error boundary.** Wrap the details panel so a render error shows a friendly message instead of a white screen. (Undo the step 6 fix to test it.)
4. **Validate API data.** Instead of `data as Task[]`, check (or convert) each task's fields when the response arrives, so a bad `estimateHours` never reaches the UI.
5. **Slow network.** In **Network**, set throttling to **Slow 4G** and reload. Watch the loading skeletons. Then right-click the `tasks` request → **Block request URL**, reload, and check the error state and **Retry** button. (Unblock it afterwards.)
6. **Find it yourself.** Ask a teammate to plant a bug in your copy, then find it using only DevTools.

## Checklist for your own project

When something's wrong in your frontend:

- [ ] **Console:** any red errors? Read **what / on what / where**, and click the link to your file.
- [ ] **Network:** any red requests? Check **Status → Payload → Response**.
- [ ] **Sources:** not sure about a value? Add a breakpoint (a conditional one if needed) and look at **Scope**.
- [ ] **Elements:** looks wrong? Inspect it, force `:hover` with **:hov**, and edit styles live.
- [ ] **React DevTools:** wrong behavior in a component? Check its real **props** and **state**.
- [ ] Don't write `catch` blocks that hide errors. Don't trust `as SomeType` for API data.
