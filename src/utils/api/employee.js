import { axiosConfig } from './axios-config';

export const getEmployee = async () => await axiosConfig.get('employee/list');
export const updateEmployee = async (employeeId, payload) => await axiosConfig.put(`employee/update/${employeeId}`, payload);
export const updateEmployeeToSendToArchive = async (employeeId, notes, email, payload) => await axiosConfig.put(`employee/update-employee-to-send-to-archive/${employeeId}/${notes}/${email}`, payload);
export const deleteEmployee = async (employeeId) => await axiosConfig.put(`employee/update/status/${employeeId}`);
export const addEmployee = async (payload) => await axiosConfig.post('employee/add', payload);
export const getEmployeeNotLinkedWithMangers = async () => await axiosConfig.get('employee/not-linked-with-manager');
export const getEmployeeJobPosition = async () => await axiosConfig.get('employee/employee-job-position');
export const getEmployeeNotTwoJobs = async () => await axiosConfig.get('employee/employee-not-two-rolesjobs');
export const getEmployeeThatAreNotManager = async () => await axiosConfig.get('employee/employee-that-are-not-manager');
export const getEmployeeNotLinkedIntoEmployeeManagment = async () => await axiosConfig.get('employee/employee-not-linked-into-employee-managment');
export const getEmployeeWithStatusActive = async () => await axiosConfig.get('employee/employee-with-status-active');
export const getEmployeeBasedInManagerId = async (employeeId) => await axiosConfig.get(`employee/employee-by-manager-id/${employeeId}`);
export const updateManagerStatusToTrueIfEmployeeStatusIsTrue = async (employeeId) => await axiosConfig.put(`employee/employee-managers/${employeeId}`);
