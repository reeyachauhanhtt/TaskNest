import classes from './SettingsSidebar.module.css';

export default function SettingsSidebar({ activeTab, setActiveTab }) {
  const sections = [
    {
      title: 'Account',
      items: [
        { key: 'profile', label: 'Profile', icon: '/icons/profile.svg' },
        { key: 'members', label: 'Members', icon: '/icons/members.svg' },
        {
          key: 'notifications',
          label: 'Notifications',
          icon: '/icons/notifications.svg',
          badge: 3,
        },
      ],
    },
    {
      title: 'Appearance',
      items: [{ key: 'appearance', label: 'Theme', icon: '/icons/theme.svg' }],
    },
    {
      title: 'Support',
      items: [
        { key: 'help', label: 'Help', icon: '/icons/help.svg' },
        { key: 'about', label: 'About', icon: '/icons/about.svg' },
      ],
    },
    {
      title: 'Danger',
      items: [
        {
          key: 'logout',
          label: 'Logout',
          icon: '/icons/logout.svg',
          danger: true,
        },
      ],
    },
  ];

  return (
    <div className={classes.sidebar}>
      <h2 className={classes.heading}>Preferences</h2>

      {sections.map((section) => (
        <div key={section.title} className={classes.section}>
          <p className={classes.sectionTitle}>{section.title}</p>

          {section.items.map((item) => (
            <div
              key={item.key}
              className={`${classes.item} 
    ${activeTab === item.key ? classes.active : ''} 
    ${item.danger ? classes.danger : ''}`}
              onClick={() => setActiveTab(item.key)}
            >
              <div className={classes.left}>
                <img src={item.icon} className={classes.icon} />
                <span>{item.label}</span>
              </div>

              {/* {item.badge && (
                <span className={classes.badge}>{item.badge}</span>
              )} */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
