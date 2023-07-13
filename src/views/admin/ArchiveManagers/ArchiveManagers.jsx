import React, { useEffect, useState } from 'react';
import {
    useDisclosure,
    Box,
    Button
} from '@chakra-ui/react';
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import { getManagersWithStatusPassive } from 'utils/api/ArchiveManagers';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { CSVLink } from 'react-csv';
import { FaFileExcel } from 'react-icons/fa';
import UpdateManagersModal from './UpdateArchiveManagers';

export default function Managers() {
    const { t } = useTranslation();
    const [tableDataColumns, setTableDataColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [managers, setManagers] = useState([]);
    const columnsDataColumns = [

        {
            Header: t('archive_manager:text_header_manager_firstname'),
            accessor: 'employee.firstName',
        },
        {
            Header: t('archive_manager:text_header_manager_lastname'),
            accessor: 'employee.lastName',
        },
        {
            Header: t('archive_manager:text_header_manager_status'),
            accessor: 'status',
        },
        {
            Header: t('archive_manager_update_modal:text_manager_button_name'),
        }
    ];
    const headers = [
        { label: t('archive_manager:text_header_manager_firstname'), key: 'employee.firstName' },
        { label: t('archive_manager:text_header_manager_lastname'), key: 'employee.lastName' },
        { label: t('archive_manager:text_header_manager_status'), key: 'status' },
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
    const fetchManagers = async () => {
        try {
            const res = await getManagersWithStatusPassive();
            if (res.data.length) {
                setEmptyLoading('');
                setManagers(res.data);
            } else {
                setEmptyLoading('Nuk Egziston asnje Menaxher Pasive!');
            }
        } catch (err) {
            console.error(err, 'error from backend');
            showError('error');
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
    const [, setIsVerificationModalOpen] = useState(false);

    useEffect(() => {
        if (!jobPositionIdForDelete) return;
        setIsVerificationModalOpen(true);
    }, [jobPositionIdForDelete]);

    const [selectedManagers, setSelectedManagers] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (!selectedManagers) return;
        onOpen();
    }, [selectedManagers]);

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

            <UpdateManagersModal
                showModal={isOpen}
                closeModal={() => {
                    onClose();
                    fetchManagers();
                }}
                selectedManagers={selectedManagers}
            />
            <ToastContainer />
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
