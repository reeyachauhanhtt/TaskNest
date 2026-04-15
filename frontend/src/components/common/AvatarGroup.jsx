export default function AvatarGroup({ users = [], max = 4 }) {
  const visible = users.slice(0, max);
  const extra = users.length - max;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {visible.map((user, index) => {
        const initials = `${user.firstName[0]}${user.lastName[0]}`;

        return (
          <div
            key={user.id}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#ff6b00',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              border: '2px solid white',
              marginLeft: index === 0 ? 0 : -10,
              zIndex: 10 - index,
            }}
          >
            {initials}
          </div>
        );
      })}

      {extra > 0 && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#ddd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            marginLeft: -10,
          }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
