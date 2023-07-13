import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Box,
    Flex,
    Select,
    FormLabel
} from '@chakra-ui/react';
import { getEmployeeThatAreNotManager } from 'utils/api/employee';
import { toast, ToastContainer } from 'react-toastify';
import Card from 'components/card/Card';
import { updateEmployeeManagment } from 'utils/api/EmployeeManagment';
import { getEmployeeManagers } from 'utils/api/Manager';
import { useTranslation } from 'react-i18next';

const showSuccess = (successMessage) => {
    toast.success(successMessage, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};
const showError = (errorMessage) => {
    toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};
const UpdateEmployeeModal = ({
    showModal,
    closeModal,
    selectedEmployeeManagment
}) => {
    const [tableDataColumns, setTableDataColumns] = useState([]);
    const [tableDataColumnsManager, setTableDataColumnsManager] = useState([]);
    const [managerId, setManagerId] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const { t } = useTranslation();
    // selcet employee

    const fetchEmployeeThatAreNotManager = async () => {
        try {
            const res = await getEmployeeThatAreNotManager();
            const result = res.data;
            setTableDataColumns(result);
        } catch (err) {
            showError(t('toast_card_notification:text_error'));
        }
    };
    useEffect(() => {
        fetchEmployeeThatAreNotManager();
    }, []);

    const fetchManager = async () => {
        try {
            const res = await getEmployeeManagers();
            const result = res.data;
            console.log(result, 'result');
            setTableDataColumnsManager(result);
        } catch (err) {
            showError(t('toast_card_notification:text_error'));
        }
    };
    useEffect(() => {
        fetchManager();
    }, []);

    useEffect(() => {
        if (!selectedEmployeeManagment) return;
        setManagerId(selectedEmployeeManagment.managerId);
        setEmployeeId(selectedEmployeeManagment.employeeId);
    }, [selectedEmployeeManagment]);
    const onUpdateJobPosition = async () => {
        const payload = {
            employeeId,
            managerId,
        };
        updateEmployeeManagment(selectedEmployeeManagment.id, payload)
            .then(() => {
                showSuccess(t('employee_managment_modal:text_update_employee_managment_success'));
                fetchManager();
            })
            .catch(() => {
                showError(t('toast_card_notification:text_error'));
            })
            .finally(() => {
                closeModal();
            });
    };
    return (
        <Modal isOpen={showModal} onClose={closeModal} colorScheme="brandScheme">
            <ToastContainer />
            <ModalOverlay />
            <ModalContent colorScheme="brandScheme">
                <form>
                    <Card>
                        <ModalHeader>
                            {t('employee_managment_update:text_employee_managment_update_button_header')}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box>
                                <Flex flexDirection="column" alignItems="center">
                                <FormLabel htmlFor="invoicers">
                                {t('employee_managment_update:text_employee_managment_select_manager')}
                                </FormLabel>
                                <Select value={managerId} onChange={(e) => setManagerId(e.target.value)}>
                                        {tableDataColumnsManager && tableDataColumnsManager.length && tableDataColumnsManager.map((data) => (
                                            <option value={data.id}>
                                                {data.employee.firstName}
                                                {' '}
                                                {data.employee.lastName}
                                            </option>
                                        ))}
                                </Select>
                                    <FormLabel htmlFor="invoicers">
                                    {t('employee_managment_update:text_employee_managment_select_employee')}
                                    </FormLabel>
                                    <Select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
                                        {tableDataColumns && tableDataColumns.length && tableDataColumns.map((data) => (
                                            <option value={data.id}>
                                                {data.firstName}
                                                {' '}
                                                {data.lastName}
                                            </option>
                                        ))}
                                    </Select>
                                </Flex>

                            </Box>
                        </ModalBody>
                        <ModalFooter justifyContent="center">
                            <Button colorScheme="blue" mr={3} onClick={onUpdateJobPosition}>
                            {t('employee_managment_update:text_employee_managment_save_button')}
                            </Button>
                        </ModalFooter>
                    </Card>
                </form>
            </ModalContent>
        </Modal>
    );
};
export default UpdateEmployeeModal;
