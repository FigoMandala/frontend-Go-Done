import Sidebar from './Sidebar';
import Topbar from './Topbar';

function MainLayout({ children }) {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Topbar - Full Width at Top */}
      <Topbar />
      
      {/* Content Area - Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden gap-4 p-4">
        {/* Sidebar - Left Side */}
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        
        {/* Main Content - Right Side */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
