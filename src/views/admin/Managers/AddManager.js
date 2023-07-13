import React, { useEffect, useState } from 'react';
import {
    Button,
    Flex,
    Select,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormLabel,
    Checkbox,
} from '@chakra-ui/react';
import { addManagers } from 'utils/api/Manager';
import Card from 'components/card/Card';
import { getEmployeeNotLinkedIntoEmployeeManagment } from 'utils/api/employee';
import { toast } from 'react-toastify';

const AddManagerModal = ({
 reloadWorkPositions, isOpenModal, onCloseModal, activeManagers, t
}) => {
    const [employeeId, setEmployeId] = useState('');
    const [status, setStatus] = useState(true);

    const [tableDataColumns, setTableDataColumns] = useState([]);

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
        if (!employeeId || !status) {
            showError(t('add_manager_modal:text_add_manager_field_errorr'));
            return false;
        }
        return true;
    };
    const fetchEmployeeNotLinkedIntoEmployeeManagment = async () => {
        try {
            const res = await getEmployeeNotLinkedIntoEmployeeManagment();
            const employeesEligibleToBecomeManagers = [];
            res.data.forEach((employee) => {
                if (!activeManagers.find((m) => m.employeeId == employee.id)) {
                    employeesEligibleToBecomeManagers.push(employee);
                }
            });

            setTableDataColumns(employeesEligibleToBecomeManagers);
        } catch (err) {
            showError(t('toast_card_notification:text_error'));
        }
    };
    useEffect(() => {
        fetchEmployeeNotLinkedIntoEmployeeManagment();
    }, [activeManagers]);
    const onSubmit = (e) => {
        e.preventDefault();
        const payload = {
            employeeId,
            status,
        };
        if (!validation()) return;
        addManagers(payload)
            .then(() => {
                reloadWorkPositions();
                setEmployeId('');
                showSuccess(t('toast_manager_notification:text_add_success'));
                fetchEmployeeNotLinkedIntoEmployeeManagment();
            })
            .catch(() => {
                showError(t('job_position:txt_modal_error'));
            });
            // .finally(() => {
            //     reloadWorkPositions();
            //     setEmployeId('');
            //     showSuccess(t('toast_manager_notification:text_add_success'));
            // });
        onCloseModal(true);
    };

    const onCheckboxChange = (event) => {
        setStatus(event.target.checked);
    };
    return (
        <Modal
            isOpen={isOpenModal}
            onClose={onCloseModal}
            colorScheme="brandScheme"
        >
            <ModalOverlay />
            <ModalContent colorScheme="brandScheme">
                <Card>
                    <ModalHeader>
                        {t('add_manager_modal:text_add_manager_header')}
                    </ModalHeader>
                    <ModalCloseButton />
                    <form>
                        <ModalBody>
                            <Flex flexDirection="column" alignItems="center">
                                <FormLabel htmlFor="invoicers">
                                {t('add_manager_modal:text_add_manager_select_employee')}
                                </FormLabel>
                                <Select
                                    value={employeeId}
                                    onChange={(e) => setEmployeId(e.target.value)}
                                    placeholder={t('add_manager_modal:text_add_manager_select_employee')}
                                >
                                    {tableDataColumns
                                        && tableDataColumns.length
                                        && tableDataColumns.map((data) => (
                                            <option value={data.id}>
                                                {data.firstName}
                                                {' '}
                                                {data.lastName}
                                            </option>
                                        ))}
                                </Select>
                                <Checkbox
                                    mt={3}
                                    defaultChecked={status}
                                    value={status}
                                    onChange={onCheckboxChange}
                                >
                                    {t('add_manager_modal:text_add_manager_status')}
                                </Checkbox>
                            </Flex>
                        </ModalBody>
                    </form>
                    <ModalFooter justifyContent="center">
                        <Button
                            type="submit"
                            onClick={onSubmit}
                            background="teal"
                            width="100%"
                            borderRadius="9px"
                            color="white"
                        >
                            {t('add_manager_modal:text_add_manager_add_button')}
                        </Button>
                    </ModalFooter>
                </Card>
            </ModalContent>
        </Modal>
    );
};
export default AddManagerModal;
