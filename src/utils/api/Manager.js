import { axiosConfig } from './axios-config';

export const getManagers = async () => await axiosConfig.get('manager/list');
export const updateManager = async (managerId, payload) => await axiosConfig.put(`manager/update/${managerId}`, payload);
export const deleteManagers = async (managerId) => await axiosConfig.put(`manager/update/status/${managerId}`);
export const addManagers = async (payload) => await axiosConfig.post('manager/add', payload);
export const getEmployeeManagers = async () => await axiosConfig.get('manager/employee-list');
export const getManagersNotTwice = async () => await axiosConfig.get('employee/not-linked-manager-twice');
export const getManagersWithStatusActive = async () => await axiosConfig.get('manager/manager-with-status-active');
