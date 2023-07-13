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
    FormLabel,
    Input,
    Select,
} from '@chakra-ui/react';
import { updateEmployee } from 'utils/api/employee';
import { toast, ToastContainer } from 'react-toastify';
import Card from 'components/card/Card';
import { getJobPositionWithStatusTrue } from 'utils/api/JobPosition';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const UpdateEmployeeModal = ({
    showModal,
    closeModal,
    selectedEmployee,
}) => {
    const [tableDataColumns, setTableDataColumns] = useState([]);
    const [employeeId, setEmployeeId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState(null);
    const [personalNumber, setPersonalNumber] = useState('');
    const [address, setAddress] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [positionId, setPositionId] = useState('');
    const [status, setStatus] = useState(true);
    const { t } = useTranslation();

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
    const fetchEmployeeJobPosition = async () => {
        try {
            const res = await getJobPositionWithStatusTrue();
            const result = res.data;
            setTableDataColumns(result);
        } catch (err) {
            console.error(err, 'error from backend');
        }
    };
    useEffect(() => {
        fetchEmployeeJobPosition();
    }, []);

    useEffect(() => {
        if (!selectedEmployee) return;
        setEmployeeId(selectedEmployee.employeeId);
        setFirstName(selectedEmployee.firstName);
        setLastName(selectedEmployee.lastName);
        setBirthDate(moment(selectedEmployee.birthDate).format('YYYY-MM-DD'));
        setPersonalNumber(selectedEmployee.personalNumber);
        setAddress(selectedEmployee.address);
        setEmail(selectedEmployee.email);
        setNewEmail(selectedEmployee.email);
        setPhoneNumber(selectedEmployee.phoneNumber);
        setPositionId(selectedEmployee.positionId);
        setStatus(selectedEmployee.status);
    }, [selectedEmployee]);
    const onUpdateJobPosition = async () => {
        const payload = {
            employeeId,
            firstName,
            lastName,
            birthDate,
            personalNumber,
            address,
            email,
            newEmail,
            phoneNumber,
            positionId,
            status,
        };
        updateEmployee(selectedEmployee.id, payload)
            .then(() => {
                showSuccess(t('update_delete_employee_modal:text_update_employee_success'));
            })
            .catch(() => {
                showError(t('update_delete_employee_modal:text_update_employee_error'));
            })
            .finally(() => {
                closeModal();
            });
    };

    return (
        <Modal isOpen={showModal} onClose={closeModal} size="6xl" colorScheme="brandScheme">
            <ToastContainer />
            <ModalOverlay />
            <ModalContent colorScheme="brandScheme">
                <form>
                    <Card>
                        <ModalHeader>
                            {t('update_employee_modal:text_header')}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody width="100%">
                            <Box>
                                <Flex>
                                    <Flex flexDirection="column" alignItems="center" width="48%" mr="2%">
                                        <FormLabel htmlFor="invoicers" marginTop="10px">
                                            {t('update_employee_modal:text_update_firstname')}
                                        </FormLabel>
                                        <Input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                        <FormLabel htmlFor="invoicers" marginTop="10px">
                                            {t('update_employee_modal:text_update_lastname')}
                                        </FormLabel>
                                        <Input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                        <FormLabel htmlFor="invoicers" marginTop="10px">
                                            {t('update_employee_modal:text_update_birthdate')}
                                        </FormLabel>
                                        <Input
                                            type="date"
                                            value={birthDate}
                                            onChange={(e) => {
                                                setBirthDate(e.target.value);
                                            }}
                                        />
                                        <FormLabel htmlFor="invoicers" marginTop="10px">
                                            {t('update_employee_modal:text_update_personalnumber')}
                                        </FormLabel>
                                        <Input
                                            type="text"
                                            value={personalNumber}
                                            onChange={(e) => setPersonalNumber(e.target.value)}
                                        />
                                    </Flex>
                                    <Flex flexDirection="column" alignItems="center" width="48%" mr="2%">
                                        <FormLabel htmlFor="invoicers" marginTop="10px">
                                            {t('update_employee_modal:text_update_address')}
                                        </FormLabel>
                                        <Input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                        <FormLabel htmlFor="invoicers" marginTop="10px">
                                            {t('update_employee_modal:text_update_email')}
                                        </FormLabel>
                                        <Input
                                            type="text"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                        />
                                        <FormLabel htmlFor="invoicers" marginTop="10px">
                                            {t('update_employee_modal:text_update_phonenumber')}
                                        </FormLabel>
                                        <Input
                                            type="text"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                        <FormLabel htmlFor="invoicers" marginTop="10px">
                                            {t('update_employee_modal:text_update_jobposition')}
                                        </FormLabel>
                                        <Select value={positionId} onChange={(e) => setPositionId(e.target.value)} placeholder="Select">
                                            {tableDataColumns && tableDataColumns.length && tableDataColumns.map((data) => (
                                                <option value={data.id}>
                                                    {data.positionName}
                                                </option>
                                            ))}
                                        </Select>
                                    </Flex>
                                </Flex>

                            </Box>
                        </ModalBody>
                        <ModalFooter justifyContent="center" width="100%">
                            <Button background="teal" width="100%" mt="10px" color="white" borderRadius="9px" mr={3} onClick={onUpdateJobPosition}>
                                {t('update_employee_modal:text_save_button')}
                            </Button>
                        </ModalFooter>
                    </Card>
                </form>
            </ModalContent>
        </Modal>
    );
};
export default UpdateEmployeeModal;
