export const Header = () => {
  return (
    <header
      style={{
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        borderBottom: '1px solid #333',
      }}
    >
      <h1>🔐 AuthSystemPro</h1>
      <p style={{ margin: '10px 0', fontSize: '14px', color: '#999' }}>
        Clean Architecture Authentication System
      </p>
    </header>
  );
};
