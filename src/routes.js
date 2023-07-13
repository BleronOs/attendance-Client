import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdPerson,
  MdHome,
  MdLock,
  MdManageAccounts,
  MdViewAgenda,
  MdArchive,
  MdCheck,
  MdAccessibility,
  MdPersonAdd,
  MdCreditCard,
  MdWork
} from 'react-icons/md';
import MainDashboard from 'views/admin/default';
import Profile from 'views/admin/profile';

import DataTables from 'views/admin/dataTables';
import CheckInOut from 'views/admin/Check/CheckInOut';
import JobPosition from 'views/admin/JobPosition/JobPosition';
import Card from 'views/admin/Card/Card';
import Check from 'views/admin/Check/Check';
import Managers from 'views/admin/Managers/Manager';
import Employee from 'views/admin/Employee/Employee';
import EmployeeManagment from 'views/admin/EmployeeManagment/EmployeeManagment';
import ArchiveEmployee from 'views/admin/ArchiveEmployee/ArchiveEmployee';
import ArchiveManagers from 'views/admin/ArchiveManagers/ArchiveManagers';
import ArchiveCard from 'views/admin/ArchiveCard/ArchiveCard';
import SignInCentered from 'views/auth/signIn';
import regiserForm from 'views/admin/Register/register';
import ConfirmEmail from 'views/auth/confirmEmail/confirmEmail';

const routes = [
  {
    typeofNumber: 1,
    name: 'home',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
  {
    typeofNumber: 2,
    name: 'Employees',
    layout: '/admin',
    path: '/employee',
    icon: <Icon as={MdPersonAdd} width="20px" height="20px" color="inherit" />,
    component: Employee,
  },
  {
    typeofNumber: 3,
    name: 'Card',
    layout: '/admin',
    path: '/card',
    icon: <Icon as={MdCreditCard} width="20px" height="20px" color="inherit" />,
    component: Card,
  },
  {
    typeofNumber: 4,
    name: 'JobPosition',
    layout: '/admin',
    path: '/jobposition',
    icon: <Icon as={MdWork} width="20px" height="20px" color="inherit" />,
    component: JobPosition,
  },

  {
    typeofNumber: 5,
    name: 'Managers',
    layout: '/admin',
    path: '/mangers',
    icon: <Icon as={MdManageAccounts} width="20px" height="20px" color="inherit" />,
    component: Managers,
  },

  {
    typeofNumber: 6,
    name: 'EmployeeManagment',
    layout: '/admin',
    path: '/e-managment',
    icon: <Icon as={MdViewAgenda} width="20px" height="20px" color="inherit" />,
    component: EmployeeManagment,
  },
  {
    typeofNumber: 7,
    name: 'check',
    layout: '/admin',
    path: '/check',
    icon: <Icon as={MdCheck} width="20px" height="20px" color="inherit" />,
    component: Check,
  },
  {
    typeofNumber: 8,
    name: 'Check-in-out',
    layout: '/admin',
    path: '/first_last_checks',
    icon: <Icon as={MdCheck} width="20px" height="20px" color="inherit" />,
    component: CheckInOut,
  },

  {
    typeofNumber: 9,
    name: 'ArchiveEmployee',
    layout: '/admin',
    path: '/archiveemployee',
    icon: <Icon as={MdArchive} width="20px" height="20px" color="inherit" />,
    component: ArchiveEmployee,
  },
  {
    typeofNumber: 10,
    name: 'ArchiveManagers',
    layout: '/admin',
    path: '/archivemanagers',
    icon: <Icon as={MdArchive} width="20px" height="20px" color="inherit" />,
    component: ArchiveManagers,
  },
  {
    typeofNumber: 11,
    name: 'ArchiveCards',
    layout: '/admin',
    path: '/archivecards',
    icon: <Icon as={MdArchive} width="20px" height="20px" color="inherit" />,
    component: ArchiveCard,
  },
  {
    typeofNumber: 12,
    name: 'CheckLista',
    layout: '/admin',
    path: '/authorization',
    icon: <Icon as={MdAccessibility} width="20px" height="20px" color="inherit" />,
    component: DataTables,
  },
  {
    typeofNumber: 13,
    name: 'profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: Profile,
  },
  {
    typeofNumber: 13,
    name: 'SignIn',
    layout: '/auth',
    path: '/sign-in',
    hideOnSidebar: true,
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
  },
  {
    name: 'register',
    layout: '/admin',
    path: '/register-form',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: regiserForm,

  },
  {
    name: 'emailConfirm',
    layout: '/auth',
    path: '/email-confirm',
    hideOnSidebar: true,
    component: ConfirmEmail,
  }
];

export default routes;
