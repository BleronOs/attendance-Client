import React, { useEffect, useState } from 'react';
import {
    Button,
    useDisclosure,
    Box
} from '@chakra-ui/react';
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';

import { getJobPositions, deleteJobPosition } from 'utils/api/JobPosition';
import VerificationModal from 'components/verification-modal/VerificationModal';
import { useTranslation } from 'react-i18next';
import { AddIcon } from '@chakra-ui/icons';
import { toast, ToastContainer } from 'react-toastify';
import { CSVLink } from 'react-csv';
import { FaFileExcel } from 'react-icons/fa';
import Ts from './test';
import UpdateJobPositionModal from './UpdateJobPosition';

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
export default function JobPosition() {
    const [jobPositions, setJobPositions] = useState([]);
    const [tableDataColumns, setTableDataColumns] = useState([]);
    const [selectedJobPosition, setSelectedJobPosition] = useState(null);
    const [jobPositionIdForDelete, setJobPositionIdForDelete] = useState(null);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [isFormModalForJobPositionOpen, setIsFormModalForJobPositionOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const columnsDataColumns = [
        {
            Header: t('job_position:txt_header_name'),
            accessor: 'positionName',
        },
        {
            Header: t('card:txt_tbl_status'),
            accessor: 'status',
        },
        {
            Header: t('table_headers:buttons_update_delete'),
        }
    ];

    const headers = [
        { label: t('job_position:txt_header_name'), key: 'positionName' },
        { label: t('card:txt_tbl_status'), key: 'status' },
    ];
    useEffect(() => {
        if (!selectedJobPosition) return;
        onOpen();
    }, [selectedJobPosition]);

    useEffect(() => {
        if (!jobPositionIdForDelete) return;
        setIsVerificationModalOpen(true);
    }, [jobPositionIdForDelete]);

    useEffect(() => {
        if (!jobPositions) setTableDataColumns([]);
        setTableDataColumns(jobPositions);
    }, [jobPositions]);

    const [emptyLoading, setEmptyLoading] = useState('');
    const fetchJobPositions = async () => {
        try {
            const res = await getJobPositions();
            if (res.data.length) {
                setEmptyLoading('');
                setJobPositions(res.data);
            } else {
                setEmptyLoading('Nuk Egziston asnje Pozicion i Punes!');
            }
        } catch (err) {
            showError(t('toast_card_notification:text_error'));
        } finally {
            setLoading(false);
        }
    };

    const filterJobPositions = (searchValue) => {
        if (!searchValue) setTableDataColumns(jobPositions);

        const filteredJobPositions = jobPositions.filter((jobPosition) => {
            if (jobPosition.positionName.toLowerCase().includes(searchValue.toLowerCase()) || jobPosition.status.toString().toLowerCase().includes(searchValue.toLowerCase())) {
                return jobPosition;
            }
            return null;
        });
        setTableDataColumns(filteredJobPositions);
    };

    useEffect(() => {
        fetchJobPositions();
    }, []);
    const role = JSON.parse(localStorage.getItem('access_role'))[0].roleId;
    return (
    <>
        <ToastContainer />
        <Box marginTop="80px">
            {role == 1 && (
                <Button
                    leftIcon={<AddIcon />}
                    variant="brand"
                    marginBottom="20px"
                    background="teal"
                    color="white"
                    onClick={() => {
                        setIsFormModalForJobPositionOpen(true);
                    }}
                    t={t}
                >
                    {t('job_position:txt_add_button')}
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

            <Ts
                isOpenModal={isFormModalForJobPositionOpen}
                onCloseModal={() => {
                    setIsFormModalForJobPositionOpen(false);
                }}
                reloadWorkPositions={() => {
                    fetchJobPositions();
                }}
                t={t}
            />

            <UpdateJobPositionModal
                showModal={isOpen}
                closeModal={() => {
                    onClose();
                    fetchJobPositions();
                }}
                selectedJobPosition={selectedJobPosition}
                t={t}
            />
            <VerificationModal
                showModal={isVerificationModalOpen}
                closeModal={() => {
                    setJobPositionIdForDelete(null);
                    setIsVerificationModalOpen(false);
                }}
                onVerify={() => {
                    deleteJobPosition(jobPositionIdForDelete)
                        .then(() => {
                            showSuccess(t('job_position:txt_delete_success'));
                        })
                        .catch((err) => {
                            if (err.response.status === 900) {
                            showError('Ky Prozicion i Punes eshte ne perdorim');
                            } else {
                            showError(t('toast_card_notification:text_error'));
                            }
                        })
                        .finally(() => {
                            setJobPositionIdForDelete(null);
                            setIsVerificationModalOpen(false);
                            fetchJobPositions();
                        });
                }}
                onCancel={() => {
                    setJobPositionIdForDelete(null);
                    setIsVerificationModalOpen(false);
                }}
            />

            {' '}
            <ColumnsTable
                columnsData={columnsDataColumns}
                loading={loading}
                tableData={tableDataColumns}
                onSelectedForUpdate={(selectedWorkPosition) => {
                    setSelectedJobPosition(selectedWorkPosition);
                }}
                onSelectedForDelete={(selectedWorkPosition) => {
                    setJobPositionIdForDelete(selectedWorkPosition.id);
                }}
                onSearch={(searchValue) => {
                    filterJobPositions(searchValue);
                }}
                nullTable={emptyLoading}
            />
        </Box>
    </>
    );
}
