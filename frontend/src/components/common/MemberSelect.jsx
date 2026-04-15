import { useState, useRef, useEffect } from 'react';
import styles from './MemberSelect.module.css';

export default function MemberSelect({
  users = [],
  selected = [],
  onChange,
  multiple = false,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggleUser(id) {
    if (multiple) {
      if (selected.includes(id)) {
        onChange(selected.filter((u) => u !== id));
      } else {
        onChange([...selected, id]);
      }
    } else {
      onChange(id);
      setOpen(false);
    }
  }

  function getInitials(user) {
    return `${user.firstName[0]}${user.lastName[0]}`;
  }

  const selectedUsers = users.filter((u) =>
    multiple ? selected.includes(u.id) : u.id === selected,
  );

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div
        className={styles.selectBox}
        onClick={() => setOpen((prev) => !prev)}
      >
        {selectedUsers.length > 0 ? (
          multiple ? (
            selectedUsers.map((u) => (
              <span key={u.id} className={styles.tag}>
                {getInitials(u)} {u.firstName}
              </span>
            ))
          ) : (
            <span>
              {getInitials(selectedUsers[0])} {selectedUsers[0].firstName}{' '}
              {selectedUsers[0].lastName}
            </span>
          )
        ) : (
          <span className={styles.placeholder}>
            {multiple ? 'Select members' : 'Assign to'}
          </span>
        )}
      </div>

      {open && (
        <div className={styles.dropdown}>
          {users.map((user) => {
            const isSelected = multiple
              ? selected.includes(user.id)
              : selected === user.id;

            return (
              <div
                key={user.id}
                className={`${styles.option} ${
                  isSelected ? styles.active : ''
                }`}
                onClick={() => toggleUser(user.id)}
              >
                <div className={styles.avatar}>{getInitials(user)}</div>

                <span>
                  {user.firstName} {user.lastName}
                </span>

                {isSelected && <span className={styles.check}>✔</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
