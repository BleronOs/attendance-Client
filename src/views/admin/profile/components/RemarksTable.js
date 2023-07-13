import {
    Flex,
    Table,
    Progress,
    Icon,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    Box
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import {
    useGlobalFilter,
    usePagination,
    useSortBy,
    useTable,
} from 'react-table';

// Custom components
import Card from 'components/card/Card';
// import Menu from 'components/menu/MainMenu';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { ThreeDots } from 'react-loader-spinner';

// Assets
import { MdCheckCircle, MdCancel, MdOutlineError } from 'react-icons/md';
import {
    CheckCircleIcon, SmallCloseIcon
} from '@chakra-ui/icons';

const RemarksTableData = ({
    columnsData, tableData, nullTable, loading,
    titleWeekly, titleRemarks
}) => {
    const columns = useMemo(() => columnsData, [columnsData]);
    const data = useMemo(() => tableData, [tableData]);

    const { t } = useTranslation();

    const tableInstance = useTable(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        initialState,
    } = tableInstance;
    initialState.pageSize = 6;
    let i = 1;

    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    return (
        <Card
            direction="column"
            w="100%"
            px="0px"
            overflowX={{ sm: 'scroll', lg: 'hidden' }}
        >
            {titleRemarks == true && (
                <Flex px="25px" justify="space-between" mb="10px" align="center">
                    <Text
                        color={textColor}
                        fontSize="22px"
                        fontWeight="700"
                        lineHeight="100%"
                        mt="0.5%"
                    >
                        {t('button:text_remarks')}
                    </Text>
                </Flex>
            )}
            {titleWeekly == true && (
                <Flex px="25px" justify="space-between" mb="10px" align="center">
                    <Text
                        color={textColor}
                        fontSize="22px"
                        fontWeight="700"
                        lineHeight="100%"
                        mt="0.5%"
                    >
                        {t('table_profile:text_week_target')}
                    </Text>
                </Flex>
            )}
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
                <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
                    <Thead>
                        {headerGroups.map((headerGroup, index) => (
                            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                                {headerGroup.headers.map((column, index) => (
                                    <Th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        pe="10px"
                                        key={index}
                                        borderColor={borderColor}
                                    >
                                        <Flex
                                            justify="space-between"
                                            align="center"
                                            fontSize={{ sm: '10px', lg: '12px' }}
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
                        {page.map((row, index) => {
                            prepareRow(row);
                            return (
                                <Tr {...row.getRowProps()} key={index}>
                                    {row.cells.map((cell, index) => {
                                        let data = '';
                                        if (cell.column.Header === 'NAME') {
                                            data = (
                                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                                    {cell.value}
                                                </Text>
                                            );
                                        } else if (cell.column.Header === 'STATUS') {
                                            data = (
                                                <Flex align="center">
                                                    <Icon
                                                        w="24px"
                                                        h="24px"
                                                        me="5px"
                                                        color={
                                                            cell.value === 'Approved'
                                                                ? 'green.500'
                                                                : cell.value === 'Disable'
                                                                    ? 'red.500'
                                                                    : cell.value === 'Error'
                                                                        ? 'orange.500'
                                                                        : null
                                                        }
                                                        as={
                                                            cell.value === 'Approved'
                                                                ? MdCheckCircle
                                                                : cell.value === 'Disable'
                                                                    ? MdCancel
                                                                    : cell.value === 'Error'
                                                                        ? MdOutlineError
                                                                        : null
                                                        }

                                                    />
                                                    <Text color={textColor} fontSize="sm" fontWeight="700">
                                                        {cell.value}
                                                    </Text>
                                                </Flex>
                                            );
                                        } else if (cell.column.Header === t('employee:text_header_employee_firstname')) {
                                            data = (
                                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                                    {cell.value}
                                                </Text>
                                            );
                                        } else if (cell.column.Header === t('employee:text_header_employee_lastname')) {
                                            data = (
                                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                                    {cell.value}
                                                </Text>
                                            );
                                        } else if (cell.column.Header === t('card:txt_modal_add_reason')) {
                                            data = (
                                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                                    {cell.value}
                                                </Text>
                                            );
                                        } else if (cell.column.Header === t('time:text_inserted_time')) {
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
                                        } else if (cell.column.Header === 'PROGRESS') {
                                            data = (
                                                <Flex align="center">
                                                    <Progress
                                                        variant="table"
                                                        colorScheme="brandScheme"
                                                        h="8px"
                                                        w="108px"
                                                        value={cell.value}
                                                    />
                                                </Flex>
                                            );
                                        } else if (
                                            cell.column.Header === t('table_profile:text_Weeks')
                                        ) {
                                            data = (
                                                <Text
                                                    color={textColor}
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                >
                                                    {`${t('table_profile:text_Weeks')}    ${i++}`}
                                                </Text>
                                            );
                                        } else if (
                                            cell.column.Header === 'Status'
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
                                                maxH="30px !important"
                                                py="8px"
                                                minW={{ sm: '150px', md: '200px', lg: 'auto' }}
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
    );
};
export default RemarksTableData;
