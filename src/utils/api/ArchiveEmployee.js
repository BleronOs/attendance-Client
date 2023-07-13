import { axiosConfig } from './axios-config';

export const getEmployeeWithStatusPassive = async () => await axiosConfig.get('employee/employee-with-status-passive');
