// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  Text,
  useColorModeValue,
  Link,
  Modal,
  Button,
  ModalFooter,
  ModalOverlay,
  Input,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  InputGroup,
  InputRightElement,
  Icon,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useState, React } from 'react';
import { changePassword } from 'utils/api/Account';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

export default function Banner(props) {
  const {
    banner, avatar, name, completed_hours, total_hours,
  } = props;
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [NewPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const userId = JSON.parse(localStorage.getItem('access_data')).id;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue(
    'white !important',
    '#111C44 !important'
  );

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const textColorSecondary = 'gray.400';

  // useTranslation

  const { t } = useTranslation();
  // disable button when methode is in Progress to change password
  const [processToChangePassword, setProcessToChangePassword] = useState(false);

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
  const showSuccess = (successMessage) => {
    toast.success(successMessage, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const openModal = () => {
    setOpenChangePasswordModal(true);
  };
  const closeModal = () => {
    setOpenChangePasswordModal(false);
  };
  const ChangeOldPasswordToNew = async (e) => {
    setProcessToChangePassword(true);
    e.preventDefault();
    const payload = {
      userId,
      currentPassword,
      NewPassword,
    };
    if (!currentPassword && !NewPassword && !confirmPassword) {
      showError(t('new_password:error_fill_all_inputs'));
      setProcessToChangePassword(false);
      return;
    }
    if (!currentPassword) {
      showError(t('new_password:error_fill_current_password'));
      setProcessToChangePassword(false);
      return;
    }
    if (!NewPassword) {
      showError(t('new_password:error_fill_new_password_input'));
      setProcessToChangePassword(false);
      return;
    }
    if (!confirmPassword) {
      showError(t('new_password:error_fill_repeat_password_input'));
      setProcessToChangePassword(false);
      return;
    }
    if (NewPassword !== confirmPassword) {
      showError(t('new_password:error_match_two_password'));
      setProcessToChangePassword(false);
      return;
    }
    changePassword(payload)
      .then(() => {
        closeModal();
        setProcessToChangePassword(false);
        showSuccess(t('new_password:success_change_password'));
      })
      .catch(() => {
        setProcessToChangePassword(false);
        showError(t('new_password:error_password_was_not_change'));
      });
  };

  return (
    <>
      <Card mb={{ base: '0px', lg: '20px' }} align="center">
        <ToastContainer />
        <Box
          bg={`url(${banner})`}
          bgSize="cover"
          borderRadius="16px"
          h="131px"
          w="100%"
        />
        <Avatar
          mx="auto"
          src={avatar}
          h="87px"
          w="87px"
          mt="-43px"
          border="4px solid"
          borderColor={borderColor}
        />
        <Text color={textColorPrimary} fontWeight="bold" fontSize="xl" mt="10px">
          {name}
        </Text>
        <Link color={textColorSecondary} onClick={openModal} fontSize="sm" fontWeight="400">
          {t('new_password:text_change_password')}

        </Link>
        <Flex w="max-content" mx="auto" mt="26px">
          <Flex mx="auto" me="60px" align="center" direction="column">
            <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
              {completed_hours}
            </Text>
            <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
              {t('profile:text_header_completed')}
            </Text>
          </Flex>
          <Flex mx="auto" me="60px" align="center" direction="column">
            <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
              {total_hours}
            </Text>
            <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
              {t('profile:text_header_total')}
            </Text>
          </Flex>
        </Flex>
      </Card>

      <Modal isOpen={openChangePasswordModal} size="2xl" onClose={closeModal} colorScheme="brandScheme">
        <ModalOverlay />
        <ToastContainer />
        <ModalContent colorScheme="brandScheme">
          <form>
            <Card>
              <ModalHeader>
                {t('new_password:text_change_password')}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box>
                  <Flex flexDirection="column" alignItems="center">
                    <FormLabel htmlFor="invoicers">
                      {t('new_password:text_current_password')}
                    </FormLabel>
                    <Input
                      type={show ? 'text' : 'password'}
                      name="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <FormLabel htmlFor="invoicers">
                      {t('new_password:text_password')}
                    </FormLabel>
                    <Input
                      type={show ? 'text' : 'password'}
                      name="NewPassword"
                      value={NewPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <FormLabel htmlFor="invoicers">
                      {t('new_password:text_repeat_password')}
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={show ? 'text' : 'password'}
                        name="jobPositionTextField"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <InputRightElement>
                        <Icon
                          color={textColorSecondary}
                          _hover={{ cursor: 'pointer' }}
                          as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                          onClick={handleClick}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </Flex>
                </Box>
              </ModalBody>
              <ModalFooter justifyContent="center">
                <Button
                  type="submit"
                  onClick={ChangeOldPasswordToNew}
                  background="teal"
                  color="white"
                  width="100%"
                  borderRadius="9px"
                  disabled={processToChangePassword}
                >
                  {t('new_password:button_submit')}
                </Button>
              </ModalFooter>
            </Card>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
