import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import type { TaskDraft, TeamMember } from '../../types/task';
import { CloseIcon } from '../Icons';
import styles from './NewTaskModal.module.css';

interface NewTaskModalProps {
  team: TeamMember[];
  onClose: () => void;
  onSave: (draft: TaskDraft) => Promise<void>;
}

export function NewTaskModal({ team, onClose, onSave }: NewTaskModalProps) {
  const id = useId();
  const titleRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [estimate, setEstimate] = useState('1');
  const [urgent, setUrgent] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, saving]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setTitleError('Please enter a title');
      titleRef.current?.focus();
      return;
    }

    setSaving(true);
    try {
      await onSave({
        title: name.trim(),
        assigneeId: assigneeId || null,
        estimateHours: Math.max(0, Number(estimate) || 0),
        urgent,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={() => !saving && onClose()}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-heading`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 id={`${id}-heading`} className={styles.heading}>
            New Task
          </h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close" disabled={saving}>
            <CloseIcon />
          </button>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor={`${id}-title`} className={styles.label}>
              Title
            </label>
            <input
              ref={titleRef}
              id={`${id}-title`}
              className={`${styles.input} ${titleError ? styles.inputInvalid : ''}`}
              placeholder="e.g. Add dark mode toggle"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (titleError) setTitleError(null);
              }}
              aria-invalid={titleError ? true : undefined}
              aria-describedby={titleError ? `${id}-title-error` : undefined}
            />
            {titleError && (
              <p id={`${id}-title-error`} className={styles.error}>
                {titleError}
              </p>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor={`${id}-assignee`} className={styles.label}>
                Assignee
              </label>
              <select
                id={`${id}-assignee`}
                className={styles.input}
                value={assigneeId}
                onChange={(event) => setAssigneeId(event.target.value)}
              >
                <option value="">Unassigned</option>
                {team.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-estimate`} className={styles.label}>
                Estimate (hours)
              </label>
              <input
                id={`${id}-estimate`}
                type="number"
                min={0}
                step={0.5}
                className={styles.input}
                value={estimate}
                onChange={(event) => setEstimate(event.target.value)}
              />
            </div>
          </div>

          <label className={styles.checkbox}>
            <input type="checkbox" checked={urgent} onChange={(event) => setUrgent(event.target.checked)} />
            <span>
              <span className={styles.checkboxTitle}>Mark as urgent</span>
              <span className={styles.checkboxHint}>Urgent tasks are highlighted on the board.</span>
            </span>
          </label>

          <footer className={styles.footer}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
