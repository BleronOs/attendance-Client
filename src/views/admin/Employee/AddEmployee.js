import React, { useEffect, useState } from 'react';
import {
    Button, Flex, Input, Select,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormLabel,
    Checkbox
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { addEmployee } from 'utils/api/employee';
import { getJobPositionWithStatusTrue } from 'utils/api/JobPosition';
import { getRole } from 'utils/api/Account';
import { toast } from 'react-toastify';
import validator from 'validator';

const test = ({
    reloadWorkPositions, isOpenModal, onCloseModal, t
}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [personalNumber, setPersonalNumber] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [positionId, setPositionId] = useState('');
    const [status, setStatus] = useState(true);
    const [role, setRole] = useState('');

    const [tableDataColumns, setTableDataColumns] = useState([]);
    const [tableRole, setTableRole] = useState([]);
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
        if (!firstName || !lastName || !birthDate || !personalNumber || !address || !email || !phoneNumber || !positionId || !status || !role) {
            showError(t('add_employee_modal:text_add_field'));
            return false;
        }
        if (!validator.isEmail(email)) {
            showError(t('employee:text_email_is_not_valid'));
            return false;
        }

        return true;
    };
    const onSubmit = (e) => {
        e.preventDefault();
        const payload = {
            firstName,
            lastName,
            birthDate,
            personalNumber,
            address,
            email,
            phoneNumber,
            positionId,
            status,
            role
        };
        if (!validation()) return;
        addEmployee(payload)
            .then()
            .catch(() => {
                showError(t('add_employee_modal:text_employee_not_added'));
            })
            .finally(() => {
                setRole(null);
                reloadWorkPositions('');
                setFirstName('');
                setLastName('');
                setBirthDate('');
                setPersonalNumber('');
                setAddress('');
                setEmail('');
                setPhoneNumber('');
                setPositionId('');
                showSuccess(t('toast_employee_notification:text_add_success'));
            });
        onCloseModal(true);
    };

    // get job position with status Active
    const fetchJobPositions = async () => {
        try {
            const res = await getJobPositionWithStatusTrue();
            const result = res.data;
            setTableDataColumns(result);
        } catch (err) {
            showError(t('toast_card_notification:text_error'));
        }
    };
    useEffect(() => {
        fetchJobPositions();
    }, []);

    const fetchRoles = async () => {
        try {
            const res = await getRole();
            const result = res.data;
            setTableRole(result);
        } catch (err) {
            showError(t('toast_card_notification:text_error'));
        }
    };
    useEffect(() => {
        fetchRoles();
    }, []);

    const onCheckboxChange = (event) => {
        setStatus(event.target.checked);
    };
    return (
        <form>
            <Modal isOpen={isOpenModal} onClose={onCloseModal} size="6xl" colorScheme="brandScheme">
                <ModalOverlay />
                <ModalContent colorScheme="brandScheme">
                    <Card>
                        <ModalHeader>
                            {t('add_employee_modal:text_add_employee')}
                        </ModalHeader>
                        <ModalCloseButton />
                        <form>
                            <ModalBody width="100%">
                                <Flex>
                                    <Flex flexDirection="column" alignItems="center" width="48%" marginRight="2%">
                                        <FormLabel htmlFor="invoicers" marginTop="10px">
                                            {t('add_employee_modal:text_add_employee_firstname')}
                                        </FormLabel>
                                        <Input
                                            type="text"
                                            placeholder={t('add_employee_modal:text_add_employee_firstname')}
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                        <FormLabel htmlFor="invoicers" marginTop="20px">
                                            {t('add_employee_modal:text_add_employee_email')}
                                        </FormLabel>
                                        <Input
                                            type="text"
                                            placeholder={t('add_employee_modal:text_add_employee_email')}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <FormLabel htmlFor="invoicers" marginTop="20px">
                                            {t('add_employee_modal:text_add_employee_birthdate')}
                                        </FormLabel>
                                        <Input
                                            type="date"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                        />
                                        <FormLabel htmlFor="invoicers" marginTop="20px">
                                            {t('add_employee_modal:text_add_employee_personalnumber')}
                                        </FormLabel>
                                        <Input
                                            type="text"
                                            placeholder={t('add_employee_modal:text_add_employee_personalnumber')}
                                            value={personalNumber}
                                            onKeyPress={(event) => {
                                                if (!/[0-9]/.test(event.key)) {
                                                    event.preventDefault();
                                                    // sleep(5000);
                                                    showError(t('employee:text_personal_number'));
                                                }
                                            }}
                                            onChange={(e) => setPersonalNumber(e.target.value)}
                                        />
                                        <FormLabel htmlFor="invoicers" marginTop="20px">
                                            {t('add_employee_modal:text_add_employee_address')}
                                        </FormLabel>
                                        <Input
                                            type="text"
                                            placeholder={t('add_employee_modal:text_add_employee_address')}
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </Flex>
                                    <Flex flexDirection="column" alignItems="center" width="48%" marginLeft="2%">
                                        <FormLabel
                                            htmlFor="invoicers"
                                            marginTop="10px"
                                        >
                                            {t('add_employee_modal:text_add_employee_lastname')}
                                        </FormLabel>

                                        <Input
                                            type="text"
                                            placeholder={t('add_employee_modal:text_add_employee_lastname')}
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                        <FormLabel htmlFor="invoicers" marginTop="20px">
                                            {t('add_employee_modal:text_add_employee_phonenumber')}
                                        </FormLabel>
                                        <Input
                                            type="text"
                                            placeholder={t('add_employee_modal:text_add_employee_phonenumber')}
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                        <FormLabel htmlFor="invoicers" marginTop="20px">
                                            {t('add_employee_modal:text_add_employee_jobposition')}
                                        </FormLabel>
                                        <Select value={positionId} onChange={(e) => setPositionId(e.target.value)} placeholder="Select">
                                            {tableDataColumns && tableDataColumns.length && tableDataColumns.map((data) => (
                                                <option value={data.id}>
                                                    {data.positionName}
                                                </option>
                                            ))}
                                        </Select>
                                        <FormLabel htmlFor="invoicers" marginTop="20px">
                                            {t('add_employee_modal:text_employee_select_role')}
                                        </FormLabel>
                                        <Select value={role} onChange={(e) => setRole(e.target.value)} placeholder="Select">
                                            {tableRole && tableRole.length && tableRole.map((data) => (
                                                <option value={data.name}>
                                                    {data.name}
                                                </option>
                                            ))}
                                        </Select>
                                        <Checkbox
                                            mt={3}
                                            marginTop="40px"
                                            defaultChecked={status}
                                            value={status}
                                            onChange={onCheckboxChange}
                                        >
                                            {t('add_employee_modal:text_add_employee_status')}
                                        </Checkbox>
                                    </Flex>
                                </Flex>
                            </ModalBody>
                        </form>
                        <ModalFooter justifyContent="center">
                            <Button type="submit" onClick={onSubmit} background="teal" width="100%" borderRadius="9px" color="white">
                                {t('add_employee_modal:text_add_employee_add_button')}
                            </Button>
                        </ModalFooter>
                    </Card>

                </ModalContent>
            </Modal>
        </form>
    );
};
export default test;
