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
    Input,
    FormLabel
} from '@chakra-ui/react';
import Managers from 'components/managers/Managers';
import { updateManagerStatusToTrueIfEmployeeStatusIsTrue } from 'utils/api/employee';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';

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
const UpdateManagersModal = ({
    showModal,
    closeModal,
    selectedManagers
}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const { t } = useTranslation();
    // selcet employee

    useEffect(() => {
        if (!selectedManagers) return;
        setFirstName(selectedManagers.employee.firstName);
        setLastName(selectedManagers.employee.lastName);
    }, [selectedManagers]);

    const onUpdateJobPosition = async () => {
        updateManagerStatusToTrueIfEmployeeStatusIsTrue(selectedManagers.employee.id)
            .then(() => {
                showSuccess(t('toast_manager_notification:text_update_success'));
            })
            .catch(() => {
                showError(t('verification_modal:text_manager_error_verification'));
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
                    <Managers>
                        <ModalHeader>
                            {t('archive_manager:text_header_activate_manager')}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box>
                                <Flex flexDirection="column" alignItems="center">
                                <FormLabel htmlFor="invoicers">
                                {t('archive_manager:text_header_manager_firstname')}
                                </FormLabel>
                                    <Input
                                        type="text"
                                        disabled
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <FormLabel htmlFor="invoicers">
                                    {t('archive_manager:text_header_manager_lastname')}
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        disabled
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </Flex>

                            </Box>
                        </ModalBody>
                        <ModalFooter justifyContent="center">
                            <Button colorScheme="blue" mr={3} onClick={onUpdateJobPosition}>
                            {t('archive_manager_update_modal:text_manager_button_name')}
                            </Button>
                        </ModalFooter>
                    </Managers>
                </form>
            </ModalContent>
        </Modal>
    );
};
export default UpdateManagersModal;
