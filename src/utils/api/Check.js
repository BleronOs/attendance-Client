import { axiosConfig, getConfig } from './axios-config';

export const getChecks = async () => await axiosConfig.get('check/list');
export const addCheck = async (payload) => await axiosConfig.post('check/add', payload);
export const getChecksToday = async (dateTime) => {
    const config = getConfig();
    const params = { dateTime };
    config.params = params;
    return await axiosConfig.get('check/todays-checks/list', config);
};

export const getChecksByEmployeeId = async (employeeId) => await axiosConfig.get(`check/checks-by-employee-id/${employeeId}`);
export const getChecksTodayByEmployeeId = async (dateTime, employeeId) => {
    const config = getConfig();
    const params = { dateTime, employeeId };
    config.params = params;
    return await axiosConfig.get(`/check/todays-checks-by-employee-id/${employeeId}`, config);
};

export const getEmployeeChecksByEmployeeId = async (employeeId) => await axiosConfig.get(`check/employee-checks-by-employee-id/${employeeId}`);
export const getEmployeeChecksTodayByEmployeeId = async (dateTime, employeeId) => {
    const config = getConfig();
    const params = { dateTime, employeeId };
    config.params = params;
    return await axiosConfig.get(`/check/employee-checks-by-employee-id-and-datetime/${employeeId}`, config);
};
