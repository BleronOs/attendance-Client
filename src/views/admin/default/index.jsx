/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _|
 | |_| | | | | |_) || |  / / | | |  \| | | | | || |
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|

=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
  // Avatar,
  Box,
  Flex,
  // FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
// Assets
// import Usa from 'assets/img/dashboards/usa.png';
// Custom components
// import MiniCalendar from 'components/calendar/MiniCalendar';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import React, { useEffect, useState } from 'react';
import i18n from 'i18n';
import {
  // MdAddTask,
  MdOutlinePersonAddAlt,
  // MdFileCopy,
  // MdOutlinePeople,
  MdOutlinePersonOff,
  MdPeopleAlt,
  MdPersonOff,
  MdPersonAddAlt1
} from 'react-icons/md';
import { IoPeopleOutline } from 'react-icons/io5';
import ComplexTable from 'views/admin/default/components/ComplexTable';
// import DailyTraffic from 'views/admin/default/components/DailyTraffic';
import PieCard from 'views/admin/default/components/PieCard';
// import Tasks from 'views/admin/default/components/Tasks';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
// import {
// columnsDataCheck,
//   columnsDataComplex,
// } from 'views/admin/default/variables/columnsData';
import { FaRegIdCard, FaRegCreditCard } from 'react-icons/fa';
// import tableDataCheck from 'views/admin/default/variables/tableDataCheck';
// import tableDataComplex from 'views/admin/default/variables/tableDataComplex';
import { getEmployee, getEmployeeWithStatusActive } from 'utils/api/employee';
import { getEmployeeWithStatusPassive } from 'utils/api/ArchiveEmployee';
import { getCardsWithStatusTrue, getCardWithStatusFalse } from 'utils/api/Card';
import { getManagersWithStatusActive } from 'utils/api/Manager';
import { getManagersWithStatusPassive } from 'utils/api/ArchiveManagers';
import { useTranslation } from 'react-i18next';
import {
   getEmployeesManagments, getPassiveEmployeesManagments, getPassiveCardsManagments, getTrueCardsManagments
  } from 'utils/api/Dashboard';
import { getChecks, getChecksByEmployeeId, getEmployeeChecksByEmployeeId } from 'utils/api/Check';
// import { getTrueCardsManagments } from 'utils/api/Dashboard';
// import { getRoleModuleActive } from 'utils/api/Modules';
// import Sidebar from 'components/sidebar/Sidebar';

const UserReports = () => {
  // Chakra Color Mode
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const { t } = useTranslation();

  const [language, setLanguage] = useState(localStorage.getItem('language') || 'al');

  useEffect(() => {
    localStorage.setItem('language', language);
    i18n.changeLanguage(language);
  }, [language]);

  const role = JSON.parse(localStorage.getItem('access_role'))[0].roleId;

  const [employee, setEmployee] = useState();
  const [employeeActive, setEmployeeActive] = useState();
  const [employeePasive, setEmployeePasive] = useState();

  const getEmployees = async () => {
    const employee = await getEmployee();
    const employeeActive = await getEmployeeWithStatusActive();
    const employeePassive = await getEmployeeWithStatusPassive();
    setEmployee(employee.data.length);
    setEmployeeActive(employeeActive.data.length);
    setEmployeePasive(employeePassive.data.length);
  };

  const [cardActive, setCardActive] = useState();
  const [cardPassive, setCardPassive] = useState();
  const [cards, setCards] = useState(0);
  const getCards = async () => {
    const cardsActive = await getCardsWithStatusTrue();
    const cardsPassive = await getCardWithStatusFalse();
    setCardActive(cardsActive.data.length);
    setCardPassive(cardsPassive.data.length);
  };
  useEffect(() => {
    const totalCards = cardActive + cardPassive;
    setCards(totalCards);
  }, [cardActive, cardPassive]);

  const [managerActive, setManagerActive] = useState();
  const [managerPassive, setMAnagerPassive] = useState();
  const [managers, setManagers] = useState(0);

  const getManagers = async () => {
    const managersActive = await getManagersWithStatusActive();
    const managersPassive = await getManagersWithStatusPassive();
    setManagerActive(managersActive.data.length);
    setMAnagerPassive(managersPassive.data.length);
  };
  useEffect(() => {
    const totalManagers = managerActive + managerPassive;
    setManagers(totalManagers);
  }, [managerActive, managerPassive]);

  // employee in managment

  const managerId = JSON.parse(localStorage.getItem('access_employee'));

  const [employeeManagment, setEmployeeManagment] = useState(0);
  const [passiveEmployeeManagment, setPassiveEmployeeManagment] = useState(0);
  const [activeEmployeesManagment, setActiveEmployeesManagment] = useState(0);

  const getEmployeesInManagment = async () => {
    const employeesByManagerId = await getEmployeesManagments(managerId);
    const passiveEmployeesByManagerId = await getPassiveEmployeesManagments(managerId);

    setEmployeeManagment(employeesByManagerId.data);
    setPassiveEmployeeManagment(passiveEmployeesByManagerId.data);
  };

  const [passiveCards, setPassiveCards] = useState(0);
  const [activeCards, setActiveCards] = useState(0);
  const [totalCards, setTotalCards] = useState(0);

  const getCardsByManagerId = async () => {
    const passiveCardsEmployees = await getPassiveCardsManagments(managerId);
    const activeCardsEmployees = await getTrueCardsManagments(managerId);
    setPassiveCards(passiveCardsEmployees.data);
    setActiveCards(activeCardsEmployees.data);
  };

  useEffect(() => {
    getEmployeesInManagment();
    const activeEmployeesByManagerId = employeeManagment - passiveEmployeeManagment;
    setActiveEmployeesManagment(activeEmployeesByManagerId);
  }, [employeeManagment, passiveEmployeeManagment]);

  useEffect(() => {
    getCardsByManagerId();
    const totCards = passiveCards + activeCards;
    console.log(totCards, activeCards, passiveCards, 'ssss');
    setTotalCards(totCards);
  }, [passiveCards, activeCards]);

  // get Check to table
  const columnsDataColumns = [
    {
      Header: t('checks:txt_tbl_firstname'),
      accessor: 'card.employee.firstName'
    },
    {
      Header: t('checks:txt_tbl_lastname'),
      accessor: 'card.employee.lastName'
    },
    {
      Header: t('checks:txt_tbl_card'),
      accessor: 'card.cardRefId'
    },
    {
      Header: t('checks:txt_tbl_checkDateTime'),
      accessor: 'checkDateTime'
    },
    {
      Header: t('checks:txt_tbl_serverDateTime'),
      accessor: 'serverDateTime'
    },
  ];

  const [checkTable, setCheckTable] = useState([]);

  const getCheck = async () => {
    try {
      const res = role == 1 ? await getChecks() : role == 2 ? await getChecksByEmployeeId(managerId) : await getEmployeeChecksByEmployeeId(managerId);
      const data = res.data || [];
      setCheckTable(data);
    } catch (error) {
      console.log(error, 'error from back');
    }
  };

  useEffect(() => {
    getManagers();
    getCards();
    getEmployees();
    getCheck();
  }, []);

  return (
    /* eslint-disable */
    <>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
          columns={
            role == 1 ? { base: 1, md: 2, lg: 3, '2xl': 6 } :
            role == 2 ? { base: 1, md: 2, lg: 3, '2xl': 3 } :
            null
          }
          gap="20px"
          mb="20px"
        >
       {role == 1 || role == 2 ? (
        <>
          <MiniStatistics
            startContent={(
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={IoPeopleOutline} color={brandColor} />
                }
              />
            )}
            name={t('dashboard:text_employees')}
            value={role == 1 ? employee : role == 2 ? employeeManagment : null}
          />
          <MiniStatistics
            startContent={(
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdOutlinePersonAddAlt} color="green" />
                }
              />
            )}
            name={t('dashboard:text_employees_active')}
            value={role == 1 ? employeeActive : role == 2 ? activeEmployeesManagment : null}
          />
          <MiniStatistics
            startContent={(
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdOutlinePersonOff} color="red.700" />
                }
              />
            )}
            name={t('dashboard:text_employees_pasive')}
            value={role == 1 ? employeePasive : role == 2 ? passiveEmployeeManagment : null}
          />
   </>
    ) : null}
    {role == 1 ? (
      <>
          <MiniStatistics
            startContent={(
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdPeopleAlt} color={brandColor} />
                }
              />
            )}
            name={t('dashboard:text_managers')}
            value={role == 1 ? managers : null}
          />
          <MiniStatistics
            startContent={(
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdPersonAddAlt1} color="green" />
                }
              />
            )}
            name={t('dashboard:text_managers_active')}
            value={role == 1 ? managerActive : null}
          />
          <MiniStatistics
            startContent={(
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdPersonOff} color="red.700" />
                }
              />
            )}
            name={t('dashboard:text_managers_pasive')}
            value={role == 1 ? managerPassive : null}
          />
        </>
          ):null}
          {/* <MiniStatistics growth="+23%" name="Sales" value="$574.34" /> */}
        </SimpleGrid>

        { role == 1 || role == 2 ?(
         <>
        <SimpleGrid
          columns={{
            base: 1, md: 2, lg: 3, '2xl': 3
          }}
          gap="20px"
          mb="20px"
        >
          <MiniStatistics
            startContent={(
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={FaRegIdCard} color={brandColor} />
                }
              />
            )}
            name={t('dashboard:text_cards')}
            value={role == 1 ? cards : role == 2 ? totalCards : null}
          />
          <MiniStatistics
            startContent={(
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={FaRegCreditCard} color="green" />
                }
              />
            )}
            name={t('dashboard:text_cards_active')}
            value={role == 1 ? (cards - cardPassive) : role == 2 ? activeCards : null}
          />
          <MiniStatistics
            startContent={(
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={FaRegCreditCard} color="red.700" />
                }
              />
            )}
            name={t('dashboard:text_cards_pasive')}
            value={role == 1 ? cardPassive : role == 2 ? passiveCards : null}
          />

        </SimpleGrid>
        </>
        ) : null}

          <SimpleGrid columns={role == 1 || role == 2 ? { base: 1, md: 2, xl: 2 } : { base: 1, md: 2, xl: 1 }} gap="20px" mb="20px">
            <TotalSpent />
        {role == 1 || role == 2 ? (
            <WeeklyRevenue />
            ) : null}
          </SimpleGrid>
        <SimpleGrid columns={role == 2 ? { base: 1, md: 1, xl: 1 } : { base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
          {checkTable.length > 0 && (
            <ComplexTable
              columnsData={columnsDataColumns}
              tableData={checkTable}
            />
          )}
          {role == 1 || role == 3? (
            <PieCard />
          ) : null}
        </SimpleGrid>
      </Box>
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
};

export default UserReports;
