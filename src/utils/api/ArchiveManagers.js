import { axiosConfig } from './axios-config';

export const getManagersWithStatusPassive = async () => await axiosConfig.get('manager/manager-with-status-passive');
