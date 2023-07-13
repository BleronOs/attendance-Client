import React, { useState, useEffect } from 'react';
import { getCardWithStatusFalse, UpdateCardStatusIfEmployeeIsActive } from 'utils/api/Card';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@chakra-ui/react';
import VerificationModal from 'components/verification-modal/VerificationModal';
import { ToastContainer, toast } from 'react-toastify';
import { CSVLink } from 'react-csv';
import { FaFileExcel } from 'react-icons/fa';
import ColumnsTable from '../dataTables/components/ColumnsTable';

const ArchiveCard = () => {
    const [tableDataColumns, setTableDataColumns] = useState([]);
    const [isVerificationJobPositionModalOpen, setIsVerificationJobPositionModalOpen] = useState(false);
    const [jobPositionIdForUpdateStatus, setJobPositionIdForUpdateStatus] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [status, setStatus] = useState(false);
    const [cardRefId, setCardRefId] = useState('');
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    const columnsDataColumns = [
        {
            Header: t('card:txt_tbl_card'),
            accessor: 'cardRefId',
        },
        {
            Header: t('card:txt_tbl_firstname'),
            accessor: 'employee.firstName',
        },
        {
            Header: t('card:txt_tbl_lastname'),
            accessor: 'employee.lastName',
        },
        {
            Header: t('card:txt_modal_add_reason'),
            accessor: 'reasonNote',
        },
        {
            Header: t('card:txt_tbl_reason'),
            accessor: 'note',
        },
        {
            Header: t('card:txt_tbl_status'),
            accessor: 'status',
        },
        {
            Header: t('card:txt_activation_card'),
        }
    ];

    const headers = [
        { label: t('card:txt_tbl_card'), key: 'cardRefId' },
        { label: t('card:txt_tbl_firstname'), key: 'employee.firstName' },
        { label: t('card:txt_tbl_lastname'), key: 'employee.lastName' },
        { label: t('card:txt_tbl_reason'), key: 'note' },
        { label: t('card:txt_tbl_status'), key: 'status' },
    ];
    useEffect(() => {
        if (!jobPositionIdForUpdateStatus) return;
        setIsVerificationJobPositionModalOpen(true);
    }, [jobPositionIdForUpdateStatus]);
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
    // success Notification
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
    // search card status false
    const [cards, setCards] = useState([]);
    useEffect(() => {
        if (!cards) setTableDataColumns([]);
        setTableDataColumns(cards);
    }, [cards]);

    const filterCard = (searchValue) => {
        if (!searchValue) setTableDataColumns();
        const filteredCards = cards.filter((card) => {
            const {
                cardRefId, employee, reasonNote
            } = card;
            return (
                employee.firstName.toLowerCase().includes(searchValue.toLowerCase())
                || employee.lastName.toLowerCase().includes(searchValue.toLowerCase())
                || cardRefId.toString().includes(searchValue)
                || reasonNote.toLowerCase().includes(searchValue.toLowerCase())
            );
        });
        setTableDataColumns(filteredCards);
    };

    // get Cards with status False
    const [emptyLoading, setEmptyLoading] = useState('');
    const getCardStatusFalse = async () => {
        try {
            const res = await getCardWithStatusFalse();
            if (res.data.length) {
                setEmptyLoading('');
                setCards(res.data);
            } else {
                setEmptyLoading(t('archive_card:text_loading_error'));
            }
        } catch (error) {
            showError(t('toast_card_notification:text_error'));
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getCardStatusFalse();
    }, []);
    const UpdateCardStatus = async (id, employeeId, statusi, cardRefId) => {
        try {
            console.log(id, employeeId, statusi, cardRefId, 'bbbbbb');
            const res = await UpdateCardStatusIfEmployeeIsActive(id, employeeId, statusi, cardRefId);
            if (res.status === 200) {
                showSuccess('Kartela u aktivisua me sukses');
            }
            getCardStatusFalse();
        } catch (error) {
            if (error.response.data.status === 2000) {
                showError('Pronari i Karteles eshte Punotor Pasive');
            } else {
                showError(t('toast_card_notification:text_error'));
            }
        }
    };

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
            <ColumnsTable
                columnsData={columnsDataColumns}
                loading={loading}
                tableData={tableDataColumns}
                onSelectedForDelete={(selectCard) => {
                    setJobPositionIdForUpdateStatus(selectCard.id);
                    setEmployeeId(selectCard.employee.id);
                    setStatus(selectCard.status);
                    setCardRefId(selectCard.cardRefId);
                }}
                onSearch={(searchValue) => {
                    filterCard(searchValue);
                }}
                nullTable={emptyLoading}
            />
            <ToastContainer />
            <VerificationModal
                showModal={isVerificationJobPositionModalOpen}
                closeModal={() => {
                    setJobPositionIdForUpdateStatus();
                    setIsVerificationJobPositionModalOpen(false);
                }}
                onVerify={() => {
                    UpdateCardStatus(jobPositionIdForUpdateStatus, employeeId, status, cardRefId);
                    setJobPositionIdForUpdateStatus();
                    setIsVerificationJobPositionModalOpen(false);
                }}
                onCancel={() => {
                    setJobPositionIdForUpdateStatus();
                    setIsVerificationJobPositionModalOpen(false);
                }}
            />
        </Box>

    );
};

export default ArchiveCard;
