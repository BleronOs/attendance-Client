// Chakra imports
import {
  Box,
  // Button,
  Flex,
  Icon,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import LineChart from 'components/charts/LineChart';
import React, { useEffect, useState } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
// import { MdBarChart, MdOutlineCalendarToday } from 'react-icons/md';
// Assets
import { RiArrowUpSFill } from 'react-icons/ri';
import { getWeeklyTarger, getWeeklyTargerByManager, getWeeklyStatisticForAnEmployee } from 'utils/api/Dashboard';
import { useTranslation } from 'react-i18next';
// import {
//   lineChartOptionsTotalSpent,
// } from 'variables/charts';

const TotalSpent = (props) => {
  const { ...rest } = props;

  // Chakra Color Mode

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  // const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  // const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  // const iconColor = useColorModeValue('brand.500', 'white');
  // const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  // const bgHover = useColorModeValue(
  //   { bg: 'secondaryGray.400' },
  //   { bg: 'whiteAlpha.50' }
  // );
  // const bgFocus = useColorModeValue(
  //   { bg: 'secondaryGray.300' },
  //   { bg: 'whiteAlpha.100' }
  // );

  const { t } = useTranslation();

  const [target, setTarget] = useState([]);
  const [completedHours, setCompletedHours] = useState([]);
  const [days, setDays] = useState([]);

  const role = JSON.parse(localStorage.getItem('access_role'))[0].roleId;
  const managerId = JSON.parse(localStorage.getItem('access_employee'));

  const getWeeklyTargetOfHours = async () => {
    try {
      const res = role == 1 ? await getWeeklyTarger() : role == 2 ? await getWeeklyTargerByManager(managerId) : await getWeeklyStatisticForAnEmployee(managerId);
      const data = res.data || [];
      const getTarget = data.map((item) => item.targetHourse);
      const getCompletedHours = data.map((item) => item.completedHourse);
      const getDays = data.map((item) => item.dayOfWeeks);
      console.log(res.data, 'ssss');
      setTarget(getTarget);
      setCompletedHours(getCompletedHours);
      setDays(getDays);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWeeklyTargetOfHours();

    const data = ((((target[6] * 60) * 60) / (((Math.floor(completedHours[6]) * 60) + (completedHours[6] - Math.floor(completedHours[6]))) * 60))).toFixed(2);

    const number1 = ((target[6] * 60) * 60);
    const number2 = (((Math.floor(completedHours[6]) * 60) + ((completedHours[6] - Math.floor(completedHours[6])) * 100))) * 60;

    console.log(data, number1, number2, 'dasasassa');
  }, []);

  // Set Hours

  const dataOfWeeklyHours = [
    {
      name: 'Targeti',
      data: target
    },
    {
      name: 'Oret e Arritura',
      data: completedHours
    },
  ];

  // Options and Set Days
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: false,
        top: 13,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: '#4318FF',
      },
    },
    colors: ['#4318FF', '#39B8FF'],
    markers: {
      size: 0,
      colors: 'white',
      strokeColors: '#7551FF',
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: 'circle',
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      showNullDataPoints: true,
    },
    tooltip: {
      theme: 'light',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      type: 'line',
    },
    xaxis: {
      type: 'numeric',
      categories: days,
      labels: {
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
          fontWeight: '500',
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
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
      column: {
        color: ['#7551FF', '#39B8FF'],
        opacity: 0.5,
      },
    },
    color: ['#7551FF', '#39B8FF'],
  };
  return (
    <Card
      justifyContent="center"
      align="center"
      direction="column"
      w="100%"
      mb="0px"
      {...rest}
    >
      <Flex justify="space-between" ps="0px" pe="20px" pt="5px">
        {/* <Flex align="center" w="100%">
          <Button
            bg={boxBg}
            fontSize="sm"
            fontWeight="500"
            color={textColorSecondary}
            borderRadius="7px"
          >
            <Icon
              as={MdOutlineCalendarToday}
              color={textColorSecondary}
              me="4px"
            />
            This month
          </Button>
          <Button
            ms="auto"
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
          </Button>
        </Flex> */}
        <Flex align="center" w="100%">
          <Text
            marginLeft="1%"
            color={textColor}
            fontSize="25px"
            textAlign="start"
            fontWeight="600"
            lineHeight="100%"
          >
            {t('dashboard:text_weekly_hours_target')}
          </Text>
        </Flex>
      </Flex>
      <Flex w="100%" flexDirection={{ base: 'column', lg: 'row' }}>
        <Flex flexDirection="column" me="40px" mt="25px">
          <Text
            color={textColor}
            fontSize="19px"
            textAlign="start"
            fontWeight="600"
            lineHeight="100%"
            marginBottom="9%"
          >
            {t('dashboard:text_target_day')}
          </Text>
          <Text
            color={textColor}
            fontSize="34px"
            textAlign="start"
            fontWeight="700"
            lineHeight="100%"
            marginBottom="9%"
          >
            {target[6]}
          </Text>
          <Text
            color={textColor}
            fontSize="19px"
            textAlign="start"
            fontWeight="600"
            lineHeight="100%"
            marginBottom="9%"
          >
            {t('dashboard:text_done_hours_day')}
          </Text>
          <Text
            color={textColor}
            fontSize="34px"
            textAlign="start"
            fontWeight="700"
            lineHeight="100%"
          >
            {completedHours[6]}
          </Text>
          <Flex align="center" mb="20px">
            <Text
              color="secondaryGray.600"
              fontSize="sm"
              fontWeight="500"
              mt="12px"
              me="12px"
            >
              {t('dashboard:text_total_precentage')}
            </Text>
            <Flex align="center" mt="8px">
              <Icon as={RiArrowUpSFill} color="green.500" me="2px" mt="2px" />
              {target.length > 0 && completedHours.length > 0 && (
                <Text color="green.500" fontSize="sm" fontWeight="700">
                  {/* {(((target[6] * 60) * 60) / ((((Math.floor(completedHours[6]) * 60) + (completedHours[6] - Math.floor(completedHours[6]))) * 60) * 100)).toFixed(2)} */}

                  {
                    (((((Math.floor(completedHours[6]) * 60) + ((completedHours[6] - Math.floor(completedHours[6])) * 100)) * 60) / ((target[6] * 60) * 60)) * 100).toFixed(2)
                  }
                </Text>
              )}
            </Flex>
          </Flex>

          <Flex align="center">
            <Icon as={IoCheckmarkCircle} color="green.500" me="4px" />
            <Text color="green.500" fontSize="md" fontWeight="700">
              On track
            </Text>
          </Flex>
        </Flex>
        <Box minH="260px" minW="75%" ml={{ lg: '-35px', md: '0px' }} mt="auto">
          {target.length > 0 && completedHours.length > 0 && days.length > 0
            && (
              <LineChart
                chartData={dataOfWeeklyHours}
                chartOptions={options}
              />
            )}
        </Box>
      </Flex>
    </Card>
  );
};
export default TotalSpent;
