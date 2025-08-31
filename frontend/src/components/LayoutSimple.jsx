import { Outlet } from 'react-router-dom';

export default function LayoutSimple() {
  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ marginBottom: '20px', padding: '10px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h1 style={{ margin: 0, color: '#1f2937' }}>Green Hydrogen Registry</h1>
        <p style={{ margin: '5px 0 0 0', color: '#6b7280' }}>Layout is working</p>
      </header>
      
      <main>
        <Outlet context={{ currentRole: 'producer' }} />
      </main>
    </div>
  );
}
