import React, { useEffect, useState } from 'react';

// chakra imports
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import Content from 'components/sidebar/components/Content';
import {
  renderThumb,
  renderTrack,
  renderView,
} from 'components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import PropTypes from 'prop-types';

// Assets
import { IoMenuOutline } from 'react-icons/io5';
import { getRoleModuleActive } from 'utils/api/Modules';

const Sidebar = (props) => {
  const { routes } = props;
  const variantChange = '0.2s linear';
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'unset'
  );
  // Chakra Color Mode
  const sidebarBg = useColorModeValue('white', 'navy.800');
  const sidebarMargins = '0px';

  // Get RoleId from localStorage
  const [role, setRole] = useState();
  const getUserFromLocalStoragee = () => {
    const item = JSON.parse(localStorage.getItem('access_role'));
    if (item) {
      setRole(item[0].roleId);
    }
  };
  useEffect(async () => {
    await getUserFromLocalStoragee();
  }, []);

  // getModuleAccess

  const [roleModule, setRoleModule] = useState([]);
  const [waitForAccess, setWaitForAccess] = useState(true);

  const getModuleAccess = async (roleId) => {
    try {
      const res = await getRoleModuleActive(roleId);
      setRoleModule(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setWaitForAccess(false);
    }
  };

  // checks access
  const checkAccess = (moduleId) => {
    const moduleAccess = roleModule.filter((r) => r.moduleId == moduleId);

    if (moduleAccess && moduleAccess.length) {
      return moduleAccess[0].hasAccess;
    }
    return false;
  };

  useEffect(async () => {
    if (!role) return;
    await getModuleAccess(role);
  }, [role]);
  // SIDEBAR
  return (
    <Box display={{ sm: 'none', xl: 'block' }} position="fixed" minH="100%">
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w="300px"
        h="100vh"
        m={sidebarMargins}
        minH="100%"
        overflowX="hidden"
        boxShadow={shadow}
      >
        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
        >
          {!waitForAccess && <Content routes={routes.filter((route) => !route.hideOnSidebar && checkAccess(route.typeofNumber))} />}
        </Scrollbars>
      </Box>
    </Box>
  );
};

// FUNCTIONS
export const SidebarResponsive = (props) => {
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  const menuColor = useColorModeValue('gray.400', 'white');
  // // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const { routes } = props;
  // let isWindows = navigator.platform.startsWith("Win");
  //  BRAND
  // Get RoleId from localStorage
  const [role, setRole] = useState();
  const getUserFromLocalStoragee = () => {
    const item = JSON.parse(localStorage.getItem('access_role'));
    if (item) {
      setRole(item[0].roleId);
    }
  };
  useEffect(async () => {
    await getUserFromLocalStoragee();
  }, []);

  // getModuleAccess

  const [roleModule, setRoleModule] = useState([]);
  const [waitForAccess, setWaitForAccess] = useState(true);

  const getModuleAccess = async (roleId) => {
    try {
      const res = await getRoleModuleActive(roleId);
      setRoleModule(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setWaitForAccess(false);
    }
  };

  // checks access
  const checkAccess = (moduleId) => {
    const moduleAccess = roleModule.filter((r) => r.moduleId == moduleId);

    if (moduleAccess && moduleAccess.length) {
      return moduleAccess[0].hasAccess;
    }
    return false;
  };

  useEffect(async () => {
    if (!role) return;
    await getModuleAccess(role);
  }, [role]);

  return (
    <Flex display={{ sm: 'flex', xl: 'none' }} alignItems="center">
      <Flex ref={btnRef} w="max-content" h="max-content" onClick={onOpen}>
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          my="auto"
          w="20px"
          h="20px"
          me="10px"
          _hover={{ cursor: 'pointer' }}
        />
      </Flex>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={document.documentElement.dir === 'rtl' ? 'right' : 'left'}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent w="285px" maxW="285px" bg={sidebarBackgroundColor}>
          <DrawerCloseButton
            zIndex="3"
            onClose={onClose}
            _focus={{ boxShadow: 'none' }}
            _hover={{ boxShadow: 'none' }}
          />
          <DrawerBody maxW="285px" px="0rem" pb="0">
            <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            >
              {!waitForAccess && <Content routes={routes.filter((route) => !route.hideOnSidebar && checkAccess(route.typeofNumber))} />}
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};
// PROPS

Sidebar.propTypes = {
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  variant: PropTypes.string,
};

export default Sidebar;
