import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalCloseButton,
    Button,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const VerificationModal = ({
    showModal,
    closeModal,
    onCancel,
    onVerify,
}) => {
    const { t } = useTranslation();
    return (
    <Modal isOpen={showModal} onClose={closeModal} colorScheme="brandScheme">
        <ToastContainer />
        <ModalOverlay />
        <ModalContent colorScheme="brandScheme">
            <Card>
                <ModalHeader>
                   {t('verification_modal:text_header_verification')}
                </ModalHeader>
                <ModalCloseButton />
                <ModalFooter justifyContent="center">
                    <Button colorScheme="blue" width="40%" mr={5} onClick={onVerify}>
                    {t('verification_modal:text_verification_yes_option')}
                    </Button>

                    <Button colorScheme="blue" width="40%" onClick={onCancel}>
                    {t('verification_modal:text_verification_no_option')}
                    </Button>
                </ModalFooter>
            </Card>
        </ModalContent>
    </Modal>
);
};
export default VerificationModal;
