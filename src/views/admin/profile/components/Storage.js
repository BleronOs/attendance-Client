// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Progress,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import IconBox from 'components/icons/IconBox';
import { React, useState, useEffect } from 'react';
import { getMonthlyTargetBaseOnEmployeeId } from 'utils/api/Profile';
// Assets
import { MdOutlineCloudDone } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

export default function Banner() {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const textColorSecondary = 'gray.400';
  const box = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const { t } = useTranslation();

  const employeeId = JSON.parse(localStorage.getItem('access_employee'));
  const [targetHours, setTargetMonthly] = useState([]);
  const [completedHours, setCompletedMonthlyHours] = useState([]);

  const getDataMonthly = async () => {
    const res = await getMonthlyTargetBaseOnEmployeeId(employeeId);

    const getCompletedHours = res.data.map((item) => item.completedHours);
    setCompletedMonthlyHours(getCompletedHours);
    const getTargetMonthly = res.data.map((item) => item.targetHours);
    setTargetMonthly(getTargetMonthly);
  };
  useEffect(() => {
    getDataMonthly();
  }, []);
  return (
    <Card mb={{ base: '0px', lg: '20px' }} align="center">

      <IconBox
        mx="auto"
        h="100px"
        w="100px"
        icon={
          <Icon as={MdOutlineCloudDone} color={brandColor} h="46px" w="46px" />
        }
        bg={box}
      />
      <Text color={textColorPrimary} fontWeight="bold" fontSize="2xl" mt="10px">
        {t('profile:text_completed_hours')}
      </Text>
      <Text
        color={textColorSecondary}
        fontSize="md"
        maxW={{ base: '100%', xl: '80%', '3xl': '60%' }}
        mx="auto"
      >
        {t('profile:text_description')}
      </Text>
      {completedHours != null && targetHours != null && (
      <Box w="100%" mt="auto">
        <Flex w="100%" justify="space-between" mb="10px">
          <Text color={textColorSecondary} fontSize="sm" maxW="40%">
            {completedHours}

{' '}
H
          </Text>
          <Text color={textColorSecondary} fontSize="sm" maxW="40%">
            {targetHours}
{' '}
H
          </Text>
        </Flex>
        <Progress
          align="start"
          colorScheme="brandScheme"
          value={(completedHours / targetHours) * 100}
          w="100%"
        />
      </Box>
        )}
    </Card>
  );
}
