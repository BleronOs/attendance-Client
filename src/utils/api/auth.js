import { axiosConfig } from './axios-config';

export const authenticate = async (payload) => await axiosConfig.post('account/login', payload);
export const getInvoicers = async () => await axiosConfig.get('user/invoicers');
