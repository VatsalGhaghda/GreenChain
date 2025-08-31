export default function TestPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue', minHeight: '100vh' }}>
      <h1 style={{ color: 'black', fontSize: '24px' }}>TEST PAGE WORKING</h1>
      <p style={{ color: 'black' }}>If you can see this, React routing is working.</p>
      <p style={{ color: 'black' }}>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}
