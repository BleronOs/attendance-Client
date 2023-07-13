import {
    Flex,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    Button,
    Input,
    Box,
    Select
} from '@chakra-ui/react';
import React, { useMemo, useState, useEffect } from 'react';
import { useGlobalFilter, useSortBy, useTable } from 'react-table';
// Custom components
import Card from 'components/card/Card';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ThreeDots } from 'react-loader-spinner';
import i18n from 'i18n';
import {
    CheckCircleIcon, SmallCloseIcon, DeleteIcon, EditIcon,
    ViewIcon
} from '@chakra-ui/icons';

export default function ColumnsTable(props) {
    const {
        loading,
        columnsData,
        tableData,
        onSelectedForUpdate,
        onSelectedForDelete,
        onSelectedForRemarks,
        onSearch,
        nullTable
    } = props;

    const { t } = useTranslation();
    // const [searchValue, setSearchValue] = useState(null);
    const columns = useMemo(() => columnsData, [columnsData]);
    const data = useMemo(() => tableData, [tableData]);

    // usetranslation
    const tableInstance = useTable(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy
    );

    const {
        getTableProps, getTableBodyProps, headerGroups, prepareRow, rows
    } = tableInstance;

    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

    const [language, setLanguage] = useState(localStorage.getItem('language') || 'al');

    useEffect(() => {
        localStorage.setItem('language', language);
        i18n.changeLanguage(language);
    }, [language]);
    return (
        <>
            <Card
                direction="column"
                w="100%"
                px="0px"
                overflowX={{ sm: 'scroll', lg: 'scroll' }}
            >
                <Flex px="25px" justify="space-between" mb="20px" align="center">
                    <Input
                        type="text"
                        placeholder={t('employee:text_header_employee_search')}
                        // value={searchValue}
                        onChange={(e) => {
                            // setSearchValue(e.target.value);
                            onSearch(e.target.value);
                        }}
                        t={t}
                    />
                </Flex>
                {loading ? (
                    <Box
                        marginLeft="50%"
                        marginTop="10%"
                        marginBottom="10%"
                    >
                        <ThreeDots
                            height="80"
                            width="80"
                            radius="9"
                            color="teal"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClassName=""
                            visible
                        />

                    </Box>
                ) : (
                    <Table
                        {...getTableProps()}
                        variant="simple"
                        color="gray.500"
                        mb="24px"
                    >
                        <Thead>
                            {headerGroups.map((headerGroup, index) => (
                                <Tr
                                    {...headerGroup.getHeaderGroupProps()}
                                    key={index}
                                >
                                    {headerGroup.headers.map((column, index) => (
                                        <Th
                                            {...column.getHeaderProps(
                                                column.getSortByToggleProps()
                                            )}
                                            pe="10px"
                                            key={index}
                                            borderColor={borderColor}
                                        >
                                            <Flex
                                                justify="space-between"
                                                align="center"
                                                fontSize={{
                                                    sm: '10px',
                                                    lg: '12px',
                                                }}
                                                color="gray.400"
                                            >
                                                {column.render('Header')}
                                            </Flex>
                                        </Th>
                                    ))}
                                </Tr>
                            ))}
                        </Thead>
                        <Tbody {...getTableBodyProps()}>
                            {rows.map((row, index) => {
                                prepareRow(row);
                                return (
                                    <Tr {...row.getRowProps()} key={index}>
                                        {row.cells.map((cell, index) => {
                                            let data = '';
                                            if (cell.column.Header === 'NAME') {
                                                data = (
                                                    <Flex align="center">
                                                        <Text
                                                            color={textColor}
                                                            fontSize="sm"
                                                            fontWeight="700"
                                                        >
                                                            {cell.value}
                                                        </Text>
                                                    </Flex>
                                                );
                                            } else if (
                                                cell.column.Header === 'PROGRESS'
                                            ) {
                                                data = (
                                                    <Flex align="center">
                                                        <Text
                                                            me="10px"
                                                            color={textColor}
                                                            fontSize="sm"
                                                            fontWeight="700"
                                                        >
                                                            {cell.value}
                                                            %
                                                        </Text>
                                                    </Flex>
                                                );
                                            } else if (
                                                cell.column.Header === 'QUANTITY'
                                            ) {
                                                data = (
                                                    <Text
                                                        color={textColor}
                                                        fontSize="sm"
                                                        fontWeight="700"
                                                    >
                                                        {cell.value}
                                                    </Text>
                                                );
                                            } else if (
                                                cell.column.Header === t('profile:text_week_target')
                                            ) {
                                                data = (
                                                    <Text
                                                        color={textColor}
                                                        fontSize="sm"
                                                        fontWeight="700"
                                                    >
                                                        {cell.value}
                                                    </Text>
                                                );
                                            } else if (
                                                cell.column.Header === 'DATE'
                                            ) {
                                                data = (
                                                    <Text
                                                        color={textColor}
                                                        fontSize="sm"
                                                        fontWeight="700"
                                                    >
                                                        {cell.value}
                                                    </Text>
                                                );
                                            } else if (
                                                cell.column.Header
                                                === t(
                                                    'check_in_out:txt_tbl_first_check_date_time'
                                                )
                                                || cell.column.Header
                                                === t(
                                                    'check_in_out:txt_tbl_last_check_date_time'
                                                )
                                                || cell.column.Header
                                                === t(
                                                    'checks:txt_tbl_serverDateTime'
                                                )
                                            ) {
                                                data = (
                                                    <Text
                                                        color={textColor}
                                                        fontSize="sm"
                                                        fontWeight="700"
                                                    >
                                                        {moment(cell.value).format(
                                                            'YYYY-MM-DD , HH:mm:ss'
                                                        )}
                                                    </Text>
                                                );
                                            } else if (
                                                cell.column.Header
                                                === t('time:text_inserted_time')
                                            ) {
                                                data = (
                                                    <Text
                                                        color={textColor}
                                                        fontSize="sm"
                                                        fontWeight="700"
                                                    >
                                                        {moment(cell.value).format(
                                                            'DD-MM-YYYY, HH:mm:ss'
                                                        )}
                                                    </Text>
                                                );
                                            } else if (
                                                cell.column.Header
                                                === 'Datlindja'
                                            ) {
                                                data = (
                                                    <Text
                                                        color={textColor}
                                                        fontSize="sm"
                                                        fontWeight="700"
                                                    >
                                                        {moment(cell.value).format(
                                                            'DD-MM-YYYY'
                                                        )}
                                                    </Text>
                                                );
                                            } else if (
                                                cell.column.Header
                                                == t(
                                                    'employee_managment:text_employee_managment_actions'
                                                )
                                            ) {
                                                data = (
                                                    <Flex align="center">
                                                        <Button
                                                            leftIcon={<EditIcon />}
                                                            fontSize="sm"
                                                            fontWeight="500"
                                                            borderRadius="7px"
                                                            colorScheme="green"
                                                            marginRight="10px"
                                                            onClick={() => {
                                                                onSelectedForUpdate(
                                                                    cell.row
                                                                        .original
                                                                );
                                                            }}
                                                        >
                                                            {t(
                                                                'employee_managment:text_employee_managment_update'
                                                            )}
                                                        </Button>
                                                        <Button
                                                            leftIcon={<DeleteIcon />}
                                                            fontSize="sm"
                                                            fontWeight="500"
                                                            borderRadius="7px"
                                                            colorScheme="red"
                                                            marginRight="10px"
                                                            onClick={() => {
                                                                onSelectedForDelete(
                                                                    cell.row
                                                                        .original
                                                                );
                                                            }}
                                                        >
                                                            {t(
                                                                'employee_managment:text_employee_managment_delete'
                                                            )}
                                                        </Button>
                                                    </Flex>
                                                );
                                            } else if (
                                                cell.column.Header
                                                == t(
                                                    'employee_managment:text_employee_managment_options'
                                                )
                                            ) {
                                                data = (
                                                    <Flex align="center">
                                                        <Button
                                                            leftIcon={<EditIcon />}
                                                            fontSize="sm"
                                                            fontWeight="500"
                                                            borderRadius="7px"
                                                            colorScheme="green"
                                                            marginRight="10px"
                                                            onClick={() => {
                                                                onSelectedForUpdate(
                                                                    cell.row
                                                                        .original
                                                                );
                                                            }}
                                                        >
                                                            {t(
                                                                'employee_managment:text_employee_managment_update'
                                                            )}
                                                        </Button>
                                                        <Button
                                                            leftIcon={<DeleteIcon />}
                                                            fontSize="sm"
                                                            fontWeight="500"
                                                            borderRadius="7px"
                                                            colorScheme="red"
                                                            marginRight="10px"
                                                            onClick={() => {
                                                                onSelectedForDelete(
                                                                    cell.row
                                                                        .original
                                                                );
                                                            }}
                                                        >
                                                            {t(
                                                                'employee_managment:text_employee_managment_delete'
                                                            )}
                                                        </Button>
                                                        <Button
                                                            leftIcon={<ViewIcon />}
                                                            fontSize="sm"
                                                            fontWeight="500"
                                                            borderRadius="7px"
                                                            colorScheme="blue"
                                                            onClick={() => {
                                                                onSelectedForRemarks(
                                                                    cell.row
                                                                        .original
                                                                );
                                                            }}
                                                        >
                                                            {t(
                                                                'button:text_remarks'
                                                            )}
                                                        </Button>
                                                    </Flex>
                                                );
                                            } else if (
                                                cell.column.Header == 'actionsUpdate'

                                            ) {
                                                data = (
                                                    <Flex align="center">
                                                        <Button
                                                            fontSize="sm"
                                                            fontWeight="500"
                                                            borderRadius="7px"
                                                            colorScheme="green"
                                                            marginRight="10px"
                                                            onClick={() => {
                                                                onSelectedForUpdate(
                                                                    cell.row
                                                                        .original
                                                                );
                                                            }}
                                                        >
                                                            {t(
                                                                'employee_managment:text_employee_managment_update'
                                                            )}
                                                        </Button>
                                                        <Button
                                                            fontSize="sm"
                                                            fontWeight="500"
                                                            borderRadius="7px"
                                                            colorScheme="red"
                                                            onClick={() => {
                                                                onSelectedForUpdate(
                                                                    cell.row
                                                                        .original
                                                                );
                                                            }}
                                                        >
                                                            {t(
                                                                'employee_managment:text_employee_managment_delete'
                                                            )}
                                                        </Button>
                                                    </Flex>
                                                );
                                            } else if (
                                                cell.column.Header
                                                == t(
                                                    'archive_employee:text_header_button_update'
                                                )
                                            ) {
                                                data = (
                                                    <Flex align="center">
                                                        <Button
                                                            leftIcon={<EditIcon />}
                                                            fontSize="sm"
                                                            fontWeight="500"
                                                            borderRadius="7px"
                                                            colorScheme="green"
                                                            onClick={() => {
                                                                onSelectedForUpdate(
                                                                    cell.row
                                                                        .original
                                                                );
                                                            }}
                                                        >
                                                            {t(
                                                                'archive_employee:text_header_button_update'
                                                            )}
                                                        </Button>
                                                    </Flex>
                                                );
                                            } else if (
                                                cell.column.Header
                                                == t('archive_manager_update_modal:text_manager_button_name')
                                            ) {
                                                data = (
                                                    <Flex align="center">
                                                        <Button
                                                            fontSize="sm"
                                                            fontWeight="500"
                                                            borderRadius="7px"
                                                            colorScheme="green"
                                                            onClick={() => {
                                                                onSelectedForUpdate(
                                                                    cell.row
                                                                        .original
                                                                );
                                                            }}
                                                        >
                                                            {t('archive_manager_update_modal:text_manager_button_name')}
                                                        </Button>
                                                    </Flex>
                                                );
                                            } else if (
                                                cell.column.Header
                                                == t(
                                                    'employee:text_header_button_delete'
                                                )
                                            ) {
                                                data = (
                                                    <Flex align="center">
                                                        <Button
                                                            leftIcon={<DeleteIcon />}
                                                            fontSize="sm"
                                                            fontWeight="500"
                                                            borderRadius="7px"
                                                            colorScheme="red"
                                                            onClick={() => {
                                                                onSelectedForDelete(
                                                                    cell.row
                                                                        .original
                                                                );
                                                            }}
                                                        >
                                                            {t(
                                                                'employee:text_header_button_delete'
                                                            )}
                                                        </Button>
                                                    </Flex>
                                                );
                                            } else if (
                                                cell.column.Header
                                                == t('card:txt_activation_card')
                                            ) {
                                                data = (
                                                    <Flex align="center">
                                                        <Button
                                                            leftIcon={<EditIcon />}
                                                            fontSize="sm"
                                                            fontWeight="500"
                                                            borderRadius="7px"
                                                            colorScheme="green"
                                                            onClick={() => {
                                                                onSelectedForDelete(
                                                                    cell.row
                                                                        .original
                                                                );
                                                            }}
                                                        >
                                                            {t(
                                                                'card:txt_activation_card'
                                                            )}
                                                        </Button>
                                                    </Flex>
                                                );
                                            } else if (
                                                cell.column.Header
                                                == t('card:txt_tbl_status')
                                            ) {
                                                data = (
                                                    <Flex align="center">
                                                        <Text
                                                            color={textColor}
                                                            fontSize="sm"
                                                            fontWeight="700"
                                                        >
                                                            {cell.value == true
                                                                // ? t(
                                                                //     'employee:text_header_status_active_result'
                                                                // )
                                                                ? (
                                                                    <CheckCircleIcon
                                                                        marginLeft="50%"
                                                                        color="green"
                                                                        fontSize="180%"
                                                                    />
                                                                )
                                                                : (
                                                                    <Box>
                                                                        <SmallCloseIcon
                                                                            borderRadius="50%"
                                                                            marginLeft="50%"
                                                                            backgroundColor="red"
                                                                            color="white"
                                                                            fontSize="180%"
                                                                        />
                                                                    </Box>
                                                                )}
                                                        </Text>
                                                    </Flex>
                                                );
                                            } else {
                                                data = (
                                                    <Flex align="center">
                                                        <Text
                                                            color={textColor}
                                                            fontSize="sm"
                                                            fontWeight="700"
                                                        >
                                                            {cell.value}
                                                        </Text>
                                                    </Flex>
                                                );
                                            }
                                            return (
                                                <Td
                                                    {...cell.getCellProps()}
                                                    key={index}
                                                    fontSize={{ sm: '14px' }}
                                                    minW={{
                                                        sm: '150px',
                                                        md: '200px',
                                                        lg: 'auto',
                                                    }}
                                                    borderColor="transparent"
                                                >
                                                    {data}
                                                </Td>
                                            );
                                        })}
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>

                )}
                <Box
                    marginLeft="40%"
                    marginTop="1%"
                    marginBottom="1%"
                >
                    {' '}
                    {nullTable}
                    {' '}
                </Box>
            </Card>
            <Box justifyContent="flex-end">
                <div style={{
                    position: 'fixed', bottom: '2%', alignSelf: 'flex-end', right: '2%'
                }}
                >
                    <Flex>
                        <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                            <option value="al">AL</option>
                            <option value="en">EN</option>
                        </Select>
                    </Flex>
                </div>
            </Box>
        </>
    );
}
