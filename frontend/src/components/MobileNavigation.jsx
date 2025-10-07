const MobileNavigation = ({ currentView, setCurrentView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 md:hidden">
      <div className="flex justify-around">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-md ${
            currentView === 'dashboard' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Dashboard</span>
        </button>
        <button 
          onClick={() => setCurrentView('kanban')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-md ${
            currentView === 'kanban' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'
          }`}
        >
          <Clipboard className="w-5 h-5" />
          <span className="text-xs">Board</span>
        </button>
        <button 
          onClick={() => setCurrentView('analytics')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-md ${
            currentView === 'analytics' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs">Analytics</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;
