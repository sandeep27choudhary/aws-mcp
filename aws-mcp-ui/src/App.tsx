import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ResourcesPage from './pages/ResourcesPage';
import CloudFormationPage from './pages/CloudFormationPage';
import IAMManager from './pages/IAMManager';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/cloudformation" element={<CloudFormationPage />} />
          <Route path="/iam" element={<IAMManager />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;