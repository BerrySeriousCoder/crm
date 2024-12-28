import { BarChart, Users, Briefcase, FileText } from 'lucide-react';

const Dashboard = () => {
  // const { clients, projects, tasks, invoices } = useCRMStore();

  // const stats = [
  //   { name: 'Total Clients', value: clients.length, icon: Users },
  //   { name: 'Active Projects', value: projects.length, icon: Briefcase },
  //   { name: 'Pending Tasks', value: tasks.length, icon: BarChart },
  //   { name: 'Unpaid Invoices', value: invoices.length, icon: FileText },
  // ];
  const stats = [
    { name: 'Total Clients', value: 0, icon: Users },
    { name: 'Active Projects', value: 0, icon: Briefcase },
    { name: 'Pending Tasks', value: 0, icon: BarChart },
    { name: 'Unpaid Invoices', value: 0, icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <stat.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600">No recent activity</p>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Tasks
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600">No upcoming tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;