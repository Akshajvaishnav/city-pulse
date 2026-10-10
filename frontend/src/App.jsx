import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { IssueProvider } from './context/IssueContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import IssueDetailsModal from './components/IssueDetailsModal';
import StatusUpdateModal from './components/StatusUpdateModal';
import CivicChatbotModal from './components/CivicChatbotModal';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ReportIssuePage from './pages/ReportIssuePage';
import AIDetectionPage from './pages/AIDetectionPage';
import InfrastructureMapPage from './pages/InfrastructureMapPage';
import IssueManagementPage from './pages/IssueManagementPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoginPage from './pages/LoginPage';
import FutureReadinessPage from './pages/FutureReadinessPage';
import CompareCitiesPage from './pages/CompareCitiesPage';
import MethodologyPage from './pages/MethodologyPage';

function MainApp() {
  const [activeTab, setActiveTab] = useState('landing');
  const [prefilledReportData, setPrefilledReportData] = useState(null);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'report':
        return (
          <ReportIssuePage
            setActiveTab={setActiveTab}
            prefilledData={prefilledReportData}
          />
        );
      case 'detect':
        return (
          <AIDetectionPage
            setActiveTab={setActiveTab}
            setPrefilledReportData={setPrefilledReportData}
          />
        );
      case 'map':
        return <InfrastructureMapPage />;
      case 'issues':
        return <IssueManagementPage setActiveTab={setActiveTab} />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'readiness':
        return <FutureReadinessPage setActiveTab={setActiveTab} />;
      case 'compare':
        return <CompareCitiesPage setActiveTab={setActiveTab} />;
      case 'methodology':
        return <MethodologyPage />;
      case 'login':
        return <LoginPage setActiveTab={setActiveTab} />;
      default:
        return <LandingPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Dynamic Background Noise / Gradient Layer */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.12),rgba(255,255,255,0))] pointer-events-none" />

      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Page Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-6">
        {renderActivePage()}
      </main>

      {/* Global Modals & Notifications */}
      <IssueDetailsModal />
      <StatusUpdateModal />
      <CivicChatbotModal setActiveTab={setActiveTab} />
      <Toast />


      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <IssueProvider>
        <MainApp />
      </IssueProvider>
    </AuthProvider>
  );
}
