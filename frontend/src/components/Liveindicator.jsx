const LiveIndicator = () => {
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-white rounded-full shadow-lg px-3 py-2 flex items-center space-x-2 border border-gray-200">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs font-medium text-gray-700">Live</span>
        <span className="text-xs text-gray-500">Connected</span>
      </div>
    </div>
  );
};

export default LiveIndicator;
