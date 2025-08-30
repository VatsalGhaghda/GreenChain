import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Dashboard />} />
          {/* Add placeholder routes for navigation */}
          <Route path='issue-batch' element={<div className="p-6"><h1 className="text-2xl font-bold">Issue Batch</h1><p className="text-gray-600">This page will be implemented next.</p></div>} />
          <Route path='my-batches' element={<div className="p-6"><h1 className="text-2xl font-bold">My Batches</h1><p className="text-gray-600">This page will be implemented next.</p></div>} />
          <Route path='marketplace' element={<div className="p-6"><h1 className="text-2xl font-bold">Marketplace</h1><p className="text-gray-600">This page will be implemented next.</p></div>} />
          <Route path='approvals' element={<div className="p-6"><h1 className="text-2xl font-bold">Pending Approvals</h1><p className="text-gray-600">This page will be implemented next.</p></div>} />
          <Route path='approved-batches' element={<div className="p-6"><h1 className="text-2xl font-bold">Approved Batches</h1><p className="text-gray-600">This page will be implemented next.</p></div>} />
          <Route path='certificates' element={<div className="p-6"><h1 className="text-2xl font-bold">Certificates</h1><p className="text-gray-600">This page will be implemented next.</p></div>} />
          <Route path='compliance' element={<div className="p-6"><h1 className="text-2xl font-bold">Compliance Overview</h1><p className="text-gray-600">This page will be implemented next.</p></div>} />
          <Route path='audit-trail' element={<div className="p-6"><h1 className="text-2xl font-bold">Audit Trail</h1><p className="text-gray-600">This page will be implemented next.</p></div>} />
          <Route path='portfolio' element={<div className="p-6"><h1 className="text-2xl font-bold">My Portfolio</h1><p className="text-gray-600">This page will be implemented next.</p></div>} />
          <Route path='retire' element={<div className="p-6"><h1 className="text-2xl font-bold">Retire Credits</h1><p className="text-gray-600">This page will be implemented next.</p></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;