import React, { useState } from 'react';
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
    FormLabel,
    Textarea
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { toast, ToastContainer } from 'react-toastify';
import { AddRemarks } from 'utils/api/Remarks';

const AddRemark = ({
    reloadRemarks, isOpenModal, onCloseModal, t, id, employeelastName, employeefirstName
}) => {
    const [notes, setNotes] = useState('');

    // error notification
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
    // Validation
    const validation = () => {
        if (!notes) {
            showError(t('remarks:error_empty_reasons'));
            return false;
        }
        return true;
    };
    const onSubmit = (e) => {
        e.preventDefault();
        const payload = {
            employeeId: id,
            notes
        };
        if (!validation()) return;
        AddRemarks(payload)
            .then(() => {
                setNotes('');
                showSuccess(t('remarks:success_inserted_remarks'));
            })
            .catch((showError) => {
                showError(t('remarks:failed_inserted_remarks'));
            }).finally(() => {
                reloadRemarks(id);
            });
        onCloseModal();
    };
    return (
        <Modal isCentered isOpen={isOpenModal} onClose={onCloseModal} size="xl" colorScheme="brandScheme">
            <ModalOverlay />
            <ToastContainer />
            <ModalContent colorScheme="brandScheme">
                <form>
                    <Card>
                        <ModalHeader>
                            {t('remarks:text_add_remarks_header')}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box>
                                <Flex flexDirection="column" alignItems="center">
                                    <FormLabel htmlFor="invoicers">
                                        {t('remarks:text_full_name_employee')}
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        value={`${employeefirstName} ${employeelastName}`}
                                        disabled
                                    />
                                    <FormLabel marginTop="20px" htmlFor="invoicers">
                                        {t('remarks:text_remarks')}
                                    </FormLabel>
                                    <Textarea
                                        type="text"
                                        placeholder={t('remarks:text_remarks_placeholder')}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </Flex>
                            </Box>
                        </ModalBody>
                        <ModalFooter justifyContent="center">
                            <Button type="submit" onClick={onSubmit} background="teal" color="white" width="100%" borderRadius="9px">{t('remarks:text_add_remarks_header')}</Button>
                        </ModalFooter>
                    </Card>
                </form>
            </ModalContent>
        </Modal>
    );
};
export default AddRemark;
