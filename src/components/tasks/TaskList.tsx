import { useCRMStore } from '../../store';
import { Edit, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import ConfirmDialog from '../ui/ConfirmDialog';
import TaskForm from './TaskForm';
import Modal from '../ui/Modal';
import { Task } from '../../types';

const TaskList = () => {

  const projects = useCRMStore((state) => state.projects);
  const clients = useCRMStore((state) => state.clients);
  const tasks = useCRMStore((state) => state.tasks);
  const isProjectsFetched = useCRMStore((state) => state.isFetched.projects);
  const isClientsFetched = useCRMStore((state) => state.isFetched.clients);
  const isTasksFetched = useCRMStore((state) => state.isFetched.tasks);
  const fetchClients = useCRMStore((state) => state.fetchClients);
  const fetchProjects = useCRMStore((state) => state.fetchProjects);
  const fetchTasks = useCRMStore((state) => state.fetchTasks);
  const deleteTask = useCRMStore((state) => state.deleteTask)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!isClientsFetched) {
      fetchClients(); 
      if(!isProjectsFetched){
        fetchProjects()
      }
      if(!isTasksFetched){
         fetchTasks()
      }
    }
 

}, [isClientsFetched,fetchClients,isProjectsFetched,fetchProjects,isTasksFetched,fetchTasks]);

const handleDelete = (task: Task) => {
  setSelectedTask(task);
  setIsDeleteDialogOpen(true);
};

const confirmDelete = () => {
  if (selectedTask) {
    deleteTask(selectedTask._id); 
  }
};

const handleEdit = (task: Task) => {
  setSelectedTask(task);
  setIsEditModalOpen(true);
};

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const getClientName = (clientId?: string) => {
    if (!clientId) return 'N/A';
    const client = clients.find(c => c._id === clientId);
    return client?.name || 'Unknown Client';
  };

  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'N/A';
    const project = projects.find(p => p._id === projectId);
    return project?.name || 'Unknown Project';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Task
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project/Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No tasks found. Add your first task to get started.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {task.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {task.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {getProjectName(task.projectId)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getClientName(task.clientId)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[task.status]}`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(task.dueDate, 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button variant="secondary" 
                  onClick={() => handleEdit(task)}
                  icon={Edit}>
                    Edit
                  </Button>
                  <Button variant="outline" 
                   onClick={() => handleDelete(task)}
                  icon={Trash2}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {selectedTask && (
        <>
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedTask(null);
            }}
            title="Edit Client"
          >
            <TaskForm
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedTask(null);
              }}
              task={selectedTask}
            />
          </Modal>

          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedTask(null);
            }}
            onConfirm={confirmDelete}
            title="Delete Client"
            message={`Are you sure you want to delete ${selectedTask.title}? This action cannot be undone and will also delete all associated  tasks, and invoices.`}
          />
        </>
      )}
    </div>
  );
};

export default TaskList;