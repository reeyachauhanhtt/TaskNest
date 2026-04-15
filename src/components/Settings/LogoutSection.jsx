import { useState } from 'react';
import useAuth from '../../hooks/Authentication';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../common/ConfirmModal';
import classes from './LogoutSection.module.css';

export default function LogoutSection() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [toast, setToast] = useState('');

  // LOGOUT
  const handleLogout = () => {
    logout();
    setToast('Logged out successfully');
    setTimeout(() => navigate('/'), 800);
  };

  // DELETE ACCOUNT
  const handleDelete = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/users/${user.id}`, {
        method: 'DELETE',
      });

      logout();
      setToast('Logged out successfully');
      setTimeout(() => setToast(''), 2000);
      setTimeout(() => navigate('/signup'), 800);
    } catch (err) {
      setToast('Something went wrong');
      console.error(err);
    }
  };

  return (
    <div className={classes.wrapper}>
      <h2>Danger Zone</h2>
      <p>Manage sensitive account actions</p>

      <div className={classes.card}>
        <div className={classes.row}>
          <div>
            <h3>Logout</h3>
            <span>Sign out from your account</span>
          </div>

          <button
            className={classes.logoutBtn}
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>
        </div>
      </div>

      <div className={`${classes.card} ${classes.danger}`}>
        <div className={classes.row}>
          <div>
            <h3>Delete Account</h3>
            <span>Permanently delete your account</span>
          </div>

          <button
            className={classes.deleteBtn}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        message='Are you sure you want to logout?'
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        message='This action is irreversible. Delete account?'
      />

      {toast && <div className={classes.toast}>{toast}</div>}
    </div>
  );
}
