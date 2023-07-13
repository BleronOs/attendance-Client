import React, { useState } from 'react';
import {
    Box, Button, Center, Input, FormLabel, Icon, InputGroup, InputRightElement
} from '@chakra-ui/react';
import { confirmEmailToChangePassword } from 'utils/api/Account';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';

const ConfirmEmail = () => {
    // const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [replayPassword, setReplayPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState(false);

    const [show, setShow] = useState(false);

    const history = useHistory();
    const handleClick = () => setShow(!show);
    const textColorSecondary = 'gray.400';

    const { t } = useTranslation();
    // Show Success Notification
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
    // Show Error Notification
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

    const RedirectToSignIn = () => {
        history.push('auth/sign-in/default');
    };

    const handleConfirmation = async () => {
        setPasswordConfirm(true);
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        const token = params.get('token');
        const email = params.get('email');
        if (!newPassword && !replayPassword) {
            showError(t('new_password:error_fill_all_inputs'));
            setPasswordConfirm(false);
            return;
        }
        if (!newPassword) {
            showError(t('new_password:error_fill_new_password_input'));
            setPasswordConfirm(false);
            return;
        }
        if (!replayPassword) {
            showError(t('new_password:error_fill_repeat_password_input'));
            setPasswordConfirm(false);
            return;
        }
        if (newPassword !== replayPassword) {
            showError(t('new_password:error_match_two_password'));
            setPasswordConfirm(false);
            return;
        }
        try {
            const payload = {
                email,
                token,
                newPassword
            };
            const response = await confirmEmailToChangePassword(payload);
            if (response.status === 200) {
                showSuccess(t('new_password:success_set_new_password'));
                RedirectToSignIn();
                setPasswordConfirm(false);
            }
        } catch (err) {
            if (err.response.data.status === 712) {
                showError(t('new_password:error_email_does_not_exist'));
                setPasswordConfirm(false);
            }
            if (err.response.data.status === 713) {
                showError(t('new_password:error_proccess_failed'));
                setPasswordConfirm(false);
             } else {
                showError(t('new_password:error_link_is_not_valide'));
            }
            setPasswordConfirm(false);
            console.log(err);
        }
    };
    return (
        <Box
            justifyContent="center"
            alignItems="center"
            marginTop="16%"
        >
            <ToastContainer />
            <Center border="solid" marginLeft={{ sm: '10%', lg: '25%' }} marginRight={{ sm: '10%', lg: '25%' }}>
                <Box width={{ sm: '80%', lg: '40%' }}>
                    <FormLabel
                        marginLeft="1.5%"
                        marginTop="10%"
                        htmlFor="invoicers"
                    >
                        {t('new_password:text_password')}
                    </FormLabel>
                    <Input
                        fontSize="sm"
                        mb="24px"
                        size="lg"
                        type={show ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        marginTop="1%"
                    />
                    <FormLabel
                        marginTop="0.5%"
                        marginLeft="1.5%"
                        htmlFor="invoicers"
                    >
                        {t('new_password:text_repeat_password')}
                    </FormLabel>
                    <InputGroup size="md">
                        <Input
                            marginTop="1%"
                            fontSize="sm"
                            mb="24px"
                            size="lg"
                            type={show ? 'text' : 'password'}
                            value={replayPassword}
                            onChange={(e) => setReplayPassword(e.target.value)}
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
                    <Button
                        marginTop="5%"
                        onClick={handleConfirmation}
                        marginBottom="10%"
                        width="100%"
                        bg="green.400"
                        color="white"
                        disabled={passwordConfirm}
                    >
                        {t('new_password:button_submit')}
                    </Button>
                </Box>
            </Center>
        </Box>
    );
};
export default ConfirmEmail;
