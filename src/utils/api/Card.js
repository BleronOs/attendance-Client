import { axiosConfig } from './axios-config';

export const getCard = async () => await axiosConfig.get('card/list');
export const updateCard = async (cardId, payload) => await axiosConfig.put(`card/update/${cardId}`, payload);
export const deleteCard = async (cardId) => await axiosConfig.put(`card/update/status/${cardId}`);
export const addCard = async (payload) => await axiosConfig.post('card/add', payload);

export const getCardsWithStatusTrue = async () => await axiosConfig.get('card/eligible-employee-list');
export const getEmployeeWithoutCardAndStatusFalse = async () => await axiosConfig.get('employee/deactivated-and-with-no-card');

// archive
export const getCardWithStatusFalse = async () => await axiosConfig.get('card/status/false');

// get Card True
export const GetCardStatusTrueFromFalse = async (cardId, employeeId, cardRefId, status) => await axiosConfig.put(`card/update/status/true/${cardId}/${employeeId}/${cardRefId}/${status}`);

// get Card By EmployeeId
export const getCardByEmployeeId = async (employeeId) => await axiosConfig.get(`card/card-by-employee-id/${employeeId}`);

// update Card if employee is active
export const UpdateCardStatusIfEmployeeIsActive = async (id, employeeId, statusi, cardRefId) => await axiosConfig.put(`card/update/card-if-employee-is-active/${id}/${employeeId}/${statusi}/${cardRefId}`);
