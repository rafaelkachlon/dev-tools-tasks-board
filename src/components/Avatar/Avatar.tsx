import type { TeamMember } from '../../types/task';
import { getInitials } from '../../utils/format';
import styles from './Avatar.module.css';

interface AvatarProps {
  member: TeamMember | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ member, size = 'md', className = '' }: AvatarProps) {
  const classes = `${styles.avatar} ${styles[size]} ${className}`;

  if (!member) {
    return (
      <span className={`${classes} ${styles.empty}`} title="Unassigned" aria-label="Unassigned">
        ?
      </span>
    );
  }

  return (
    <span className={classes} style={{ backgroundColor: member.avatarColor }} title={member.name}>
      {getInitials(member.name)}
    </span>
  );
}
