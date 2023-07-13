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
  Box, Grid, SimpleGrid
} from '@chakra-ui/react';
// Custom components
import Banner from 'views/admin/profile/components/Banner';
import Storage from 'views/admin/profile/components/Storage';
// import { getChecksToday, getChecksTodayByEmployeeId, getEmployeeChecksTodayByEmployeeId } from 'utils/api/Check';
// Assets
import banner from 'assets/img/auth/banner.png';
import React, { useEffect, useState } from 'react';
import { getWeeklyTargetBaseOnEmployee } from 'utils/api/Profile';

import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { getRemarks } from 'utils/api/Remarks';
import { getEvideceForEachWeekOfMonth } from 'utils/api/Dashboard';
import RemarksTableData from './components/RemarksTable';

export default function Overview() {
  const [items, setItems] = useState([]);
  const [remarksTable, setRemarksTable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const item = JSON.parse(localStorage.getItem('access_data'));
    if (item) {
      setItems(item);
    }
  }, []);
  const { t } = useTranslation();

  const columnsDataColumns = [
    {
      Header: t('table_profile:text_done_week_hours'),
      accessor: 'doneHours'
    },
    {
      Header: t('table_profile:text_week_target'),
      accessor: 'weekTarget'
    },
    {
      Header: t('table_profile:text_Weeks'),
    },
    {
      Header: 'Status',
      accessor: 'status'
    }

  ];

  const employeeId = JSON.parse(localStorage.getItem('access_employee'));
  const [targetWeekly, setTargetWeekly] = useState();
  const [completedWeeklyHours, setCompletedWeeklyHours] = useState();

  const getDataWeekly = async () => {
    const res = await getWeeklyTargetBaseOnEmployee(employeeId);
    console.log(res.data, 'dsadassad');

    const getCompletedHours = res.data.map((item) => item.completedHoursPerDay);
    setCompletedWeeklyHours(getCompletedHours);
    const getTargetWeekly = res.data.map((item) => item.totalHoursPerDay);
    setTargetWeekly(getTargetWeekly);
  };
  useEffect(() => {
    getDataWeekly();
    console.log(completedWeeklyHours, targetWeekly, 'dsadassad');
  }, []);

  const headerOfRemarks = [
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

  const [emptyLoading, setEmptyLoading] = useState('');
  const fetchRemarks = async (employeeId) => {
    setLoading(true);
    try {
      const res = await getRemarks(employeeId);
      if (res.data.length) {
        setEmptyLoading('');
        setRemarksTable(res.data);
        console.log(
          res.data,
          'dsdaasds'
        );
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

  const [DataWeeksOfMonth, setDataWeeksOfMonth] = useState([]);

  const getWeekOfCurrentMonth = async () => {
    const res = await getEvideceForEachWeekOfMonth(employeeId);
    setDataWeeksOfMonth(res.data);
  };
  useEffect(() => {
    getWeekOfCurrentMonth();
  }, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <ToastContainer />
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: '1fr',
          lg: '1.34fr 1.34fr',
        }}
        templateRows={{
          base: 'repeat(1, 1fr)',
          lg: '1fr',
        }}
        gap={{ base: '50px', xl: '20px' }}
      >
        {completedWeeklyHours != null && targetWeekly != null && (
          <Banner
            banner={banner}
            name={`${items.firstName} ${items.lastName}`}
            // job={`${items.}`}
            completed_hours={completedWeeklyHours}
            total_hours={targetWeekly}
          />
        )}
        <Storage
          gridArea={{ base: '2 / 1 / 3 / 2', lg: '3 / 2 / 2 / 3' }}
          used={completedWeeklyHours}
          total={targetWeekly}

        />

      </Grid>
      <SimpleGrid
        columns={{
          base: 1, md: 1, xl: 1
        }}
        gap="20px"
        mb="20px"
      >
        <RemarksTableData
          columnsData={columnsDataColumns}
          tableData={DataWeeksOfMonth}
          loading={loading}
          titleWeekly
        />

        <RemarksTableData
          columnsData={headerOfRemarks}
          tableData={remarksTable}
          nullTable={emptyLoading}
          loading={loading}
          titleRemarks
        />
      </SimpleGrid>

    </Box>
  );
}
