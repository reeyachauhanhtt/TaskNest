import { useState } from 'react';
import classes from './NotificationsSection.module.css';

const defaultSettings = {
  // In-app
  taskAssigned: true,
  taskUpdated: true,
  taskCommented: true,
  taskDueSoon: true,
  projectInvite: true,
  memberJoined: false,

  // Email
  emailTaskAssigned: false,
  emailDailySummary: false,
  emailWeeklyReport: true,
  emailProjectUpdates: false,

  // Quiet Hours
  quietHoursEnabled: false,
  quietFrom: '22:00',
  quietTo: '08:00',
};

const Toggle = ({ checked, onChange }) => (
  <button
    className={`${classes.toggle} ${checked ? classes.toggleOn : ''}`}
    onClick={() => onChange(!checked)}
    role="switch"
    aria-checked={checked}
  >
    <span className={classes.thumb} />
  </button>
);

export default function NotificationsSection() {
  const [settings, setSettings] = useState(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const set = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSuccessMsg('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg('');
    // Simulate save (replace with real API call)
    await new Promise((res) => setTimeout(res, 800));
    setIsSaving(false);
    setSuccessMsg('Notification preferences saved');
  };

  return (
    <div className={classes.wrapper}>
      {/* Header */}
      <div className={classes.header}>
        <div className={classes.icon}>🔔</div>
        <div>
          <h2>Notifications</h2>
          <p>Control what alerts you receive and how</p>
        </div>
      </div>

      <div className={classes.divider} />

      {/* In-App Notifications */}
      <p className={classes.sectionTitle}>In-App</p>
      <div className={classes.card}>
        <Row
          label="Task assigned to you"
          desc="Get notified when someone assigns a task to you"
          checked={settings.taskAssigned}
          onChange={(v) => set('taskAssigned', v)}
        />
        <Row
          label="Task updated"
          desc="Alerts when a task you're involved in is modified"
          checked={settings.taskUpdated}
          onChange={(v) => set('taskUpdated', v)}
        />
        <Row
          label="New comment on task"
          desc="Receive notifications for new comments"
          checked={settings.taskCommented}
          onChange={(v) => set('taskCommented', v)}
        />
        <Row
          label="Due date approaching"
          desc="Reminder 24 hours before a task is due"
          checked={settings.taskDueSoon}
          onChange={(v) => set('taskDueSoon', v)}
        />
        <Row
          label="Project invitation"
          desc="When you're added to a new project"
          checked={settings.projectInvite}
          onChange={(v) => set('projectInvite', v)}
        />
        <Row
          label="Member joined project"
          desc="When a new member joins your project"
          checked={settings.memberJoined}
          onChange={(v) => set('memberJoined', v)}
          last
        />
      </div>

      {/* Email Notifications */}
      <p className={classes.sectionTitle}>Email</p>
      <div className={classes.card}>
        <Row
          label="Task assigned — email"
          desc="Receive an email when a task is assigned to you"
          checked={settings.emailTaskAssigned}
          onChange={(v) => set('emailTaskAssigned', v)}
        />
        <Row
          label="Daily summary"
          desc="Morning digest of your pending and overdue tasks"
          checked={settings.emailDailySummary}
          onChange={(v) => set('emailDailySummary', v)}
        />
        <Row
          label="Weekly report"
          desc="Project progress overview every Monday"
          checked={settings.emailWeeklyReport}
          onChange={(v) => set('emailWeeklyReport', v)}
        />
        <Row
          label="Project updates"
          desc="Email when a project status changes"
          checked={settings.emailProjectUpdates}
          onChange={(v) => set('emailProjectUpdates', v)}
          last
        />
      </div>

      {/* Quiet Hours */}
      <p className={classes.sectionTitle}>Quiet Hours</p>
      <div className={classes.card}>
        <Row
          label="Enable quiet hours"
          desc="Suppress all notifications during the selected window"
          checked={settings.quietHoursEnabled}
          onChange={(v) => set('quietHoursEnabled', v)}
        />

        {settings.quietHoursEnabled && (
          <div className={classes.timeRow}>
            <div className={classes.timeField}>
              <label>FROM</label>
              <input
                type="time"
                value={settings.quietFrom}
                onChange={(e) => set('quietFrom', e.target.value)}
                className={classes.timeInput}
              />
            </div>
            <span className={classes.timeSep}>→</span>
            <div className={classes.timeField}>
              <label>TO</label>
              <input
                type="time"
                value={settings.quietTo}
                onChange={(e) => set('quietTo', e.target.value)}
                className={classes.timeInput}
              />
            </div>
          </div>
        )}
      </div>

      <button onClick={handleSave} disabled={isSaving} className={classes.save}>
        {isSaving ? 'Saving...' : 'Save preferences'}
      </button>

      {successMsg && <p className={classes.success}>{successMsg}</p>}
    </div>
  );
}

function Row({ label, desc, checked, onChange, last }) {
  return (
    <div className={`${classes.row} ${last ? classes.rowLast : ''}`}>
      <div className={classes.rowText}>
        <span className={classes.rowLabel}>{label}</span>
        <span className={classes.rowDesc}>{desc}</span>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
