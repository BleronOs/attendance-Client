import React, { useEffect, useState } from 'react';
import {
    Button,
    useDisclosure,
    Box,
} from '@chakra-ui/react';
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import { deleteManagers, getManagersWithStatusActive } from 'utils/api/Manager';
import VerificationModal from 'components/verification-modal/VerificationModal';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { AddIcon } from '@chakra-ui/icons';
import { CSVLink } from 'react-csv';
import { FaFileExcel } from 'react-icons/fa';
import AddManagers from './AddManager';

export default function Managers() {
    const { t } = useTranslation();
    const [tableDataColumns, setTableDataColumns] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);

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
    const columnsDataColumns = [

        {
            Header: t('manager:text_header_manager_firstname'),
            accessor: 'employee.firstName',
        },
        {
            Header: t('manager:text_header_manager_lastname'),
            accessor: 'employee.lastName',
        },
        {
            Header: t('manager:text_header_manager_status'),
            accessor: 'status',
        },
        {
            Header: t('manager:text_header_button_delete'),
        }
    ];
    const headers = [
        { label: t('archive_manager:text_header_manager_firstname'), key: 'employee.firstName' },
        { label: t('archive_manager:text_header_manager_lastname'), key: 'employee.lastName' },
        { label: t('archive_manager:text_header_manager_status'), key: 'status' },
    ];
    const [emptyLoading, setEmptyLoading] = useState('');
    const fetchManagers = async () => {
        try {
            const res = await getManagersWithStatusActive();

            if (res.data.length) {
                setEmptyLoading('');
                setManagers(res.data);
            } else {
                setEmptyLoading('Nuk Egziston asnje Menaxher');
            }
        } catch (err) {
            showError(t('toast_card_notification:text_error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManagers();
    }, []);

    // Filter Function

    useEffect(() => {
        if (!managers) setTableDataColumns([]);
        setTableDataColumns(managers);
    }, [managers]);

    const filterManager = (searchValue) => {
        if (!searchValue) setTableDataColumns();
        const filteredCards = managers.filter((card) => {
            const {
                employee, status
            } = card;
            return (
                employee.firstName.toLowerCase().includes(searchValue.toLowerCase())
                || employee.lastName.toLowerCase().includes(searchValue.toLowerCase())
                || status.toString().toLowerCase().includes(searchValue.toLowerCase())
            );
        });
        setTableDataColumns(filteredCards);
    };
    const [jobPositionIdForDelete, setJobPositionIdForDelete] = useState(null);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

    useEffect(() => {
        if (!jobPositionIdForDelete) return;
        setIsVerificationModalOpen(true);
    }, [jobPositionIdForDelete]);

    const [selectedManagers, setSelectedManagers] = useState();
    const [isManagersModalOpen, setIsManagersModalOpen] = useState(false);
    const { onOpen, } = useDisclosure();

    useEffect(() => {
        if (!selectedManagers) return;
        onOpen();
    }, [selectedManagers]);
    const role = JSON.parse(localStorage.getItem('access_role'))[0].roleId;

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
                            setIsManagersModalOpen(true);
                        }}
                        t={t}
                    >
                        {t('manager:text_button_add_manager')}

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

            <AddManagers
                isOpenModal={isManagersModalOpen}
                activeManagers={tableDataColumns}
                onCloseModal={() => {
                    setIsManagersModalOpen(false);
                }}
                reloadWorkPositions={() => {
                    fetchManagers();
                }}
                t={t}
            />
            <ToastContainer />
            <VerificationModal
                showModal={isVerificationModalOpen}
                closeModal={() => {
                    setJobPositionIdForDelete(null);
                    setIsVerificationModalOpen(false);
                }}
                onVerify={() => {
                    deleteManagers(jobPositionIdForDelete)
                        .then(() => {
                            showSuccess(t('toast_manager_notification:text_delete_success'));
                            setManagers([]);
                            fetchManagers();
                        })
                        .catch((error) => {
                            console.log(error.response.status, 'sss');
                            if (error.response.status == 900) {
                             return showError('Ky Menagjer ka Ende Puntore Aktive ne Menaxhim');
                            }
                            showError(t('toast_manager_notification:text_error'));
                        })
                        .finally(() => {
                            setJobPositionIdForDelete(null);
                            setIsVerificationModalOpen(false);
                        });
                }}
                onCancel={() => {
                    setJobPositionIdForDelete(null);
                    setIsVerificationModalOpen(false);
                }}
            />
            <ColumnsTable
                columnsData={columnsDataColumns}
                loading={loading}
                tableData={tableDataColumns}
                onSelectedForDelete={(selectedManagers) => {
                    setJobPositionIdForDelete(selectedManagers.id);
                }}
                onSelectedForUpdate={(SelectedEmployeeID) => {
                    setSelectedManagers(SelectedEmployeeID);
                }}
                onSearch={filterManager}
                nullTable={emptyLoading}
            />
        </Box>
    );
}
