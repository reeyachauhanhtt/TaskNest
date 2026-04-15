import { useEffect, useState } from 'react';

import classes from './MembersSection.module.css';
import ConfirmModal from '../common/ConfirmModal';

export default function MembersSection() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [email, setEmail] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // fetch users
    fetch(`${import.meta.env.VITE_API_URL}/users`)
      .then((res) => res.json())
      .then(setUsers);

    // fetch projects
    fetch(`${import.meta.env.VITE_API_URL}/projects`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);

        // default project where user is part of
        const myProject = data.find(
          (p) =>
            p.admins.includes(currentUser.id) ||
            p.members.includes(currentUser.id),
        );

        setSelectedProjectId(myProject?.id);
      });
  }, []);

  if (!users.length || !projects.length) return null;

  //  projects where current user is part of
  const userProjects = projects.filter(
    (p) =>
      p.admins.includes(currentUser.id) || p.members.includes(currentUser.id),
  );

  //  collect all ids
  let allIds = [];

  userProjects.forEach((p) => {
    allIds.push(...p.admins);
    allIds.push(...p.members);
  });

  const uniqueIds = [...new Set(allIds)];

  const finalUsers = uniqueIds.map((id) => {
    const user = users.find((u) => u.id === id);

    const isAdmin = userProjects.some((p) => p.admins.includes(id));

    return {
      ...user,
      role: isAdmin ? 'admin' : 'member',
    };
  });

  // selected project for actions
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const isAdmin = selectedProject?.admins.includes(currentUser.id);

  //  ADD MEMBER

  const handleAdd = async () => {
    if (!isAdmin) return;

    const user = users.find((u) => u.email === email);
    if (!user) return alert('User not found');

    if (
      selectedProject.members.includes(user.id) ||
      selectedProject.admins.includes(user.id)
    ) {
      return alert('Already in project');
    }

    const updatedMembers = [...selectedProject.members, user.id];

    await fetch(
      `${import.meta.env.VITE_API_URL}/projects/${selectedProject.id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members: updatedMembers }),
      },
    );

    window.location.reload();
  };

  // CONFIRM REMOVE MEMBER
  const confirmRemove = async () => {
    if (!selectedUser) return;

    const userId = selectedUser.id;

    const updatedMembers = selectedProject.members.filter(
      (id) => id !== userId,
    );

    const updatedAdmins = selectedProject.admins.filter((id) => id !== userId);

    await fetch(
      `${import.meta.env.VITE_API_URL}/projects/${selectedProject.id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          members: updatedMembers,
          admins: updatedAdmins,
        }),
      },
    );

    setIsModalOpen(false);
    setSelectedUser(null);

    window.location.reload();
  };

  // REMOVE MEMBER

  const handleRemove = async (userId) => {
    if (!isAdmin) return;

    const updatedMembers = selectedProject.members.filter(
      (id) => id !== userId,
    );

    const updatedAdmins = selectedProject.admins.filter((id) => id !== userId);

    await fetch(
      `${import.meta.env.VITE_API_URL}/projects/${selectedProject.id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          members: updatedMembers,
          admins: updatedAdmins,
        }),
      },
    );

    window.location.reload();
  };

  return (
    <div className={classes.wrapper}>
      <h2>Members</h2>
      <p className={classes.sub}>Across all your projects</p>

      <div className={classes.divider}></div>

      <select
        className={classes.select}
        value={selectedProjectId || ''}
        onChange={(e) => setSelectedProjectId(e.target.value)}
      >
        {userProjects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title}
          </option>
        ))}
      </select>

      <div className={classes.card}>
        <div className={classes.list}>
          {finalUsers.map((user) => (
            <div key={user.id} className={classes.row}>
              <div className={classes.left}>
                <div className={classes.avatar}>
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </div>

                <div>
                  <div className={classes.name}>
                    {user.firstName} {user.lastName}
                    {user.role === 'admin' && (
                      <span className={classes.badge}>Admin</span>
                    )}
                    {user.id === currentUser.id && (
                      <span className={classes.you}>You</span>
                    )}
                  </div>

                  <div className={classes.email}>{user.email}</div>
                </div>
              </div>

              {isAdmin && user.id !== currentUser.id && (
                <button
                  className={classes.remove}
                  onClick={() => {
                    setSelectedUser(user);
                    setIsModalOpen(true);
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div className={classes.inviteBox}>
          <input
            type='email'
            placeholder='colleague@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleAdd}>Send invite</button>
        </div>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmRemove}
        message={
          selectedUser
            ? `Do you want "${selectedUser.firstName} ${selectedUser.lastName}" to be removed?`
            : ''
        }
      />
    </div>
  );
}
