import React, { useEffect, useState } from 'react';
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import { deleteEmployee, getEmployeeWithStatusActive } from 'utils/api/employee';
import VerificationModal from 'components/verification-modal/VerificationModal';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function Employee() {
    const { t } = useTranslation();
    const [tableDataColumns, setTableDataColumns] = useState([]);
    const [employees, setEmployees] = useState([]);
    const columnsDataColumns = [

        {
            Header: 'Emri',
            accessor: 'firstName',
        },
        {
            Header: 'Mbiemri',
            accessor: 'lastName',
        },
        {
            Header: 'Emaili',
            accessor: 'email',
        },
        {
            Header: 'UserName',
            accessor: 'pldh',
        },
        {
            Header: 'Password',
            accessor: 'palidhje',
        },
        {
            Header: 'Roli',
            accessor: 'paliddhje',
        },
        {
            Header: 'Statusi',
            accessor: 'status',
        },
        {
            Header: t('employee_managment:text_employee_managment_actions'),
        }
    ];
    useEffect(() => {
        if (!employees) setTableDataColumns([]);
        setTableDataColumns(employees);
    }, [employees]);

    const fetchEmployee = async () => {
        try {
            const res = await getEmployeeWithStatusActive();
            setEmployees(res.data);
        } catch (err) {
            console.error(err, 'error from backend');
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, []);
    const [employeeIdForDelete, setEmployeeIdForDelete] = useState(null);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

    useEffect(() => {
        if (!employeeIdForDelete) return;
        setIsVerificationModalOpen(true);
    }, [employeeIdForDelete]);

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
        <>

<ToastContainer />
            <VerificationModal
                showModal={isVerificationModalOpen}
                closeModal={() => {
                    setEmployeeIdForDelete(null);
                    setIsVerificationModalOpen(false);
                }}
                onVerify={() => {
                    deleteEmployee(employeeIdForDelete)
                        .then(() => {
                            showSuccess(t('toast_employee_notification:text_delete_success'));
                        })
                        .catch(() => {
                            showError(t('toast_employee_notification:text_error'));
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
                tableData={tableDataColumns}
            />

        </>

    );
}
