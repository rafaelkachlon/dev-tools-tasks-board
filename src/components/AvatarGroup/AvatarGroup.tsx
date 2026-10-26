import type { TeamMember } from '../../types/task';
import { Avatar } from '../Avatar/Avatar';
import styles from './AvatarGroup.module.css';

interface AvatarGroupProps {
  members: TeamMember[];
  max?: number;
}

export function AvatarGroup({ members, max = 4 }: AvatarGroupProps) {
  const visible = members.slice(0, max);
  const hidden = members.length - visible.length;

  return (
    <div className={styles.group} aria-label={`${members.length} team members`}>
      {visible.map((member) => (
        <Avatar key={member.id} member={member} size="md" className={styles.item} />
      ))}
      {hidden > 0 && <span className={`${styles.item} ${styles.more}`}>+{hidden}</span>}
    </div>
  );
}
