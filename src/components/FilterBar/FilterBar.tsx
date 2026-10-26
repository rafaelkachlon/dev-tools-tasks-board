import type { StatusFilter } from '../../types/task';
import { SearchIcon } from '../Icons';
import styles from './FilterBar.module.css';

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

interface FilterBarProps {
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  query: string;
  onQueryChange: (query: string) => void;
  counts: Record<StatusFilter, number> | null;
}

export function FilterBar({ status, onStatusChange, query, onQueryChange, counts }: FilterBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.chips} role="group" aria-label="Filter by status">
        {FILTERS.map((filter) => {
          const active = filter.value === status;
          return (
            <button
              key={filter.value}
              type="button"
              className={`${styles.chip} ${active ? styles.active : ''}`}
              aria-pressed={active}
              onClick={() => onStatusChange(filter.value)}
            >
              {filter.label}
              {counts && <span className={styles.count}>{counts[filter.value]}</span>}
            </button>
          );
        })}
      </div>

      <label className={styles.search}>
        <SearchIcon width={16} height={16} className={styles.searchIcon} />
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search tasks or people…"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          aria-label="Search tasks"
        />
      </label>
    </div>
  );
}
