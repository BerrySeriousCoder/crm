import { useCRMStore } from '../../store';
import { Edit, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Project } from '../../types';
import ConfirmDialog from '../ui/ConfirmDialog';
import Modal from '../ui/Modal';
import ProjectForm from './ProjectForm';

const ProjectList = () => {


  const projects = useCRMStore((state) => state.projects);
  const clients = useCRMStore((state) => state.clients);
  const isProjectsFetched = useCRMStore((state) => state.isFetched.projects);
  const isClientsFetched = useCRMStore((state) => state.isFetched.clients);
  const fetchClients = useCRMStore((state) => state.fetchClients);
  const fetchProjects = useCRMStore((state) => state.fetchProjects);
  const deleteProjects = useCRMStore((state) => state.deleteProject)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {

    if(!isClientsFetched){
      fetchClients();
    
    }
    if(!isProjectsFetched){
      fetchProjects();
    }

  },[isProjectsFetched , isClientsFetched , fetchClients , fetchProjects])


  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProject) {
      deleteProjects(selectedProject._id); 
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };


  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c._id === clientId);
    return client?.name || 'Unknown Client';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Budget
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No projects found. Add your first project to get started.
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr key={project._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {project.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {project.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {getClientName(project.clientId)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[project.status]}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(project.startDate, 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${project.budget.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button variant="secondary" 
                  onClick={() => handleEdit(project)}
                  icon={Edit}>
                    Edit
                  </Button>
                  <Button variant="outline" 
                   onClick={() => handleDelete(project)}
                  icon={Trash2}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {selectedProject && (
        <>
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProject(null);
            }}
            title="Edit Client"
          >
            <ProjectForm
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedProject(null);
              }}
              project={selectedProject}
            />
          </Modal>

          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedProject(null);
            }}
            onConfirm={confirmDelete}
            title="Delete Client"
            message={`Are you sure you want to delete ${selectedProject.name}? This action cannot be undone and will also delete all associated  tasks, and invoices.`}
          />
        </>
      )}
    </div>
  );
};

export default ProjectList;