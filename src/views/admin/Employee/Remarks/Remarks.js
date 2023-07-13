import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Flex,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { toast, ToastContainer } from 'react-toastify';
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import { AddIcon } from '@chakra-ui/icons';
import { FaFileExcel } from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import { getRemarks } from 'utils/api/Remarks';
import AddRemark from './AddRemarks';

const Remarks = ({
    openModal, closeModal, t, selectEmployee
}) => {
    const [employeeId, setEmployeeId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [remarksTable, setRemarksTable] = useState([]);
    const [tableDataColumns, setTableDataColumns] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isAddRemarkerOpen, setIsAddRemarkerOpen] = useState(false);

    const columnsDataColumns = [
        {
            Header: t('employee:text_header_employee_firstname'),
            accessor: 'employee.firstName',
        },
        {
            Header: t('employee:text_header_employee_lastname'),
            accessor: 'employee.lastName',
        },
        {
            Header: t('card:txt_modal_add_reason'),
            accessor: 'notes',
        },
        {
            Header: t('time:text_inserted_time'),
            accessor: 'insertedDateTime',
        },
    ];

    const headers = [
        { label: t('employee:text_header_employee_firstname'), key: 'employee.firstName' },
        { label: t('employee:text_header_employee_lastname'), key: 'employee.lastName' },
        { label: t('card:txt_modal_add_reason'), key: 'notes' },
        { label: t('time:text_inserted_time'), key: 'insertedDateTime' },
    ];

    // error notification
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
    useEffect(() => {
        if (!selectEmployee) return;
        setEmployeeId(selectEmployee.id);
        setFirstName(selectEmployee.firstName);
        setLastName(selectEmployee.lastName);
    }, [selectEmployee]);

    const [emptyLoading, setEmptyLoading] = useState('');
    const fetchRemarks = async (employeeId) => {
        try {
            const res = await getRemarks(employeeId);
            if (res.data.length) {
                setEmptyLoading('');
                setRemarksTable(res.data);
            } else {
                setRemarksTable([]);
                setEmptyLoading('Nuk Egziston asnje Verejtje per kete Puntor');
            }
        } catch (err) {
            showError(err, 'erro from back');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRemarks(employeeId);
    }, [employeeId]);

    // Filter
    useEffect(() => {
        if (!remarksTable) setTableDataColumns([]);
        setTableDataColumns(remarksTable);
    }, [remarksTable]);

    const filterRemarks = (searchValue) => {
        if (!searchValue) setTableDataColumns();

        const filteredEmployees = remarksTable.filter((data) => {
            const {
                employee, note
            } = data;
            return (
                employee.firstName.toLowerCase().includes(searchValue.toLowerCase())
                || employee.lastName.toLowerCase().includes(searchValue.toLowerCase())
                || note.toLowerCase().includes(searchValue.toLowerCase())
            );
        });
        setTableDataColumns(filteredEmployees);
    };
    return (
        <>
            <Modal isOpen={openModal} onClose={() => { closeModal(); setRemarksTable([]); }} size="6xl" colorScheme="brandScheme">
                <ModalOverlay />
                <ToastContainer />
                <ModalContent colorScheme="brandScheme">
                    <form>
                        <Card>
                            <ModalHeader>
                                {t('remarks:text_add_remarks_header')}
                            </ModalHeader>
                            <ModalCloseButton />
                            <Flex width="100%">
                                <Button
                                    leftIcon={<AddIcon />}
                                    width="40%"
                                    variant="brand"
                                    marginBottom="20px"
                                    background="teal"
                                    color="white"
                                    ml="5%"
                                    mr="5%"
                                    onClick={() => {
                                        setIsAddRemarkerOpen(true);
                                    }}
                                >
                                    {t('remarks:text_add_remarks_header')}
                                </Button>
                                <Button
                                    leftIcon={<FaFileExcel />}
                                    width="40%"
                                    variant="brand"
                                    marginBottom="20px"
                                    // background="#217346" Excel Color
                                    background="teal"
                                    color="white"
                                    ml="5%"

                                >
                                    <CSVLink data={tableDataColumns} headers={headers}>
                                        {t('excel:button_export_data')}
                                    </CSVLink>
                                </Button>
                            </Flex>
                            <ModalBody>
                                <ColumnsTable
                                    columnsData={columnsDataColumns}
                                    tableData={tableDataColumns}
                                    loading={loading}
                                    nullTable={emptyLoading}
                                    onSearch={filterRemarks}
                                />
                            </ModalBody>
                        </Card>
                    </form>
                </ModalContent>
            </Modal>
            <AddRemark
                id={employeeId}
                employeefirstName={firstName}
                employeelastName={lastName}
                isOpenModal={isAddRemarkerOpen}
                onCloseModal={() => {
                    setIsAddRemarkerOpen(false);
                }}
                reloadRemarks={(id) => fetchRemarks(id)}
                t={t}
            />
        </>
    );
};
export default Remarks;
