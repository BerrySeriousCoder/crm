import axios from 'axios';
import { ClientWithoutId } from '../types';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api/clients`;

export const createClient = async (clientData: any) => {
  try {
    const response = await axios.post(API_URL, clientData);
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

export const updateClient = async (id: string, clientData: ClientWithoutId) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, clientData);
    return response.data;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

export const getClients = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

export const getClientById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    throw error;
  }
};

export const deleteClient =  async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data;
  } catch (error) {
   console.error('Error deleting client by ID' , error)
   throw error ;
  }

}