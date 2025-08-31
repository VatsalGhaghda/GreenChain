function AppMinimal() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'red', 
      minHeight: '100vh',
      color: 'white',
      fontSize: '24px'
    }}>
      <h1>MINIMAL APP WORKING</h1>
      <p>Time: {new Date().toLocaleString()}</p>
      <p>If you see this RED page, React is working</p>
    </div>
  );
}

export default AppMinimal;
