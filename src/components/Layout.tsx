import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  CheckSquare, 
  FileText, 
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Projects', href: '/projects', icon: Briefcase },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Invoices', href: '/invoices', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 bg-indigo-600">
            <h1 className="text-xl font-bold text-white">Freelancer CRM</h1>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;