import { axiosConfig } from './axios-config';

export const getRemarks = async (id) => await axiosConfig.get(`remarks/list/${id}`);

export const AddRemarks = async (payload) => await axiosConfig.post('remarks/add', payload);
