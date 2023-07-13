// Chakra imports
import {
  Box,
  // Button,
  Flex,
  // Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
// Custom components
import BarChart from 'components/charts/BarChart';
import React, { useEffect, useState } from 'react';
// import {
//   barChartDataConsumption,
//   barChartOptionsConsumption,
// } from 'variables/charts';
// import { MdBarChart } from 'react-icons/md';
import { getWeeklyStatistics, getWeeklyStatisticsByManager } from 'utils/api/Dashboard';
import { useTranslation } from 'react-i18next';
// import { getWeeklyStatistics } from 'utils/api/Dashboard';

export default function WeeklyRevenue(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  // const iconColor = useColorModeValue('brand.500', 'white');
  // const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  // const bgHover = useColorModeValue(
  // { bg: 'secondaryGray.400' },
  // { bg: 'whiteAlpha.50' }
  // );
  // const bgFocus = useColorModeValue(
  // { bg: 'secondaryGray.300' },
  // { bg: 'whiteAlpha.100' }
  // );

  const { t } = useTranslation();

  const [employees, setEmployees] = useState([]);
  const [passiveEmployee2, setPassiveEmployee] = useState([]);
  const [weeks, setWeeks] = useState([]);

  const role = JSON.parse(localStorage.getItem('access_role'))[0].roleId;
  const managerId = JSON.parse(localStorage.getItem('access_employee'));

  const getEmployees2 = async () => {
    try {
      const res = role == 1 ? await getWeeklyStatistics() : role == 2 ? await getWeeklyStatisticsByManager(managerId) : null;
      const data = res.data || [];
      const activeEmployee = data.map((item) => item.activeEmployee);
      const passiveEmployee = data.map((item) => item.passiveEmployee);
      const weekly = data.map((item) => item.dayOfWeeks);
      setEmployees(activeEmployee);
      setPassiveEmployee(passiveEmployee);
      setWeeks(weekly);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(async () => {
    getEmployees2();
  }, []);

  const data = [
    {
      name: 'Puntoret Aktive',
      data: employees
    },
    {
      name: 'Puntoret Pasive',
      data: passiveEmployee2,
    },
  ];

  const Options = {
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
        fontFamily: undefined,
      },
      onDatasetHover: {
        style: {
          fontSize: '12px',
          fontFamily: undefined,
        },
      },
      theme: 'dark',
    },
    xaxis: {
      categories: weeks,
      show: false,
      labels: {
        show: true,
        style: {
          colors: '#A3AED0',
          fontSize: '14px',
          fontWeight: '100',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      color: 'black',
      labels: {
        show: false,
        style: {
          colors: '#A3AED0',
          fontSize: '14px',
          fontWeight: '500',
        },
      },
    },

    grid: {
      borderColor: 'rgba(163, 174, 208, 0.3)',
      show: true,
      yaxis: {
        lines: {
          show: false,
          opacity: 0.5,
        },
      },
      row: {
        opacity: 0.5,
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      type: 'solid',
      colors: ['#5A9C3E', '#ff0000'],
    },
    legend: {
      show: false,
    },
    colors: ['#5A9C3E', '#ff0000'],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '20px',
      },
    },
  };
  return (
    <Card align="center" direction="column" w="100%" {...rest}>
      <Flex align="center" w="100%" px="15px" py="10px">
        <Text
          me="auto"
          color={textColor}
          fontSize="xl"
          fontWeight="700"
          lineHeight="100%"
        >
          {t('dashboard:text_employees_weekly')}
        </Text>
        {/* <Button
          align="center"
          justifyContent="center"
          bg={bgButton}
          _hover={bgHover}
          _focus={bgFocus}
          _active={bgFocus}
          w="37px"
          h="37px"
          lineHeight="100%"
          borderRadius="10px"
          {...rest}
        >
          <Icon as={MdBarChart} color={iconColor} w="24px" h="24px" />
        </Button> */}
      </Flex>
      <Box h="240px" mt="auto">
        {employees.length > 0 && passiveEmployee2.length > 0 && weeks.length > 0 && (
          <BarChart
            chartData={data}
            chartOptions={Options}
          />
        )}
      </Box>
    </Card>
  );
}
