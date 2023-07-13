// Chakra imports
import {
  Box, Flex, Text, useColorModeValue
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import PieChart from 'components/charts/PieChart';
// import { pieChartOptions } from 'variables/charts';
import { VSeparator } from 'components/separator/Separator';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { getMonthlyStaisticForAnEmployee, getMonthlyTarget } from 'utils/api/Dashboard';

export default function Conversion(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardColor = useColorModeValue('white', 'navy.700');
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset'
  );

  const { t } = useTranslation();

  // const pieChartOptions = useMemo(() => ({ // nuk Funksionon
  const pieChartOptions = {
    labels: [t('dashboard:text_done_hours_monthly'), t('dashboard:text_monthly_target')],
    colors: ['#6AD2FF', '#4318FF', '#EFF4FB'],
    chart: {
      width: '50px',
    },
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    fill: {
      colors: ['#6AD2FF', '#4318FF', '#EFF4FB'],
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
    },
  };

  const role = JSON.parse(localStorage.getItem('access_role'))[0].roleId;
  const employeeId = JSON.parse(localStorage.getItem('access_employee'));

  const [monthlyHours, setMonthlyHours] = useState([]);
  const [totalHours, setTotalHours] = useState();
  const [calculatedHours, setCalculatedHours] = useState();
  const [remainingHours, setRemainingHours] = useState();
  const [date, setDate] = useState();

  const getMonthlyStatistics = async () => {
    try {
    const res = role == 1 ? await getMonthlyTarget() : role == 3 ? await getMonthlyStaisticForAnEmployee(employeeId) : null;

      const data = res.data || [];
      setMonthlyHours(data);

      const getTotalHours = data.map((item) => item.totalMonthlyHourse);
      setTotalHours(getTotalHours[0]);

      const getCalculatedHours = data.map((item) => item.totalCompletedHourse);
      setCalculatedHours(getCalculatedHours[0]);

      const getData = data.map((item) => item.dayOfMonth);
      setDate(getData[0]);

      const getRemainingHours = data.map((item) => item.remainingHours);
      const decimalPart = getRemainingHours[0] % 1;

      if (decimalPart.toFixed(1) === '0.6') {
        setRemainingHours(getRemainingHours[0] + 0.4);
      }
      setRemainingHours(getRemainingHours[0]);
    } catch (error) {
      console.log(error, 'error from back');
    }
  };

  useEffect(() => {
    getMonthlyStatistics();
  }, []);
  console.log(date);
  const data = [calculatedHours, remainingHours];

  return (
    <Card p="20px" align="center" direction="column" w="100%" {...rest}>
      <Flex
        px={{ base: '0px', '2xl': '10px' }}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        mb="8px"
      >
        <Text color={textColor} fontSize="md" fontWeight="600" mt="4px">
          {t('dashboard:text_monthly_target')}
        </Text>
        {/* <Select
          fontSize="sm"
          variant="subtle"
          defaultValue="monthly"
          width="unset"
          fontWeight="700"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </Select> */}
        <Text
          fontSize="md"
          width="unset"
          fontWeight="700"
          marginRight="2%"
        >
          {moment(date).format(
            'MM / YYYY'
          )}

        </Text>
      </Flex>

      {monthlyHours.length > 0 && totalHours != null && calculatedHours != null && remainingHours != null && (
        <PieChart
          h="100%"
          w="100%"
          chartData={data}
          chartOptions={pieChartOptions}
        />
      )}
      <Card
        bg={cardColor}
        flexDirection="row"
        boxShadow={cardShadow}
        w="100%"
        p="15px"
        px="20px"
        mt="15px"
        mx="auto"
      >
        <Flex direction="column" marginLeft="29%" py="5px">
          <Flex
            align="center"
          >
            <Box
              h="8px"
              w="8px"
              bg="brand.500"
              borderRadius="50%"
              me="4px"
            />
            <Text
              fontSize="xs"
              color="secondaryGray.600"
              fontWeight="700"
              mb="5px"
            >
              {t('dashboard:text_monthly_target')}
            </Text>
          </Flex>
          <Text fontSize="lg" color={textColor} fontWeight="700">
            {totalHours}
          </Text>
        </Flex>
        <VSeparator mx={{ base: '60px', xl: '60px', '2xl': '60px' }} />
        <Flex direction="column" py="5px" me="10px">
          <Flex align="center">
            <Box h="8px" w="8px" bg="#6AD2FF" borderRadius="50%" me="4px" />
            <Text
              fontSize="xs"
              color="secondaryGray.600"
              fontWeight="700"
              mb="5px"
            >
              {t('dashboard:text_done_hours_monthly')}
            </Text>
          </Flex>
          <Text fontSize="lg" color={textColor} fontWeight="700">
            {calculatedHours}
          </Text>
        </Flex>
      </Card>
    </Card>
  );
}
