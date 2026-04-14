import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import classes from './ProfileSection.module.css';
import useAuth from '../../hooks/Authentication';

export default function ProfileSection() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuth();
  // console.log(user);
  // console.log(useAuth());

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    username: user?.username || '',
    bio: user?.bio || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  if (!form) return null;

  //handling every fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //handling saving details
  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg('');

    try {
      const updatedUser = {
        id: user.id,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        username: form.username,
        bio: form.bio,
      };

      const res = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error('Server returned non-JSON:', text);
        throw new Error(text);
      }
      // console.log('STATUS:', res.status);
      // console.log('UPDATED USER FROM SERVER:', data);

      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['projects']);
      queryClient.invalidateQueries(['tasks']);

      setSuccessMsg('Profile updated successfully');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <div className={classes.icon}>👤</div>
        <div>
          <h2>Profile</h2>
          <p>Manage your personal information and how you appear</p>
        </div>
      </div>

      <div className={classes.divider}></div>

      <p className={classes.sectionTitle}>Identity</p>

      <div className={classes.card}>
        <div className={classes.banner}></div>

        <div className={classes.userRow}>
          <div className={classes.avatarWrapper}>
            <div className={classes.avatar}>
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </div>
          </div>

          <div className={classes.userInfo}>
            <h3>
              {form.firstName} {form.lastName}
            </h3>
            <span className={classes.role}>Admin</span>
          </div>
        </div>

        <div className={classes.grid}>
          <div>
            <label>FIRST NAME</label>
            <input
              name='firstName'
              value={form.firstName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>LAST NAME</label>
            <input
              name='lastName'
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>EMAIL</label>
            <input name='email' value={form.email} onChange={handleChange} />
          </div>

          <div>
            <label>USERNAME</label>
            <input
              name='username'
              value={form.username}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={classes.bio}>
          <label>BIO</label>
          <textarea
            placeholder='Write something...'
            value={form.bio}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                bio: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <button onClick={handleSave} disabled={isSaving} className={classes.save}>
        {isSaving ? 'Saving...' : 'Save changes'}
      </button>
      {successMsg && <p className={classes.success}>{successMsg}</p>}
    </div>
  );
}
