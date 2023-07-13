import { axiosConfig } from './axios-config';

export const getModules = async () => await axiosConfig.get('modules/list');

export const getModulesAcces = async (roleid, moduleid) => await axiosConfig.put(`modules-access/update/module/access/${roleid}/${moduleid}`);

export const getModulesStatus = async () => await axiosConfig.get('modules-access/list');

export const getRoleModuleActive = async (roleid) => await axiosConfig.get(`modules-access/list/role/modules/${roleid}`);

export const addRole = async (payload) => await axiosConfig.post('role/add', payload);
