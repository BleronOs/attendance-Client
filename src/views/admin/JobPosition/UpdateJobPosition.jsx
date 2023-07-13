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
    Checkbox
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { toast, ToastContainer } from 'react-toastify';
import { updateJobPosition } from 'utils/api/JobPosition';

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
const UpdateJobPositionModal = ({
    showModal,
    closeModal,
    selectedJobPosition,
    t
}) => {
    const [jobPositionName, setJobPositionName] = useState(null);
    const [status, setStatus] = useState(false);

    useEffect(() => {
        if (!selectedJobPosition) return;
        setJobPositionName(selectedJobPosition.positionName);
    }, [selectedJobPosition]);

    const onUpdateJobPosition = async () => {
        const payload = {
            positionName: jobPositionName,
            status
        };
        updateJobPosition(selectedJobPosition.id, payload)
            .then(() => {
                showSuccess(t('job_position:txt_update_success'));
            })
            .catch(() => {
                showError(t('toast_card_notification:text_error'));
            }).finally(() => {
                closeModal();
            });
    };
    return (
        <Modal isOpen={showModal} onClose={closeModal} colorScheme="brandScheme">
            <ToastContainer />
            <ModalOverlay />
            <ModalContent colorScheme="brandScheme">
                <Card>
                    <ModalHeader>
                        {t('job_position:txt_update_modal_title')}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <Flex flexDirection="column" alignItems="center">
                                <FormLabel htmlFor="invoicers">
                                    {t('job_position:txt_update_modal_name_job_position')}
                                </FormLabel>
                                <Input
                                    type="text"
                                    value={jobPositionName}
                                    onChange={(e) => setJobPositionName(e.target.value)}
                                />
                                <Checkbox
                                    marginTop="20px"
                                    defaultChecked={status}
                                    value={status}
                                    onChange={(e) => setStatus(e.target.checked)}
                                >
                                    {t('card:txt_modal_is_active')}
                                </Checkbox>
                            </Flex>
                        </Box>
                    </ModalBody>
                    <ModalFooter justifyContent="center">
                        <Button
                            background="teal"
                            color="white"
                            mr={3}
                            width="100%"
                            onClick={onUpdateJobPosition}
                        >
                            {t('job_position:txt_update_modal_title')}
                        </Button>
                    </ModalFooter>
                </Card>
            </ModalContent>
        </Modal>
    );
};
export default UpdateJobPositionModal;
