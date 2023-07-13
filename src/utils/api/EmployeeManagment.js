import { axiosConfig } from './axios-config';

export const getEmployeeManagment = async () => await axiosConfig.get('employee-managment/list');
export const updateEmployeeManagment = async (Id, payload) => await axiosConfig.put(`employee-managment/update/${Id}`, payload);
export const deleteEmployeeManagment = async (Id) => await axiosConfig.delete(`employee-managment/delete/${Id}`);
export const addEmployeeManagment = async (payload) => await axiosConfig.post('employee-managment/add', payload);
export const getManagers = async (payload) => await axiosConfig.post('manager/employee-list', payload);
export const getManagersByRoleId = async (employeeId) => await axiosConfig.get(`employee-managment/manager-by-role-id/${employeeId}`);
