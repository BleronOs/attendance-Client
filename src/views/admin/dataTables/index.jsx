// Chakra imports
import {
  Checkbox, Flex, Table, Tbody, Td, Th, Thead, Tr, useColorModeValue, Box, Button
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { getModules, getModulesAcces, getModulesStatus } from 'utils/api/Modules';
import { getRole } from 'utils/api/Account';
import Card from 'components/card/Card';
import { AddIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import AddRole from './AddRole';

export default function Settings() {
  const [columnsData, setColumnsData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [modulesStatus, setModulesStatus] = useState([]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const { t } = useTranslation();
  // color
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const filterModule = (data) => data.filter((item) => item.id !== 13 && item.id !== 12);
  const fetchdata = async () => {
    try {
      const res = await getModules();
      console.log(res.data);
      setColumnsData(filterModule(res.data));
    } catch (error) {
      console.log(error, 'error from back');
    }
  };
  const fetchRole = async () => {
    try {
      const res = await getRole();
      setRoleData(res.data);
    } catch (error) {
      console.log(error, 'error from back');
    }
  };
  const fetchModulesStatus = async () => {
    try {
      const res = await getModulesStatus();
      setModulesStatus(res.data);
    } catch (error) {
      console.log(error, 'error from back');
    }
  };
  const getDefaultStatus = (roleId, moduleId) => {
    const foundedModuleStatus = modulesStatus.filter((ms) => ms.roleId == roleId && ms.moduleId == moduleId);

    if (foundedModuleStatus.length > 0) {
      return foundedModuleStatus[0].hasAccess;
    }

    return false;
  };
  const updateModuleAccessStatus = async (roleId, moduleId) => {
    getModulesAcces(roleId, moduleId)
      .then()
      .catch((err) => console.log(err, 'error from backend'));
  };
  useEffect(async () => {
    await fetchModulesStatus();
    await fetchdata();
    await fetchRole();
  }, []);
  return (
    <>
      <Box
        marginTop="85px"
      />

      <Box
        width="80%"
      >

        <Button
          leftIcon={<AddIcon />}
          variant="brand"
          marginBottom="20px"
          background="teal"
          color="white"
          onClick={() => {
            setIsRoleModalOpen(true);
          }}
          t={t}
        >

          {t('role:text_add_button')}

        </Button>
        <AddRole
          isOpenModal={isRoleModalOpen}
          onCloseModal={() => {
            setIsRoleModalOpen(false);
          }}
          reloadWorkPositions={() => {
            fetchRole();
            fetchModulesStatus();
          }}
        />
      </Box>
      <Card
        direction="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'scroll' }}
      >

        <Box
          marginLeft="30px"
          fontSize={{ sm: '14px', lg: '24px' }}
          fontWeight={{ sm: '500', lg: '700' }}
        >
          Qasja e Roleve ne Module

        </Box>
        <Table variant="simple" color="gray.500" mb="24px">
          <Thead>
            <Tr>
              <Th
                pe="10px"
                borderColor={borderColor}
                justify="space-between"
                align="center"
                fontSize={{ sm: '10px', lg: '14px' }}
                color="gray.400"
              >
                Role
              </Th>
              {columnsData.map((module) => (
                <Th
                  marginLeft="20px"
                  align="center"
                  pe="10px"
                  key={module.id}
                  borderColor={borderColor}
                >
                  <Flex
                    // marginLeft="30px"
                    justify="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '14px' }}
                    color="gray.400"
                  >
                    {module.moduleName}
                  </Flex>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {roleData.map((role) => (
              <Tr>
                <Th
                  pe="0px"
                  justify="space-between"
                  align="center"
                  fontSize={{ sm: '10px', lg: '14px' }}
                  key={role.id}
                >
                  {role.name}

                </Th>
                {columnsData.map((module) => (
                  <Td
                    fontSize={{ sm: '14px' }}
                    minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                    borderColor="transparent"
                    key={module.id}
                  >
                    <Checkbox
                      key={module.id}
                      defaultChecked={getDefaultStatus(role.id, module.id)}
                      marginLeft="40%"
                      // width="100px"
                      onChange={() => {
                        updateModuleAccessStatus(role.id, module.id);
                      }}
                    />
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </>
  );
}
