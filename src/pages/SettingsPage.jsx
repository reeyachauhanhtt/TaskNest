import { useState } from 'react';

import SettingsSidebar from '../components/Settings/SettingsSidebar';
import ProfileSection from '../components/Settings/ProfileSection';
import ThemeSection from '../components/Settings/ThemeSection';
import LogoutSection from '../components/Settings/LogoutSection';
import AboutSection from '../components/Settings/AboutSection';
import HelpSection from '../components/Settings/HelpSection';
import MembersSection from '../components/Settings/MembersSection';
import NotificationsSection from '../components/Settings/NotificationsSection';
import classes from './SettingsPage.module.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <ProfileSection />;
      case 'members':
        return <MembersSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'appearance':
        return <ThemeSection />;
      case 'logout':
        return <LogoutSection />;
      case 'about':
        return <AboutSection />;
      case 'help':
        return <HelpSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <>
      <div className={classes.container}>
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className={classes.content}>{renderContent()}</div>
      </div>
    </>
  );
}
