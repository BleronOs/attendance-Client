import React, { useState } from 'react';
import {
    Button,
    Flex,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Box,
    ModalFooter,
    FormLabel
} from '@chakra-ui/react';
import { addJobPosition } from 'utils/api/JobPosition';
import Card from 'components/card/Card';
import { toast, ToastContainer } from 'react-toastify';

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

const test = ({
    reloadWorkPositions, isOpenModal, onCloseModal, t
}) => {
    const [positionName, setPositionName] = useState('');

    const validation = () => {
        if (!positionName) {
            showError(t('job_position:txt_modal_error'));
            return false;
        }
        return true;
    };
    const onSubmit = (e) => {
        e.preventDefault();
        if (!validation()) return;
        addJobPosition({ positionName })
            .then(() => {
                showSuccess(t('job_position:txt_add_success'));
            })
            .catch(() => {
                showError(t('toast_card_notification:text_error'));
            }).finally(() => {
                setPositionName('');
                reloadWorkPositions();
            });
            onCloseModal(true);
    };

    return (

        <Modal isOpen={isOpenModal} onClose={onCloseModal} colorScheme="brandScheme">
            <ModalOverlay />
            <ToastContainer />
            <ModalContent colorScheme="brandScheme">
                <form>
                    <Card>
                        <ModalHeader>
                            {t('job_position:txt_button_add_header')}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box>
                                <Flex flexDirection="column" alignItems="center">
                                    <FormLabel htmlFor="invoicers">
                                        {t('job_position:txt_modal_add_text')}
                                    </FormLabel>
                                    <Input
                                        id="jobPositionTextField"
                                        type="text"
                                        placeholder={t('job_position:txt_modal_add_text_placeholder')}
                                        name="jobPositionTextField"
                                        value={positionName}
                                        onChange={(e) => setPositionName(e.target.value)}
                                    />
                                </Flex>
                            </Box>
                        </ModalBody>
                        <ModalFooter justifyContent="center">
                            <Button type="submit" onClick={onSubmit} background="teal" color="white" width="100%" borderRadius="9px">{t('job_position:txt_button_add_header')}</Button>
                        </ModalFooter>
                    </Card>
                </form>
            </ModalContent>
        </Modal>
    );
};
export default test;
