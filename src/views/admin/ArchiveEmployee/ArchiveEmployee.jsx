import React, { useEffect, useState } from 'react';
import {
    useDisclosure, Box, Button
} from '@chakra-ui/react';
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import { deleteEmployee } from 'utils/api/employee';
import { getEmployeeWithStatusPassive } from 'utils/api/ArchiveEmployee';
import VerificationModal from 'components/verification-modal/VerificationModal';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { CSVLink } from 'react-csv';
import { FaFileExcel } from 'react-icons/fa';

export default function Employee() {
    const { t } = useTranslation();
    const [tableDataColumns, setTableDataColumns] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const columnsDataColumns = [

        {
            Header: t('archive_employee:text_header_employee_firstname'),
            accessor: 'firstName',
        },
        {
            Header: t('archive_employee:text_header_employee_lastname'),
            accessor: 'lastName',
        },
        {
            Header: t('archive_employee:text_header_employee_birthdate'),
            accessor: 'birthDate',
        },
        {
            Header: t('archive_employee:text_header_employee_personalnumber'),
            accessor: 'personalNumber',
        },
        {
            Header: t('archive_employee:text_header_employee_adress'),
            accessor: 'address',
        },
        {
            Header: t('employee:text_header_employee_email'),
            accessor: 'email',
        },
        {
            Header: t('archive_employee:text_header_employee_phonenumber'),
            accessor: 'phoneNumber',
        },
        {
            Header: t('archive_employee:text_header_employee_jobposition'),
            accessor: 'jobPosition.positionName',
        },
        {
            Header: t('archive_employee:text_header_employee_status'),
            accessor: 'status',
        },
        {
            Header: t('archive_employee:text_header_button_notes'),
            accessor: 'notes',
        },
    ];
    const headers = [
        { label: t('archive_employee:text_header_employee_firstname'), key: 'firstName' },
        { label: t('archive_employee:text_header_employee_lastname'), key: 'lastName' },
        { label: t('archive_employee:text_header_employee_birthdate'), key: 'birthDate' },
        { label: t('archive_employee:text_header_employee_personalnumber'), key: 'personalNumber' },
        { label: t('archive_employee:text_header_employee_adress'), key: 'address' },
        { label: t('archive_employee:text_header_employee_phonenumber'), key: 'phoneNumber' },
        { label: t('archive_employee:text_header_employee_jobposition'), key: 'jobPosition.positionName' },
        { label: t('archive_employee:text_header_button_notes'), key: 'notes' },
        { label: t('archive_employee:text_header_employee_status'), key: 'status' },
    ];
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

    const [emptyLoading, setEmptyLoading] = useState('');
    const fetchEmployee = async () => {
        try {
            const res = await getEmployeeWithStatusPassive();
            if (res.data.length) {
                setEmptyLoading('');
                setEmployees(res.data);
            } else {
                setEmptyLoading('Nuk Egziston asnje Puntor Pasiv!');
            }
        } catch (err) {
            showError(t('toast_card_notification:text_error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, []);

    useEffect(() => {
        if (!employees) setTableDataColumns([]);
        setTableDataColumns(employees);
    }, [employees]);

    const filterEmployee = (searchValue) => {
        if (!searchValue) setTableDataColumns();

        const filteredEmployees = employees.filter((employee) => {
            const {
                firstName, lastName, personalNumber, birthDate, address, phoneNumber, jobPosition, notes
            } = employee;
            return (
                firstName.toLowerCase().includes(searchValue.toLowerCase())
                || lastName.toLowerCase().includes(searchValue.toLowerCase())
                || birthDate.toString().includes(searchValue)
                || personalNumber.toString().includes(searchValue)
                || address.toLowerCase().includes(searchValue.toLowerCase())
                || phoneNumber.toLowerCase().includes(searchValue.toLowerCase())
                || jobPosition.positionName.toString().toLowerCase().includes(searchValue.toLowerCase())
                || notes.toLowerCase().includes(searchValue.toLowerCase())

            );
        });
        setTableDataColumns(filteredEmployees);
    };

    const [employeeIdForDelete, setEmployeeIdForDelete] = useState(null);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

    useEffect(() => {
        if (!employeeIdForDelete) return;
        setIsVerificationModalOpen(true);
    }, [employeeIdForDelete]);

    const [selectedEmployee, setSelectedEmployee] = useState();
    const { onOpen, } = useDisclosure();

    useEffect(() => {
        if (!selectedEmployee) return;
        onOpen();
    }, [selectedEmployee]);

    return (
        <Box marginTop="80px">
            <Button
                leftIcon={<FaFileExcel />}
                variant="brand"
                marginBottom="20px"
                // background="#217346" Excel Color
                background="teal"
                color="white"
                float="right"
                marginRight="2%"
            >
                <CSVLink data={tableDataColumns} headers={headers}>
                    {t('excel:button_export_data')}
                </CSVLink>
            </Button>
            <ToastContainer />
            <VerificationModal
                showModal={isVerificationModalOpen}
                closeModal={() => {
                    setEmployeeIdForDelete(null);
                    setIsVerificationModalOpen(false);
                }}
                onVerify={() => {
                    deleteEmployee(employeeIdForDelete)
                        .then((res) => console.log(res, 'result'))
                        .catch(() => {
                            showError(t('archive_employee_update_modal:text_employee_update_check_manager_if_its_active'));
                        })
                        .finally(() => {
                            setEmployeeIdForDelete(null);
                            setIsVerificationModalOpen(false);
                            fetchEmployee();
                        });
                }}
                onCancel={() => {
                    setEmployeeIdForDelete(null);
                    setIsVerificationModalOpen(false);
                }}
            />
            <ColumnsTable
                columnsData={columnsDataColumns}
                loading={loading}
                tableData={tableDataColumns}
                onSelectedForDelete={(selectCard) => {
                    setEmployeeIdForDelete(selectCard.id);
                }}
                onSelectedForUpdate={(SelectedEmployeeId) => {
                    setSelectedEmployee(SelectedEmployeeId);
                }}
                onSearch={filterEmployee}
                nullTable={emptyLoading}
            />
        </Box>

    );
}
