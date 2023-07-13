import React, { useEffect, useState } from 'react';
import {
    Button,
    useDisclosure,
    Box,
} from '@chakra-ui/react';
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import { getEmployeeManagment, deleteEmployeeManagment, getManagersByRoleId } from 'utils/api/EmployeeManagment';
import VerificationModal from 'components/verification-modal/VerificationModal';
import { useTranslation } from 'react-i18next';
import { AddIcon } from '@chakra-ui/icons';
import { toast, ToastContainer } from 'react-toastify';
import { CSVLink } from 'react-csv';
import { FaFileExcel } from 'react-icons/fa';
import AddEmployeeManagment from './AddEmployeeManagment';
import UpdateEmployeeManagmentModal from './UpdateEmployeeManagment';

export default function Employee() {
    const [tableDataColumns, setTableDataColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const roles = JSON.parse(localStorage.getItem('access_role'))[0].roleId;
    const columnsDataColumns = [
        {
            Header: t('employee_managment:text_manager_firstname'),
            accessor: 'manager.employee.firstName',
        },
        {
            Header: t('employee_managment:text_manager_lastname'),
            accessor: 'manager.employee.lastName',
        },
        {
            Header: t('employee_managment:text_employee_firstname'),
            accessor: 'employee.firstName',
        },
        {
            Header: t('employee_managment:text_employee_lastname'),
            accessor: 'employee.lastName',
        },
    ];
    if (roles == 1) {
        columnsDataColumns.push({
            Header: t('employee_managment:text_employee_managment_actions'),
        });
    }
    const headers = [
        { label: t('employee_managment:text_manager_firstname'), key: 'manager.employee.firstName' },
        { label: t('employee_managment:text_manager_lastname'), key: 'manager.employee.lastName' },
        { label: t('employee_managment:text_employee_firstname'), key: 'employee.firstName' },
        { label: t('employee_managment:text_employee_lastname'), key: 'employee.lastName' },
    ];

    const role = JSON.parse(localStorage.getItem('access_role'))[0].roleId;
    const employeeUserId = JSON.parse(localStorage.getItem('access_employee'));

    // Get Data From Api Based on RoleId and EmployeeId
    const [emptyLoading, setEmptyLoading] = useState('');
    const fetchEmployeeManagment = async (employeeUserId) => {
        try {
            let res;
            if (role == 1) {
                res = await getEmployeeManagment();
            } else {
                res = await getManagersByRoleId(employeeUserId);
            }
            if (res.data.length) {
                setEmptyLoading('');
                setTableDataColumns(res.data);
            } else {
                setEmptyLoading('Nuk Egziston asnje Puntore ne Menaxhim!');
            }
        } catch (err) {
            t('toast_card_notification:text_error');
        } finally {
            setLoading(false);
        }
    };
    useEffect(async () => {
        await fetchEmployeeManagment(employeeUserId);
    }, [employeeUserId]);

    const [employeeManagmentIdForDelete, setEmployeeManagmentIdForDelete] = useState(null);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

    useEffect(() => {
        if (!employeeManagmentIdForDelete) return;
        setIsVerificationModalOpen(true);
    }, [employeeManagmentIdForDelete]);

    const [selectedEmployeeManagment, setSelectedEmployeeManagment] = useState();
    const [isEmployeeManagmentModalOpen, setIsEmployeeManagmentModalOpen] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (!selectedEmployeeManagment) return;
        onOpen();
    }, [selectedEmployeeManagment]);

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

            {role == 1 && (
                <Button
                    leftIcon={<AddIcon />}
                    variant="brand"
                    marginBottom="20px"
                    background="teal"
                    color="white"
                    onClick={() => {
                        setIsEmployeeManagmentModalOpen(true);
                    }}
                    t={t}
                >
                    {t('employee_managment:text_add_button')}
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

            <AddEmployeeManagment
                isOpenModal={isEmployeeManagmentModalOpen}
                onCloseModal={() => {
                    setIsEmployeeManagmentModalOpen(false);
                }}
                reloadWorkPositions={() => {
                    fetchEmployeeManagment(employeeUserId);
                }}
                t={t}
            />

            <UpdateEmployeeManagmentModal
                showModal={isOpen}
                closeModal={() => {
                    onClose();
                    fetchEmployeeManagment();
                }}
                selectedEmployeeManagment={selectedEmployeeManagment}
            />
            <ToastContainer />
            <VerificationModal
                showModal={isVerificationModalOpen}
                closeModal={() => {
                    setEmployeeManagmentIdForDelete(null);
                    setIsVerificationModalOpen(false);
                }}
                onVerify={() => {
                    deleteEmployeeManagment(employeeManagmentIdForDelete)
                        .then(() => {
                            showSuccess(t('toast_employee_managment_notification:text_delete_success'));
                            setTableDataColumns([]);
                            fetchEmployeeManagment();
                        })
                        .catch(() => {
                            showError(t('toast_employee_managment_notification:text_error'));
                        })
                        .finally(() => {
                            setEmployeeManagmentIdForDelete(null);
                            setIsVerificationModalOpen(false);
                        });
                }}
                onCancel={() => {
                    setEmployeeManagmentIdForDelete(null);
                    setIsVerificationModalOpen(false);
                }}
            />
            <ColumnsTable
                columnsData={columnsDataColumns}
                loading={loading}
                tableData={tableDataColumns}
                onSelectedForDelete={(selectCard) => {
                    setEmployeeManagmentIdForDelete(selectCard.id);
                }}
                onSelectedForUpdate={(SelectedEmployeeManagmentId) => {
                    setSelectedEmployeeManagment(SelectedEmployeeManagmentId);
                }}
                nullTable={emptyLoading}
            />
        </Box>
    );
}
