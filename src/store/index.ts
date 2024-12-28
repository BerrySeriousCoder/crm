import { create } from 'zustand';
import { getProjects, deleteProject, updateProject, createProject } from '../api/project'; 
import { getClients, deleteClient, updateClient } from '../api/client'; 
import { getInvoices, deleteInvoice, updateInvoice, createInvoice } from '../api/invoice'; 
import { getTasks, deleteTask, createTask } from '../api/task'; 
import { Client, Project, Task, Invoice , ClientWithoutId, ProjectWithoutId, TaskWithoutId, InvoiceWithoutId} from '../types';

interface CRMStore {
  clients: Client[] ;
  projects: Project[] ;
  tasks: Task[] ;
  invoices: Invoice[] ;

  isFetched: {
    clients: boolean;
    projects: boolean;
    tasks: boolean;
    invoices: boolean;
  };

  fetchClients: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchInvoices: () => Promise<void>;

  deleteClient: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;

  createProject: (projectData: ProjectWithoutId) => Promise<void>
  createTask: (taskData : TaskWithoutId) => Promise<void>
  createInvoice: (invoiceData : InvoiceWithoutId) => Promise<void>

  updateClient: (id:string , clientData: ClientWithoutId) => Promise<void>
  updateProject: (id:string , projectData: ProjectWithoutId) => Promise<void>
  updateInvoice: (id:string , invoiceData: InvoiceWithoutId) => Promise<void>
}

export const useCRMStore = create<CRMStore>((set) => ({
  clients: [],
  projects: [],
  tasks: [],
  invoices: [],
  isFetched: {
    clients: false,
    projects: false,
    tasks: false,
    invoices: false,
  },

  // Fetch and cache clients
  fetchClients: async () => {
    try {
      const clients = await getClients();
      set(() => ({
        clients,
        isFetched: { clients: true, projects: false, tasks: false, invoices: false },
      }));
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  },

  // Fetch and cache projects
  fetchProjects: async () => {
    try {
      const projects = await getProjects();
      set((state) => ({
        projects,
        isFetched: { ...state.isFetched, projects: true },
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  },

  // Fetch and cache tasks
  fetchTasks: async () => {
    try {
      const tasks = await getTasks();
      set((state) => ({
        tasks,
        isFetched: { ...state.isFetched, tasks: true },
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  },

  // Fetch and cache invoices
  fetchInvoices: async () => {
    try {
      const invoices = await getInvoices();
      set((state) => ({
        invoices,
        isFetched: { ...state.isFetched, invoices: true },
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  },

  // Delete a client and update state
  deleteClient: async (id: string) => {
    try {
      await deleteClient(id);
      set((state) => ({
        clients: state.clients?.filter((client) => client._id !== id) || null,
      }));
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  },

  // Delete a project and update state
  deleteProject: async (id: string) => {
    try {
      await deleteProject(id);
      set((state) => ({
        projects: state.projects?.filter((project) => project._id !== id) || null,
      }));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  },

  // Delete a task and update state
  deleteTask: async (id: string) => {
    try {
      await deleteTask(id);
      set((state) => ({
        tasks: state.tasks?.filter((task) => task._id !== id) || null,
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  },

  deleteInvoice: async (id: string) => {
    try {
      await deleteInvoice(id);
      set((state) => ({
        invoices: state.invoices?.filter((invoice) => invoice._id !== id) || null,
      }));
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  }, 


  createProject: async (projectData : ProjectWithoutId) => {
    try{
       const newProject= await createProject(projectData) ;
      set((state) => ({
        projects : [...state.projects , newProject]
      }));
   
    }catch(error){
      console.error('Error creating project:', error);
    }
  } ,

  createTask: async (taskData : TaskWithoutId) => {
    try{
       const newTask= await createTask(taskData) ;
      set((state) => ({
        tasks : [...state.tasks , newTask]
      }));
   
    }catch(error){
      console.error('Error creating project:', error);
    }
  } ,
  createInvoice: async (invoiceData : InvoiceWithoutId) => {
    try{
       const newTask= await createInvoice(invoiceData) ;
      set((state) => ({
        invoices : [...state.invoices , newTask]
      }));
   
    }catch(error){
      console.error('Error creating project:', error);
    }
  } ,

  updateClient: async (id : string , clientData : ClientWithoutId ) => {
    try {
      await updateClient(id , clientData) ;
      set((state) => ({
        clients : state.clients.map((client) => {
          if (client._id == id) {
            return {
              ...clientData , _id : id 
            }
          } 
          return  client ;
        })
      }));
      
    }catch (error) {
      console.error('Error Updating invoice:', error);
    }
   } ,
  updateInvoice: async (id : string , invoiceData : InvoiceWithoutId ) => {
    try {
      await updateInvoice(id , invoiceData) ;
      set((state) => ({
        invoices : state.invoices.map((invoice) => {
          if (invoice._id == id) {
            return {
              ...invoiceData , _id : id 
            }
          } 
          return  invoice ;
        })
      }));
      
    }catch (error) {
      console.error('Error Updating invoice:', error);
    }
   } ,

  updateProject: async (id : string , projectData : ProjectWithoutId ) => {
    try {
      await updateProject(id , projectData) ;
      set((state) => ({
        projects : state.projects.map((project) => {
          if (project._id == id) {
            return {
              ...projectData , _id : id 
            }
          } 
          return  project ;
        })
      }));
      
    }catch (error) {
      console.error('Error Updating invoice:', error);
    }
   }
}));


