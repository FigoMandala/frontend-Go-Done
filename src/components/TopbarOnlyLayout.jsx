import Topbar from './Topbar';

function TopbarOnlyLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Topbar />

      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}

export default TopbarOnlyLayout;
