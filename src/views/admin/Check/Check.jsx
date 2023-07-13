import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    Input,
    Select,
    Flex,
    Box,
    Textarea,
    FormLabel
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import {
    getChecks, addCheck, getChecksByEmployeeId, getEmployeeChecksByEmployeeId
} from 'utils/api/Check';
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment/moment';
import { useTranslation } from 'react-i18next';
import { AddIcon } from '@chakra-ui/icons';
import { CSVLink } from 'react-csv';
import { FaFileExcel } from 'react-icons/fa';
import { getCard } from 'utils/api/Card';

export default function check() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [checkDateTime, setCheckDateTime] = useState();
    const [adminId, setAdminId] = useState();
    const [notes, setNotes] = useState();
    const [loading, setLoading] = useState(true);
    const [employeeId, setEmployeeId] = useState();

    const [tableDataColumns, setTableDataColumns] = useState([]);
    const [tableEmployee, setTableEmployee] = useState([]);

    const role = JSON.parse(localStorage.getItem('access_role'))[0].roleId;
    const cardsByEmployeeId = JSON.parse(localStorage.getItem('access_employee'));

    // translation

    const { t } = useTranslation();

    const columnsDataColumns = [
        {
            Header: t('checks:txt_tbl_firstname'),
            accessor: 'card.employee.firstName'
        },
        {
            Header: t('checks:txt_tbl_lastname'),
            accessor: 'card.employee.lastName'
        },
        {
            Header: t('checks:txt_tbl_card'),
            accessor: 'card.cardRefId'
        },
        {
            Header: t('checks:txt_tbl_checkDateTime'),
            accessor: 'checkDateTime'
        },
        {
            Header: t('checks:txt_tbl_serverDateTime'),
            accessor: 'serverDateTime'
        },
        {
            Header: t('checks:txt_tbl_admin_firstname'),
            accessor: 'user.firstName'
        },
        {
            Header: t('checks:txt_tbl_admin_lastname'),
            accessor: 'user.lastName'
        },
        {
            Header: t('checks:txt_tbl_reason'),
            accessor: 'note'
        }
    ];
    const headers = [
        { label: t('checks:txt_tbl_firstname'), key: 'card.employee.firstName' },
        { label: t('checks:txt_tbl_lastname'), key: 'card.employee.lastName' },
        { label: t('checks:txt_tbl_card'), key: 'card.cardRefId' },
        { label: t('checks:txt_tbl_checkDateTime'), key: 'checkDateTime' },
        { label: t('checks:txt_tbl_serverDateTime'), key: 'serverDateTime' },
        { label: t('checks:txt_tbl_admin_firstname'), key: 'user.firstName' },
        { label: t('checks:txt_tbl_admin_lastname'), key: 'user.lastName' },
        { label: t('checks:txt_tbl_reason'), key: 'note' },
    ];
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
    // validate
    const validation = () => {
        if (!checkDateTime) {
            showError(t('checks:text_field_select_date_when_employee_started_work'));
            return false;
        }
        if (!employeeId) {
            showError(t('checks:text_field_select_employee'));
            return false;
        }
        if (!adminId) {
            showError(t('checks:text_field_write_admins_name_who_inserted_the_check'));
            return false;
        }
        if (!notes) {
            showError(t('checks:text_field_reason_of_check_in_manually'));
            return false;
        }
        if (notes.length <= 12) {
            showError(t('checks:text_field_minimum_character'));
            return false;
        }
        return true;
    };
    // get DateTime Now
    const getCurrentDateTime = () => {
        const tempDate = new Date();
        setCheckDateTime(moment(tempDate).format('YYYY-MM-DDThh:mm'));
    };
    // get Admin Id from local Storage

    const getUserFromLocalStorage = () => {
        const item = JSON.parse(localStorage.getItem('access_data'));
        if (item) {
            setAdminId(item.id);
        }
    };
    // Search Checks
    const [checks, setChecks] = useState([]);
    useEffect(() => {
        if (!checks) setTableDataColumns([]);
        setTableDataColumns(checks);
    }, [checks]);

    const filterCheck = (searchValue) => {
        if (!searchValue) setTableDataColumns();
        const filteredChecks = checks.filter((check) => {
            const {
                checkDateTime, serverDateTime, card, note, user
            } = check;
            return (
                card.employee.firstName.toLowerCase().includes(searchValue.toLowerCase())
                || card.employee.lastName.toLowerCase().includes(searchValue.toLowerCase())
                || card.cardRefId.toString().includes(searchValue)
                || checkDateTime.toString().includes(searchValue)
                || serverDateTime.toString().includes(searchValue)
                || note.toLowerCase().includes(searchValue.toLowerCase())
                || user.firstName.toLowerCase().includes(searchValue.toLowerCase())
                || user.lastName.toLowerCase().includes(searchValue.toLowerCase())
            );
        });
        setTableDataColumns(filteredChecks);
    };

    const [emptyLoading, setEmptyLoading] = useState('');
    const fetchChecks = async () => {
        try {
            const res = role == 1 ? await getChecks() : role == 2 ? await getChecksByEmployeeId(cardsByEmployeeId) : await getEmployeeChecksByEmployeeId(cardsByEmployeeId);
            const data = res.data || [];
            if (data.length) {
                setEmptyLoading('');
                setChecks(data);
            } else {
                setEmptyLoading('Nuk Egziston asnje Evidentim!');
            }
        } catch (err) {
            t('toast_card_notification:text_error');
        }
    };

    const fetchEmployee = async () => {
        try {
            const res = await getCard();
            const result = res.data;
            console.log(res.data, 'sssss');
            setTableEmployee(result);
        } catch (err) {
            showError(t('toast_card_notification:text_error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChecks();
        fetchEmployee();
    }, []);

    // Add Checks

    const onSubmit = (e) => {
        e.preventDefault();
        const payload = {
            CheckDateTime: checkDateTime,
            employeeId,
            AdminId: adminId,
            Note: notes
        };
        if (!validation()) return;
        addCheck(payload)
            .then(() => {
                showSuccess(t('checks:text_add_check_successfuly'));
            })
            .catch(() => {
                showError(t('checks:text_add_check_error'));
            })
            .finally(() => {
                onClose();
                setCheckDateTime(null);
                setAdminId('');
                setNotes('');
                setEmployeeId('');
                fetchChecks();
            });
    };
    return (
        <Box marginTop="80px">
            {role == 1 && (
                <Button
                    leftIcon={<AddIcon />}
                    variant="brand"
                    marginBottom="20px"
                    background="teal"
                    color="white"
                    onClick={() => {
                        onOpen();
                        getCurrentDateTime();
                        getUserFromLocalStorage();
                    }}
                    t={t}
                >
                    {t('checks:txt_btn_add')}
                </Button>
            )}
            <Button
                leftIcon={<FaFileExcel />}
                variant="brand"
                marginBottom="20px"
                background="teal"
                color="white"
                float="right"
                marginRight="2%"
            >
                <CSVLink data={tableDataColumns} headers={headers}>
                    {t('excel:button_export_data')}
                </CSVLink>
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ToastContainer />
                <ModalContent>
                    <form>
                        <ModalHeader>{t('checks:txt_modal_header')}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box>
                                <Flex flexDirection="column" alignItems="center">
                                    <FormLabel marginTop="20px" htmlFor="invoicers">
                                        {t('checks:txt_modal_date')}
                                    </FormLabel>
                                    <Input
                                        type="datetime-local"
                                        value={checkDateTime}
                                        defaultValue={checkDateTime}
                                        onChange={(e) => {
                                            setCheckDateTime(e.target.value);
                                        }}
                                    />
                                    <FormLabel marginTop="20px" htmlFor="invoicers">
                                        {t('checks:txt_modal_employee')}
                                    </FormLabel>
                                    <Select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder={t('checks:txt_modal_employee')}>
                                        {tableEmployee && tableEmployee.length && tableEmployee.map((data) => (
                                            <option value={data.employeeId}>
                                                {data.employee.firstName}
                                                {' '}
                                                {data.employee.lastName}
                                            </option>
                                        ))}
                                    </Select>
                                    <FormLabel marginTop="20px" htmlFor="invoicers">
                                        {t('checks:txt_modal_reason')}
                                    </FormLabel>
                                    <Textarea
                                        type="text"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </Flex>
                            </Box>
                        </ModalBody>

                        <ModalFooter>
                            <Button type="submit" onClick={onSubmit} background="teal" color="white" borderRadius="9px">{t('checks:txt_btn_add')}</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>

            <ColumnsTable
                columnsData={columnsDataColumns}
                loading={loading}
                tableData={tableDataColumns}
                onSearch={(searchValue) => {
                    filterCheck(searchValue);
                }}
                nullTable={emptyLoading}
            />
        </Box>
    );
}
