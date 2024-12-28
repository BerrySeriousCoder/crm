import React, { useState } from 'react';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Task, TaskWithoutId } from '../../types';
import { CheckSquare } from 'lucide-react';
import { useCRMStore } from '../../store';

interface TaskFormProps {
  onClose: () => void; 
  task?: Task
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose , task }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const projects = useCRMStore((state) => state.projects);
  const isProjectsFetched = useCRMStore((state) => state.isFetched.projects)
  const clients = useCRMStore((state) => state.clients);
  const isClientsFetched = useCRMStore((state) => state.isFetched.clients);
  const fetchClients = useCRMStore((state) => state.fetchClients);
  const fetchProjects = useCRMStore((state) => state.fetchProjects);
  const createTask = useCRMStore((state) => state.createTask);
  

  const [formData, setFormData] = useState({
    title:  task?.title ||'',
    description:  task?.description ||'',
    projectId: task?.projectId ||'',
    clientId: task?.clientId||'',
    priority: task?.priority ||'medium' as Task['priority'],
    status:  task?.status ||'todo' as Task['status'],
    dueDate: new Date().toISOString().split('T')[0],
  });


  React.useEffect(() => {
      if (!isClientsFetched) {
        fetchClients(); 
        if(!isProjectsFetched){
          fetchProjects()
        }
      }
   

  }, [isClientsFetched,fetchClients,isProjectsFetched,fetchProjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const newTask:TaskWithoutId = {
        title: formData.title,
        description: formData.description,
        projectId: formData.projectId,
        clientId: formData.clientId,
        priority: formData.priority,
        status: formData.status,
        dueDate: new Date(formData.dueDate),
      };

      await createTask(newTask);
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <FormField label="Task Title" htmlFor="title">
          <Input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            disabled={isLoading}
          />
        </FormField>

        <FormField label="Project" htmlFor="projectId">
          <Select
            id="projectId"
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            disabled={isLoading}
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <FormField label="Client" htmlFor="clientId">
          <Select
            id="clientId"
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            disabled={isLoading}
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name} - {client.company}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Due Date" htmlFor="dueDate">
          <Input
            type="date"
            id="dueDate"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
            disabled={isLoading}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <FormField label="Priority" htmlFor="priority">
          <Select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
            disabled={isLoading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </FormField>

        <FormField label="Status" htmlFor="status">
          <Select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
            disabled={isLoading}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
        </FormField>
      </div>

      <FormField label="Description" htmlFor="description">
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
          disabled={isLoading}
        />
      </FormField>


      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          icon={CheckSquare}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : (task ? 'Save Changes' : 'Add Task')}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;