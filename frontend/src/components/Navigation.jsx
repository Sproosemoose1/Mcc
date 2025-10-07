import React from 'react';
import { Home, Clipboard, BarChart3, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navigation = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clipboard className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MCC</h1>
                <p className="text-xs text-gray-500">Maintenance & Construction Coordinator</p>
              </div>
            </div>

            <div className="hidden md:flex space-x-6">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'dashboard' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => setCurrentView('kanban')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'kanban' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Clipboard className="w-4 h-4" />
                <span>Inspections</span>
              </button>
              <button 
                onClick={() => setCurrentView('analytics')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'analytics' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {process.env.REACT_APP_API_URL?.includes('localhost') ? '192.168.1.100' : 'Connected'}
            </div>
            <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.role || 'user'}</p>
              </div>
              <button onClick={logout} className="text-gray-400 hover:text-gray-600">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
