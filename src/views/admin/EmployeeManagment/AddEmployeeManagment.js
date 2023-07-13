import React, { useEffect, useState } from 'react';
import {
    Button, Flex, Select,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormLabel
} from '@chakra-ui/react';
import { addEmployeeManagment } from 'utils/api/EmployeeManagment';
import { getEmployeeNotLinkedWithMangers } from 'utils/api/employee';
import { getManagersWithStatusActive } from 'utils/api/Manager';
import Card from 'components/card/Card';
import { toast } from 'react-toastify';

const test = ({
 reloadWorkPositions, isOpenModal, onCloseModal, t
}) => {
    const [employeeId, setEmployeId] = useState('');
    const [managerId, setManagerId] = useState('');

    const [tableDataColumns, setTableDataColumns] = useState([]);
    const [tableDataColumnsManager, setTableDataColumnsManager] = useState([]);

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

    const showError = (errorrMessage) => {
        toast.error(errorrMessage, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const validation = () => {
        if (!managerId || !employeeId) {
            showError(t('add_employee_modal:text_add_field'));
            return false;
        }
        return true;
    };
    const fetchEmployee = async () => {
        try {
            const res = await getEmployeeNotLinkedWithMangers();
            const result = res.data;
            setTableDataColumns(result);
        } catch (err) {
            showError(t('toast_card_notification:text_error'));
        }
    };
    useEffect(() => {
        fetchEmployee();
    }, []);

    const fetchManager = async () => {
        try {
            const res = await getManagersWithStatusActive();
            const result = res.data;
            setTableDataColumnsManager(result);
        } catch (err) {
            t('toast_card_notification:text_error');
        }
    };
    useEffect(() => {
        fetchManager();
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        const payload = {
            managerId,
            employeeId
        };
        if (!validation()) return;
        addEmployeeManagment(payload)
            .then(() => {
                reloadWorkPositions();
                setEmployeId('');
                setManagerId('');
                showSuccess(t('toast_employee_managment_notification:text_add_success'));
                fetchEmployee();
                fetchManager();
            })
            .catch(() => {
                showError(t('toast_card_notification:text_error'));
            });
            // .finally(() => {
            //     reloadWorkPositions();
            //     setEmployeId('');
            //     setManagerId('');
            //     showSuccess(t('toast_employee_managment_notification:text_add_success'));
            //     fetchEmployee();
            //     fetchManager();
            // });
        onCloseModal(true);
    };

    const handleChange = (event) => {
        setEmployeId(event.target.value);
    };
    const handleChangeManager = (event) => {
        setManagerId(event.target.value);
    };
    return (
        <form>
            <Modal isOpen={isOpenModal} onClose={onCloseModal} colorScheme="brandScheme">
            <ModalOverlay />
            <ModalContent colorScheme="brandScheme">
                    <Card>
                        <ModalHeader>
                            {t('employee_managment_modal:text_add_employee_managment_header')}
                        </ModalHeader>
                            <ModalCloseButton />
                            <form>
                        <ModalBody>

                    <Flex flexDirection="column" alignItems="center">

                    <FormLabel htmlFor="invoicers">
                    {t('employee_managment_modal:text_add_employee_managment_select_manager')}
                    </FormLabel>
                    <Select value={managerId} onChange={handleChangeManager} placeholder={t('employee_managment_modal:text_add_employee_managment_select_manager')}>
                    {tableDataColumnsManager && tableDataColumnsManager.length && tableDataColumnsManager.map((data) => (
                        <option value={data.id}>
                            {data.employee.firstName}
                            {' '}
                            {data.employee.lastName}
                        </option>
                    ))}
                    </Select>
                <FormLabel htmlFor="invoicers" marginTop="20px">
                {t('employee_managment_modal:text_add_employee_managment_select_employee')}
                </FormLabel>
                <Select value={employeeId} onChange={handleChange} placeholder={t('employee_managment_modal:text_add_employee_managment_select_employee')}>
                    {tableDataColumns && tableDataColumns.length && tableDataColumns.map((data) => (
                        <option value={data.id}>
                            {data.firstName}
                            {' '}
                            {data.lastName}
                        </option>
                    ))}
                </Select>
                    </Flex>

                        </ModalBody>
                            </form>
                        <ModalFooter justifyContent="center">
                            <Button type="submit" onClick={onSubmit} background="teal" width="100%" borderRadius="9px" color="white">{t('employee_managment_modal:text_add_employee_managment_button_add')}</Button>
                        </ModalFooter>
                    </Card>

            </ModalContent>
            </Modal>
        </form>
    );
};
export default test;
