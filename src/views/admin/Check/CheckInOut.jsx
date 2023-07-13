import {
    Box, Input, useColorModeValue, Button
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import { getChecksToday, getChecksTodayByEmployeeId, getEmployeeChecksTodayByEmployeeId } from 'utils/api/Check';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { CSVLink } from 'react-csv';
import { FaFileExcel } from 'react-icons/fa';

const CheckInOut = () => {
    // color
    const menuBg = useColorModeValue('white', 'navy.800');
    // table
    const [tableDataColumns, setTableDataColumns] = useState([]);
    // Date Parameter
    const [dateTime, setDateTime] = useState();
    // useTranslation
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const columnsDataColumns = [
        {
            Header: t('check_in_out:txt_tbl_card'),
            accessor: 'cardNumber'
        },
        {
            Header: t('check_in_out:txt_tbl_firstname'),
            accessor: 'name'
        },
        {
            Header: t('check_in_out:txt_tbl_lastname'),
            accessor: 'lastName'
        },
        {
            Header: t('check_in_out:txt_tbl_first_check_date_time'),
            accessor: 'firstDateTime'
        },
        {
            Header: t('check_in_out:txt_tbl_last_check_date_time'),
            accessor: 'lastDateTime'
        },
        {
            Header: t('check_in_out:txt_tbl_last_check_total_hours'),
            accessor: 'completedWeekHours'
        },
        {
            Header: t('check_in_out:txt_tbl_last_check_extra_hours'),
            accessor: 'totalWeekHours'
        }
    ];
    const headers = [
        { label: t('check_in_out:txt_tbl_card'), key: 'cardNumber' },
        { label: t('check_in_out:txt_tbl_firstname'), key: 'name' },
        { label: t('check_in_out:txt_tbl_lastname'), key: 'lastName' },
        { label: t('check_in_out:txt_tbl_first_check_date_time'), key: 'firstDateTime' },
        { label: t('check_in_out:txt_tbl_last_check_date_time'), key: 'lastDateTime' }
    ];
    // Search Check In Out
    const [checks, setChecks] = useState([]);
    useEffect(() => {
        if (!checks) setTableDataColumns([]);
        setTableDataColumns(checks);
    }, [checks]);
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
    const filterCheckInOut = (searchValue) => {
        if (!searchValue) setTableDataColumns();
        const filteredChecksInOut = checks.filter((check) => {
            const {
                cardNumber, name, lastName, firstDateTime, lastDateTime
            } = check;
            return (
                cardNumber.toString().includes(searchValue)
                || name.toLowerCase().includes(searchValue.toLowerCase())
                || lastName.toLowerCase().includes(searchValue.toLowerCase())
                || firstDateTime.toString().includes(searchValue)
                || lastDateTime.toString().includes(searchValue)
            );
        });
        setTableDataColumns(filteredChecksInOut);
    };

    const [emptyLoading, setEmptyLoading] = useState('');
    const getDataCheckInOut = async (dateTime) => {
        try {
            const role = JSON.parse(localStorage.getItem('access_role'))[0].roleId;
            const cardsByEmployeeId = JSON.parse(localStorage.getItem('access_employee'));
            let res;
            if (role == 1) {
                res = await getChecksToday(dateTime);
            } else if (role == 2) {
                res = await getChecksTodayByEmployeeId(dateTime, cardsByEmployeeId);
            } else {
                res = await getEmployeeChecksTodayByEmployeeId(dateTime, cardsByEmployeeId);
            }
            if (res.data.length) {
                setEmptyLoading('');
                setChecks(res.data);
            } else {
                setChecks([]);
                setEmptyLoading('Nuk Egziston asnje Check In Out!');
            }
        } catch (err) {
            showError(t('toast_card_notification:text_error'));
        } finally {
            setLoading(false);
        }
    };
    // search using datetime input and send as parameter in database
    useEffect(() => {
        getDataCheckInOut(dateTime);
    }, [dateTime]);

    useEffect(() => {
        getDataCheckInOut();
    }, []);
    return (
        <Box marginTop="80px">
            <Box width="100%">
                <Input
                    marginLeft="2%"
                    type="datetime-local"
                    width="40%"
                    marginBottom="20px"
                    value={dateTime}
                    bg={menuBg}
                    onChange={(e) => {
                        setDateTime(e.target.value);
                    }}
                />
                <Button
                    width="40%"
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
            </Box>
            <ColumnsTable
                columnsData={columnsDataColumns}
                loading={loading}
                tableData={tableDataColumns}
                onSearch={(searchValue) => {
                    filterCheckInOut(searchValue);
                }}
                nullTable={emptyLoading}
            />
        </Box>
    );
};

export default CheckInOut;
