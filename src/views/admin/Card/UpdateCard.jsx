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
    Checkbox,
    Select,
    Textarea
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { getEmployee } from 'utils/api/employee';
import { ToastContainer, toast } from 'react-toastify';
import { updateCard } from 'utils/api/Card';
import { t } from 'i18next';

const UpdateCardModal = ({
    showModal,
    closeModal,
    selectedCard
}) => {
    const [tableDataColumns, setTableDataColumns] = useState([]);
    const [cardRefId, setCardRefId] = useState();
    const [employeeId, setEmployeeId] = useState();
    const [note, setNote] = useState();
    const [status, setStatus] = useState(true);
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

    // get Employee from database and set into select box

    const fetchEmployee = async () => {
        try {
            const res = await getEmployee();
            const result = res.data;
            setTableDataColumns(result);
        } catch (err) {
            t('toast_card_notification:text_error');
        }
    };
    useEffect(() => {
        fetchEmployee();
    }, []);

    // get data from table and set in state
    useEffect(() => {
        if (!selectedCard) return;
        setCardRefId(selectedCard.cardRefId);
        setEmployeeId(selectedCard.employeeId);
        setNote(selectedCard.reasonNote);
        setStatus(selectedCard.status);
    }, [selectedCard]);

    // update data in Card Table
    const onUpdateJobPosition = async () => {
        const payload = {
            cardRefId,
            employeeId,
            reasonNote: note,
            status
        };
        updateCard(selectedCard.id, payload)
            .then(() => showSuccess(t('toast_card_notification:text_updated_card_success')))
            .catch(() => {
                showError(t('toast_card_notification:text_updaated_card_error'));
            }).finally(() => closeModal());
    };
    return (
        <Modal isOpen={showModal} onClose={closeModal} colorScheme="brandScheme">
            <ToastContainer />
            <ModalOverlay />
            <ModalContent colorScheme="brandScheme">
                <form>
                    <Card>
                        <ModalHeader>
                            {t('card:txt_update_modal_title')}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box>
                                <Flex flexDirection="column" alignItems="center">
                                    <FormLabel htmlFor="invoicers">
                                        {t('card:txt_modal_add_number_card')}
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        value={cardRefId}
                                        disabled
                                        onChange={(e) => setCardRefId(e.target.value)}
                                    />
                                    <FormLabel marginTop="20px" htmlFor="invoicers">
                                        {t('card:txt_modal_add_employee_select')}
                                    </FormLabel>
                                    <Select value={employeeId} disabled onChange={(e) => setEmployeeId(e.target.value)}>
                                        {tableDataColumns && tableDataColumns.length && tableDataColumns.map((data) => (
                                            <option value={data.id}>
                                                {data.firstName}
                                                {' '}
                                                {data.lastName}
                                            </option>
                                        ))}
                                    </Select>
                                    <FormLabel marginTop="20px" htmlFor="invoicers">
                                        {t('card:txt_modal_add_reason')}
                                    </FormLabel>
                                    <Textarea
                                        type="text"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
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
                                width="100%"
                                mr={3}
                                onClick={onUpdateJobPosition}
                            >
                                {t('card:txt_update_modal_title')}
                            </Button>
                        </ModalFooter>
                    </Card>
                </form>
            </ModalContent>
        </Modal>
    );
};
export default UpdateCardModal;
