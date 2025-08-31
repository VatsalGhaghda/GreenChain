import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import IssueBatch from './pages/IssueBatch';
import PendingApprovalsSimple from './pages/PendingApprovalsSimple';
import TestPage from './pages/TestPage';
import Marketplace from './pages/Marketplace';
import MyBatches from './pages/MyBatches';
import ApprovedBatches from './pages/ApprovedBatches';
import Certificates from './pages/Certificates';
import ComplianceOverview from './pages/ComplianceOverview';
import AuditTrail from './pages/AuditTrail';
import Portfolio from './pages/Portfolio';
import RetireCredits from './pages/RetireCredits';
import FraudDemo from './pages/FraudDemo';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/test" element={<TestPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="pending-approvals" element={<ErrorBoundary><PendingApprovalsSimple /></ErrorBoundary>} />
            <Route path="my-batches" element={<ErrorBoundary><MyBatches /></ErrorBoundary>} />
            <Route path="marketplace" element={<ErrorBoundary><Marketplace /></ErrorBoundary>} />
            <Route path="issue-batch" element={<ErrorBoundary><IssueBatch /></ErrorBoundary>} />
            <Route path="fraud-demo" element={<ErrorBoundary><FraudDemo /></ErrorBoundary>} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
