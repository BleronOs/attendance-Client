import { axiosConfig } from './axios-config';

export const getJobPositions = async () => await axiosConfig.get('job-position/list');
export const deleteJobPosition = async (jobPositionId) => await axiosConfig.put(`job-position/delete/${jobPositionId}`);
export const updateJobPosition = async (jobPositionId, payload) => await axiosConfig.put(`job-position/update/${jobPositionId}`, payload);
export const addJobPosition = async (payload) => await axiosConfig.post('job-position/add', payload);

// job Position with status True
export const getJobPositionWithStatusTrue = async () => await axiosConfig.get('job-position/status/true');
