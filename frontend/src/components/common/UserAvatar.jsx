export default function UserAvatar({ user, size = 28, showName = true }) {
  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  const avatar = (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#ff6b00',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 500,
      }}
    >
      {initials}
    </div>
  );

  if (!showName) return avatar;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {avatar}
      <span>
        {user.firstName} {user.lastName}
      </span>
    </div>
  );
}
