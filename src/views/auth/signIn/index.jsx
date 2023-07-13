import React, {
  useContext, useEffect,
} from 'react';
import { useHistory } from 'react-router-dom';
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Center,
  useColorModeValue
} from '@chakra-ui/react';
// Custom components
// import { HSeparator } from 'components/separator/Separator';
import DefaultAuth from 'layouts/auth/Default';
// Assets
import illustration from 'assets/img/auth/auth.png';
// import { FcGoogle } from 'react-icons/fc';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { AuthContext } from 'contexts/auth/auth.context';
import { authenticate } from 'utils/api/auth';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { confirmEmailLink } from 'utils/api/Account';
import ResetPasswordByEmail from './resetPasswordModal';
import SetPassword from './setPassword';

function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  // const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  // const googleBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.200');
  // const googleText = useColorModeValue('navy.700', 'white');
  // const googleHover = useColorModeValue(
  //   { bg: 'gray.200' },
  //   { bg: 'whiteAlpha.300' }
  // );
  // const googleActive = useColorModeValue(
  //   { bg: 'secondaryGray.300' },
  //   { bg: 'whiteAlpha.200' }
  // );
  const history = useHistory();
  const { authDispatch } = useContext(AuthContext);
  const [show, setShow] = React.useState(false);
  const [username, setUsername] = React.useState();
  const [password, setPassword] = React.useState();
  const [submitting, setSubmitting] = React.useState(false);
  // for open Modal
  const [openResetPasswordByEmailModal, setOpenResetPasswordByEmailModal] = React.useState(false);
  const [openSetPasswordModal, setOpenSetPasswordModal] = React.useState(false);
  const { t } = useTranslation();

  const handleClick = () => setShow(!show);

  const handleLogin = () => {
    setSubmitting(true);
    const payload = {
      username,
      password,
      uuid: 'q',
      registrationId: 'q',
      email: username,
      authenticationFromAdmin: true,
    };
    authenticate(payload)
      .then((res) => {
        const resultData = res.data;
        if (resultData) {
          const { user } = resultData;

          const { token } = resultData.token;
          const role = resultData.roleModules;
          const employee = resultData.userId[0].employees;
          localStorage.setItem('access_data', JSON.stringify(user));
          localStorage.setItem('access_token', token);
          localStorage.setItem('access_role', JSON.stringify(role));
          localStorage.setItem('access_employee', JSON.stringify(employee[0].id));
          authDispatch({ type: 'SIGNIN_SUCCESS', token });
          history.push('/admin');
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error('Username or password is incorrect', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };
  const showSuccess = (message) => {
    toast.success(message, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showError = (message) => {
    toast.error(message, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const params = new URLSearchParams(window.location.hash.split('?')[1]);
  const token = params.get('confirmEmailToken');
  const email = params.get('confirmEmail');
  const passwordToken = params.get('resetPassword');

  /* eslint-disable */
  const handleConfirmation = async () => {
    console.log(token, email, passwordToken, 'fdghjs');
    if (!email || !token) return;
    try {
      await confirmEmailLink(encodeURIComponent(token), email);
      if (passwordToken == "skip") {
      return showSuccess(t('confirm_email:text_success'));
      }
      setOpenSetPasswordModal(true);
      return (
        <Center bg="green.400" h="100px" color="white" />
      );
    } catch (error) {
      console.error(error);
      showError(t('confirm_email:text_failure'));
    }
  };

  useEffect(async () => {
    await handleConfirmation();
  }, []);

  const openModal = () => {
    setOpenResetPasswordByEmailModal(true);
  };
  const closeModal = () => {
    setOpenResetPasswordByEmailModal(false);
  };
  const closePasswordModal = () => {
    setOpenSetPasswordModal(false);
  };
  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <ToastContainer />
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ lg: '190px', md: '14vh' }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign In
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Enter your username and password to sign in!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          {/* <Button
            fontSize="sm"
            me="0px"
            mb="26px"
            py="15px"
            h="50px"
            borderRadius="16px"
            bg={googleBg}
            color={googleText}
            fontWeight="500"
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}
          >
            <Icon as={FcGoogle} w="20px" h="20px" me="10px" />
            Sign in with Google
          </Button>
          <Flex align="center" mb="25px">
            <HSeparator />
            <Text color="gray.400" mx="14px">
              or
            </Text>
            <HSeparator/>
          </Flex> */}
          <FormControl>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Username
              <Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired
              variant="auth"
              fontSize="sm"
              ms={{ base: '0px', md: '0px' }}
              type="email"
              placeholder="Username"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FormLabel
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              display="flex"
            >
              Password
              <Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size="md">
              <Input
                isRequired
                fontSize="sm"
                placeholder="Password"
                mb="24px"
                size="lg"
                type={show ? 'text' : 'password'}
                variant="auth"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement display="flex" alignItems="center" mt="4px">
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: 'pointer' }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            <Flex justifyContent="space-between" align="center" mb="24px">
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  id="remember-login"
                  colorScheme="brandScheme"
                  me="10px"
                />
                <FormLabel
                  htmlFor="remember-login"
                  mb="0"
                  fontWeight="normal"
                  color={textColor}
                  fontSize="sm"
                >
                  Keep me logged in
                </FormLabel>
              </FormControl>
              <Text
                color={textColorBrand}
                fontSize="sm"
                onClick={() => { openModal(); }}
                w="124px"
                fontWeight="500"
                cursor="pointer"
              >
                Forgot password?
              </Text>
            </Flex>
            <Button
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              onClick={handleLogin}
              disabled={!username || !password || submitting}
              mb="24px"
            >
              Sign In
            </Button>
          </FormControl>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            maxW="100%"
            mt="0px"
          >
            {/* <Text color={textColorDetails} fontWeight="400" fontSize="14px">
              Not registered yet?
              <NavLink to="/auth/sign-up">
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  Create an Account
                </Text>
              </NavLink>
            </Text> */}
          </Flex>
          <ResetPasswordByEmail
            isOpen={openResetPasswordByEmailModal}
            onClose={() => {
              closeModal();
            }}
          />
          <SetPassword
            isOpen={openSetPasswordModal}
            onClose={() => {
              closePasswordModal();
            }}
            token={passwordToken}
            email={email}
          />
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
