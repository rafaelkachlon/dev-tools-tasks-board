import { useCallback, useEffect, useMemo, useState } from 'react';
import { createTask, getTasks } from './api/tasks';
import { getTeam } from './api/team';
import { ErrorState } from './components/ErrorState/ErrorState';
import { FilterBar } from './components/FilterBar/FilterBar';
import { Header } from './components/Header/Header';
import { NewTaskModal } from './components/NewTaskModal/NewTaskModal';
import { SummaryBar } from './components/SummaryBar/SummaryBar';
import { TaskDetails } from './components/TaskDetails/TaskDetails';
import { TaskList } from './components/TaskList/TaskList';
import { Toast, type ToastMessage } from './components/Toast/Toast';
import type { StatusFilter, Task, TaskDraft, TeamMember } from './types/task';
import { getUniqueAssignees } from './utils/assignees';
import { filterTasks } from './utils/filter';
import { countByStatus } from './utils/stats';
import styles from './App.module.css';

type LoadState = 'loading' | 'ready' | 'error';

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [query, setQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const loadTasks = useCallback(async () => {
    setLoadState('loading');
    try {
      setTasks(await getTasks());
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    getTeam()
      .then(setTeam)
      .catch(() => setTeam([]));
  }, []);

  const loading = loadState === 'loading';
  const assignees = useMemo(() => getUniqueAssignees(tasks), [tasks]);
  const counts = useMemo(() => countByStatus(tasks), [tasks]);
  const visibleTasks = useMemo(() => filterTasks(tasks, statusFilter, query), [tasks, statusFilter, query]);

  const showToast = useCallback((kind: ToastMessage['kind'], message: string) => {
    setToast({ id: Date.now(), kind, message });
  }, []);
  const dismissToast = useCallback(() => setToast(null), []);
  const closeDetails = useCallback(() => setSelectedTask(null), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleSave = async (draft: TaskDraft) => {
    try {
      const created = await createTask(draft);
      setTasks((current) => [...current, created]);
      setModalOpen(false);
      showToast('success', `“${created.title}” was added to the board`);
    } catch {
      showToast('error', 'Something went wrong');
    }
  };

  return (
    <div className={styles.app}>
      <Header members={assignees} loading={loading} onNewTask={() => setModalOpen(true)} />

      <main className={styles.main}>
        {loadState === 'error' ? (
          <ErrorState onRetry={loadTasks} />
        ) : (
          <>
            <SummaryBar tasks={tasks} loading={loading} />

            <section className={styles.board} aria-labelledby="board-heading">
              <div className={styles.boardHeader}>
                <h2 id="board-heading" className={styles.boardTitle}>
                  Tasks
                </h2>
                {!loading && (
                  <span className={styles.boardMeta}>
                    Showing {visibleTasks.length} of {tasks.length}
                  </span>
                )}
              </div>
              <FilterBar
                status={statusFilter}
                onStatusChange={setStatusFilter}
                query={query}
                onQueryChange={setQuery}
                counts={loading ? null : counts}
              />
              <TaskList tasks={visibleTasks} loading={loading} onSelect={setSelectedTask} />
            </section>
          </>
        )}
      </main>

      {selectedTask && <TaskDetails task={selectedTask} onClose={closeDetails} />}
      {isModalOpen && <NewTaskModal team={team} onClose={closeModal} onSave={handleSave} />}
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
