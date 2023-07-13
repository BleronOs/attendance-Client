import { axiosConfig } from './axios-config';

export const getWeeklyStatistics = async () => await axiosConfig.get('check/weekly/statistics');

export const getWeeklyTarger = async () => await axiosConfig.get('check/total-target-of-hours');

export const getMonthlyTarget = async () => await axiosConfig.get('check/total-target-of-hours-monthly');

// Dashboard EmployeeManagment Api's

export const getEmployeesManagments = async (managerId) => await axiosConfig.get(`dashboard/list-employees/${managerId}`);

export const getPassiveEmployeesManagments = async (managerId) => await axiosConfig.get(`dashboard/list-pasive-employees/${managerId}`);

export const getPassiveCardsManagments = async (managerId) => await axiosConfig.get(`dashboard/list-pasive-cards/${managerId}`);

export const getTrueCardsManagments = async (managerId) => await axiosConfig.get(`dashboard/list-active-cards/${managerId}`);

export const getWeeklyTargerByManager = async (managerId) => await axiosConfig.get(`dashboard/total-target-of-hours/${managerId}`);

export const getWeeklyStatisticsByManager = async (managerId) => await axiosConfig.get(`dashboard/weekly/statistics/${managerId}`);

export const getWeeklyStatisticForAnEmployee = async (employeeId) => await axiosConfig.get(`dashboard/total-target-of-hours-for-an-employee/${employeeId}`);

export const getMonthlyStaisticForAnEmployee = async (employeeId) => await axiosConfig.get(`dashboard/total-target-of-hours-monthly-employee/${employeeId}`);

// Profile

export const getEvideceForEachWeekOfMonth = async (employeeId) => await axiosConfig.get(`check/total-weekly-target-of-hours-monthly/${employeeId}`);
