import React, { useEffect, useState } from 'react';
import {
    Button,
    useDisclosure,
    Box,
} from '@chakra-ui/react';
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import { getEmployeeWithStatusActive, getEmployeeBasedInManagerId, deleteEmployee } from 'utils/api/employee';
// import VerificationModal from 'components/verification-modal/VerificationModal';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { AddIcon } from '@chakra-ui/icons';
import { CSVLink } from 'react-csv';
import { FaFileExcel } from 'react-icons/fa';
import AddEmployee from './AddEmployee';
import UpdateEmployeeModal from './UpdateEmployee';
import DeleteEmployeeModal from './DeleteEmployeeModal';
import Remarks from './Remarks/Remarks';

export default function Employee() {
    const { t } = useTranslation();
    const [tableDataColumns, setTableDataColumns] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const columnsDataColumns = [

        {
            Header: t('employee:text_header_employee_firstname'),
            accessor: 'firstName',
        },
        {
            Header: t('employee:text_header_employee_lastname'),
            accessor: 'lastName',
        },
        {
            Header: t('employee:text_header_employee_birthdate'),
            accessor: 'birthDate',
        },
        {
            Header: t('employee:text_header_employee_personalnumber'),
            accessor: 'personalNumber',
        },
        {
            Header: t('employee:text_header_employee_adress'),
            accessor: 'address',
        },
        {

            Header: t('employee:text_header_employee_email'),
            accessor: 'email',
        },
        {
            Header: t('employee:text_header_employee_phonenumber'),
            accessor: 'phoneNumber',
        },
        {
            Header: t('employee:text_header_employee_jobposition'),
            accessor: 'jobPosition.positionName',
        },
        {
            Header: t('employee:text_header_employee_status'),
            accessor: 'status',
        },
        {
            Header: t('employee_managment:text_employee_managment_options')
        }
    ];
    const headers = [
        { label: t('archive_employee:text_header_employee_firstname'), key: 'firstName' },
        { label: t('archive_employee:text_header_employee_lastname'), key: 'lastName' },
        { label: t('archive_employee:text_header_employee_birthdate'), key: 'birthDate' },
        { label: t('archive_employee:text_header_employee_personalnumber'), key: 'personalNumber' },
        { label: t('archive_employee:text_header_employee_adress'), key: 'address' },
        { label: t('archive_employee:text_header_employee_phonenumber'), key: 'phoneNumber' },
        { label: t('archive_employee:text_header_employee_jobposition'), key: 'jobPosition.positionName' },
        { label: t('archive_employee:text_header_employee_status'), key: 'status' },
    ];
    const role = JSON.parse(localStorage.getItem('access_role'))[0].roleId;
    const employeeUserId = JSON.parse(localStorage.getItem('access_employee'));
    // Get Data From Api Based on RoleId and EmployeeId
    const [emptyLoading, setEmptyLoading] = useState('');
    const fetchEmployee = async (employeeUserId) => {
        try {
            let res;
            if (role == 1) {
                res = await getEmployeeWithStatusActive();
            } else {
                res = await getEmployeeBasedInManagerId(employeeUserId);
            }
            if (res.data.length) {
                setEmptyLoading('');
                setEmployees(res.data);
            } else {
                setEmptyLoading('Nuk Egziston asnje Puntor/e');
            }
        } catch (err) {
            console.log(err, 'erro from back');
        } finally {
            setLoading(false);
        }
    };
    useEffect(async () => {
        await fetchEmployee(employeeUserId);
    }, [employeeUserId]);

    useEffect(() => {
        if (!employees) setTableDataColumns([]);
        setTableDataColumns(employees);
    }, [employees]);

    const filterEmployee = (searchValue) => {
        if (!searchValue) setTableDataColumns();

        const filteredEmployees = employees.filter((employee) => {
            const {
                firstName, lastName, personalNumber, birthDate, address, phoneNumber, jobPosition
            } = employee;
            return (
                firstName.toLowerCase().includes(searchValue.toLowerCase())
                || lastName.toLowerCase().includes(searchValue.toLowerCase())
                || birthDate.toString().includes(searchValue)
                || personalNumber.toString().includes(searchValue)
                || address.toLowerCase().includes(searchValue.toLowerCase())
                || phoneNumber.toLowerCase().includes(searchValue.toLowerCase())
                || jobPosition.positionName.toString().toLowerCase().includes(searchValue.toLowerCase())

            );
        });
        setTableDataColumns(filteredEmployees);
    };
    const [employeeIdForDelete, setEmployeeIdForDelete] = useState();
    const [isVerificationModalOpen, setIsVerificationModalOpen2] = useState(false);
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [isRemarksModalOpen, setIsRemarksModalOpen] = useState(false);

    useEffect(() => {
        if (!employeeIdForDelete) return;
        setIsVerificationModalOpen2(true);
    }, [employeeIdForDelete]);

    const [selectedEmployee, setSelectedEmployee] = useState();
    const [selectedEmployeeRemark, setSelectedEmployeeRemark] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (!selectedEmployee) return;
        onOpen();
    }, [selectedEmployee]);

    useEffect(() => {
        if (!selectedEmployeeRemark) return;
        setIsRemarksModalOpen(true);
    }, [selectedEmployeeRemark]);
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

    return (
        <Box marginTop="80px">

            <div>
                {role == 1 && (
                    <Button
                        leftIcon={<AddIcon />}
                        variant="brand"
                        marginBottom="20px"
                        background="teal"
                        color="white"
                        onClick={() => {
                            setIsEmployeeModalOpen(true);
                        }}
                        t={t}
                    >
                        {t('employee:text_button_add_employee')}
                    </Button>
                )}
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
            </div>
            <AddEmployee
                isOpenModal={isEmployeeModalOpen}
                onCloseModal={() => setIsEmployeeModalOpen(false)}
                reloadWorkPositions={() => fetchEmployee()}
                t={t}
            />
            <Remarks
                openModal={isRemarksModalOpen}
                closeModal={() => {
                    setSelectedEmployeeRemark();
                    onClose();
                    setIsRemarksModalOpen(false);
                }}
                reloadWorkPositions={() => fetchEmployee()}
                selectEmployee={selectedEmployeeRemark}
                t={t}
            />

            <UpdateEmployeeModal
                showModal={isOpen}
                closeModal={() => {
                    onClose();
                    fetchEmployee();
                }}
                selectedEmployee={selectedEmployee}
            />

            <ToastContainer />

            <DeleteEmployeeModal
                showModal={isVerificationModalOpen}
                closeModal={() => {
                    onClose();
                    fetchEmployee();
                    setIsVerificationModalOpen2(false);
                }}
                onVerify={() => {
                    deleteEmployee(employeeIdForDelete)
                        .then(() => {
                            showSuccess(t('toast_manager_notification:text_delete_success'));
                        })
                        .catch(() => {
                            showError(t('toast_manager_notification:text_error'));
                        })
                        .finally(() => {
                            setEmployeeIdForDelete(null);
                            setIsVerificationModalOpen2(false);
                            fetchEmployee();
                        });
                }}
                selectedEmployee={employeeIdForDelete}
            />

            <ColumnsTable
                columnsData={columnsDataColumns}
                loading={loading}
                tableData={tableDataColumns}
                onSelectedForDelete={(selectCard) => {
                    setEmployeeIdForDelete(selectCard);
                }}
                onSelectedForUpdate={(SelectedEmployeeId) => setSelectedEmployee(SelectedEmployeeId)}
                onSelectedForRemarks={(SelectedEmployeeId) => setSelectedEmployeeRemark(SelectedEmployeeId)}
                onSearch={filterEmployee}
                nullTable={emptyLoading}
            />
        </Box>
    );
}
