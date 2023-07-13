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
    Textarea,
} from '@chakra-ui/react';
import { updateEmployeeToSendToArchive } from 'utils/api/employee';
import { toast, ToastContainer } from 'react-toastify';
import Card from 'components/card/Card';
import { useTranslation } from 'react-i18next';

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
// error Notification
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
const DeleteEmployeeModal = ({
    showModal,
    closeModal,
    selectedEmployee,
}) => {
    const [employeeId, setEmployeeId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [positionId, setPositionId] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [personalNumber, setPersonalNumber] = useState('');
    const [, setStatus] = useState(true);
    const [notes, setNotes] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        if (!selectedEmployee) return;
        console.log('here', selectedEmployee);
        setEmployeeId(selectedEmployee.employeeId);
        setFirstName(selectedEmployee.firstName);
        setLastName(selectedEmployee.lastName);
        setBirthDate(selectedEmployee.birthDate);
        setEmail(selectedEmployee.email);
        setAddress(selectedEmployee.address);
        setPersonalNumber(selectedEmployee.personalNumber);
        setPhoneNumber(selectedEmployee.phoneNumber);
        setPositionId(selectedEmployee.positionId);
        setStatus(selectedEmployee.status);
        setNotes(selectedEmployee.notes);
    }, [selectedEmployee]);

    const onUpdateJobPosition = async () => {
        const payload = {
            employeeId,
            firstName,
            lastName,
            email,
            birthDate,
            address,
            personalNumber,
            phoneNumber,
            positionId,
            notes
        };
        updateEmployeeToSendToArchive(selectedEmployee.id, selectedEmployee.notes, selectedEmployee.email, payload)
            .then(() => {
                showSuccess(t('delete_emplyee_with_user:text_success_delete'));
            })
            .catch(() => {
                showError(t('delete_emplyee_with_user:text_error_delete'));
            })
            .finally(() => closeModal());
    };

    return (
        <Modal isOpen={showModal} onClose={closeModal} size="2xl" colorScheme="brandScheme">
            <ToastContainer />
            <ModalOverlay />
            <ModalContent colorScheme="brandScheme">
                <form>
                    <Card>
                        <ModalHeader>
                            {t('update_delete_employee_modal:text_header_delete')}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box>
                                <Flex flexDirection="column" alignItems="center">
                                    <FormLabel htmlFor="invoicers">
                                        {t('update_delete_employee_modal:text_delete_update_firstname')}
                                    </FormLabel>
                                    <Input
                                        disabled
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <FormLabel htmlFor="invoicers" marginTop="20px">
                                        {t('update_delete_employee_modal:text_delete_update_lastname')}
                                    </FormLabel>
                                    <Input
                                        disabled
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                    <FormLabel htmlFor="invoicers" marginTop="20px">
                                        {t('update_delete_employee_modal:text_delete_update_notes')}
                                    </FormLabel>
                                    <Textarea
                                        type="text"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </Flex>

                            </Box>
                        </ModalBody>
                        <ModalFooter justifyContent="center">
                            <Button colorScheme="teal" mr={3} width="100%" borderRadius="9px" onClick={onUpdateJobPosition}>
                                {t('update_delete_employee_modal:text_save_button')}
                            </Button>
                        </ModalFooter>
                    </Card>
                </form>
            </ModalContent>
        </Modal>
    );
};
export default DeleteEmployeeModal;
