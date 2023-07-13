import React, { useEffect, useState } from 'react';
import {
    useDisclosure,
    Button, Box,
} from '@chakra-ui/react';
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import { getCard, deleteCard, getCardByEmployeeId } from 'utils/api/Card';
import VerificationModal from 'components/verification-modal/VerificationModal';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { AddIcon } from '@chakra-ui/icons';
import { CSVLink } from 'react-csv';
import { FaFileExcel } from 'react-icons/fa';
import AddCard from './AddCard';
import UpdateCardModal from './UpdateCard';

export default function Card() {
    const [tableDataColumns, setTableDataColumns] = useState([]);

    // useTranslation
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);

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
            Header: t('card:txt_modal_add_automated_reason'),
            accessor: 'note',
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
        { label: t('card:txt_tbl_card'), key: 'cardRefId' },
        { label: t('card:txt_tbl_firstname'), key: 'employee.firstName' },
        { label: t('card:txt_tbl_lastname'), key: 'employee.lastName' },
        { label: t('card:txt_modal_add_reason'), key: 'reasonNote' },
        { label: t('card:txt_modal_add_server_reason'), key: 'note' },
        { label: t('card:txt_tbl_status'), key: 'status' },
    ];
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
    const showErrorr = (errorrMessage) => {
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
    const [jobPositionIdForDelete, setJobPositionIdForDelete] = useState(null);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [emptyLoading, setEmptyLoading] = useState('');

    useEffect(() => {
        if (!jobPositionIdForDelete) return;
        setIsVerificationModalOpen(true);
    }, [jobPositionIdForDelete]);

    const [selectedCard, setSelectedCard] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (!selectedCard) return;
        onOpen();
    }, [selectedCard]);

    const role = JSON.parse(localStorage.getItem('access_role'))[0].roleId;
    const employeeId = JSON.parse(localStorage.getItem('access_employee'));

    // Search Cards
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
                || reasonNote.toLowerCase().includes(searchValue.toLowerCase())
                || cardRefId.toString().includes(searchValue)
            );
        });
        setTableDataColumns(filteredCards);
    };
    const fetchCard = async (employeeId) => {
        try {
            let res;
            if (role == 1) {
                res = await getCard();
            } else {
                res = await getCardByEmployeeId(employeeId);
            }

            if (res.data.length) {
                setEmptyLoading('');
                setCards(res.data);
            } else {
                setEmptyLoading(t('card:txt_loading_error'));
            }
        } catch (err) {
            console.log(err, 'erro from back');
        } finally {
            setLoading(false);
        }
    };
    useEffect(async () => {
        await fetchCard(employeeId);
    }, [employeeId]);

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
                            setIsFormModalOpen(true);
                        }}
                        t={t}
                    >
                        {t('card:txt_add_button_card')}
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
                    <CSVLink data={cards} headers={headers}>
                        {t('excel:button_export_data')}
                    </CSVLink>
                </Button>
                <AddCard
                    isOpenModal={isFormModalOpen}
                    onCloseModal={() => {
                        setIsFormModalOpen(false);
                    }}
                    reloadWorkPositions={() => {
                        fetchCard();
                    }}
                    t={t}
                />

                <UpdateCardModal
                    showModal={isOpen}
                    closeModal={() => {
                        onClose();
                        fetchCard();
                    }}
                    selectedCard={selectedCard}
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
                        deleteCard(jobPositionIdForDelete)
                            .then(() => {
                                showSuccess(t('toast_card_notification:text_delete_success'));
                            })
                            .catch(() => {
                                showErrorr(t('toast_card_notification:text_error'));
                            })

                            .finally(() => {
                                setJobPositionIdForDelete(null);
                                setIsVerificationModalOpen(false);
                                fetchCard();
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
                    emptyLoad={emptyLoading}
                    tableData={tableDataColumns}
                    onSelectedForDelete={(selectCard) => {
                        setJobPositionIdForDelete(selectCard.id);
                    }}
                    onSelectedForUpdate={(SelectedCardRefId) => {
                        setSelectedCard(SelectedCardRefId);
                    }}
                    onSearch={(searchValue) => {
                        filterCard(searchValue);
                    }}
                    nullTable={emptyLoading}
                />

            </div>

        </Box>
    );
}
