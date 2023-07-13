import { axiosConfig } from './axios-config';

export const getMonthlyTargetBaseOnEmployeeId = async (employeeid) => await axiosConfig.get(`check/total-target-of-hours-monthly-employee-id/${employeeid}`);
export const getWeeklyTargetBaseOnEmployee = async (employeeid) => await axiosConfig.get(`check/weekly-target-hours-employee/${employeeid}`);
