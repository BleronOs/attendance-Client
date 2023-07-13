import React, { useEffect, useState } from 'react';
import { addCard } from 'utils/api/Card';
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
    Checkbox,
    Select,
    FormLabel,
    Textarea
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { getEmployeeWithStatusActive } from 'utils/api/employee';
import { toast, ToastContainer } from 'react-toastify';

const test = ({
    reloadWorkPositions, isOpenModal, onCloseModal, t
}) => {
    const [employeeId, setEmployeId] = useState('');
    const [status, setStatus] = useState(true);
    const [cardId, setCardId] = useState('');
    const [notes, setNotes] = useState('');

    const [tableDataColumns, setTableDataColumns] = useState([]);
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
        if (!cardId) {
            showError(t('toast_card_notification:text_error_field_add_card'));
            return false;
        }
        if (!employeeId) {
            showError(t('toast_card_notification:text_error_field_add_employee'));
            return false;
        }
        return true;
    };
    // get data from employee
    const fetchEmployeeCards = async () => {
        try {
            const res = await getEmployeeWithStatusActive();
            const result = res.data;
            setTableDataColumns(result);
        } catch (err) {
            showError(t('toast_card_notification:text_error'));
        }
    };
    useEffect(() => {
        fetchEmployeeCards();
    }, []);
    const onSubmit = (e) => {
        e.preventDefault();
        const payload = {
            status,
            cardRefId: cardId,
            employeeId,
            reasonNote: notes
        };
        if (!validation()) return;
        addCard(payload)
            .then()
            .catch((showError) => {
                showError(t('toast_card_notification:text_error_card_not_inserted'));
            }).finally(() => {
                reloadWorkPositions();
                fetchEmployeeCards();
                setCardId('');
                setEmployeId('');
                setNotes('');
                showSuccess(t('toast_card_notification:text_add_success'));
            });
        onCloseModal(true);
    };
    const handleChange = (event) => {
        setEmployeId(event.target.value);
    };
    const onCheckboxChange = (event) => {
        setStatus(event.target.checked);
    };
    return (
        <Modal isOpen={isOpenModal} onClose={onCloseModal} size="xl" colorScheme="brandScheme">
            <ModalOverlay />
            <ToastContainer />
            <ModalContent colorScheme="brandScheme">
                <form>
                    <Card>
                        <ModalHeader>
                            {t('card:txt_btn_add_card_header')}
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
                                        placeholder={t('card:txt_modal_add_number_card')}
                                        value={cardId}
                                        onChange={(e) => setCardId(e.target.value)}
                                    />
                                    <FormLabel marginTop="20px" htmlFor="invoicers">
                                        {t('card:txt_modal_add_employee_select')}
                                    </FormLabel>
                                    <Select value={employeeId} onChange={handleChange} placeholder={t('card:txt_modal_add_employee_select')}>
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
                                        placeholder={t('card:txt_modal_add_reason')}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                    <Checkbox
                                        marginTop="20px"
                                        mt={3}
                                        defaultChecked={status}
                                        value={status}
                                        onChange={onCheckboxChange}
                                    >
                                        {t('card:txt_modal_is_active')}
                                    </Checkbox>
                                </Flex>

                            </Box>
                        </ModalBody>
                        <ModalFooter justifyContent="center">
                            <Button type="submit" onClick={onSubmit} background="teal" color="white" width="100%" borderRadius="9px">{t('card:txt_btn_add_card_header')}</Button>
                        </ModalFooter>
                    </Card>
                </form>
            </ModalContent>
        </Modal>
    );
};
export default test;
