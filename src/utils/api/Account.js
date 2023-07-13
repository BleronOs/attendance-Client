import { axiosConfig } from './axios-config';

export const getRole = async () => await axiosConfig.get('account/roles/list');

export const changePassword = async (payload) => await axiosConfig.put('account/change/password', payload);
export const confirmEmailLink = async (token, email) => await axiosConfig.post('account/confirm-email', { token, email });
export const sendEmailForResetPassword = async (email) => await axiosConfig.post('account/send-reset-password-url', email);
export const confirmEmailToChangePassword = async (payload) => await axiosConfig.post('account/reset-password', payload);
