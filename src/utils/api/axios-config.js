import axios from 'axios';
import env from '../../environment.config';
// import { token } from '../utils/auth';

const axiosConfig = axios.create({
	baseURL: `${env.api_url}api/`
});

const token = () => localStorage.getItem('access_token');

axiosConfig.interceptors.request.use((config) => {
	config.headers = { Authorization: `Bearer ${token()}` };
	return config;
});

export const getConfig = () => {
	const config = { ...axiosConfig.defaults };
	config.headers = { Authorization: `Bearer ${token()}` };
	return config;
};

export {
	axiosConfig
};
