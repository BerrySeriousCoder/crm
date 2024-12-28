import axios from 'axios';
import { ProjectWithoutId } from '../types';
const API_BASE = process.env.REACT_APP_API_BASE_URL;
const API_BASE_URL = `${API_BASE}/api`; 

// Create a new project
export const createProject = async (projectData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/projects`, projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Get all projects
export const getProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Get a single project by ID
export const getProjectById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

// Update a project by ID
export const updateProject = async (id: string, updatedData: ProjectWithoutId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/projects/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete a project by ID
export const deleteProject = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
