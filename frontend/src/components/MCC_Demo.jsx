import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import Navigation from './Navigation';
import Dashboard from './Dashboard';
import KanbanBoard from './KanbanBoard';
import Analytics from './Analytics';
import InspectionModal from './InspectionModal';
import CreateInspectionModal from './CreateInspectionModal';
import MobileNavigation from './MobileNavigation';
import LiveIndicator from './LiveIndicator';

const MCC_Demo = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      
      <main>
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'kanban' && (
          <KanbanBoard 
            onSelectInspection={setSelectedInspection}
            onCreateNew={() => setShowCreateModal(true)}
          />
        )}
        {currentView === 'analytics' && <Analytics />}
      </main>

      {selectedInspection && (
        <InspectionModal 
          inspection={selectedInspection}
          onClose={() => setSelectedInspection(null)}
        />
      )}

      {showCreateModal && (
        <CreateInspectionModal onClose={() => setShowCreateModal(false)} />
      )}

      <MobileNavigation currentView={currentView} setCurrentView={setCurrentView} />
      <LiveIndicator />
    </div>
  );
};

export default MCC_Demo;
