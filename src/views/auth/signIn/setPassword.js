import React, { useState } from 'react';
import {
    Box,
    Button,
    ModalBody,
    Modal,
    ModalOverlay,
    Flex,
    ModalFooter,
    // ModalCloseButton,
    ModalHeader,
    ModalContent,
    Input,
    FormLabel,
    Icon,
    InputGroup,
    InputRightElement
} from '@chakra-ui/react';
import { confirmEmailToChangePassword } from 'utils/api/Account';
import { ToastContainer, toast } from 'react-toastify';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import Card from 'components/card/Card';
import { useTranslation } from 'react-i18next';

const SetPassword = ({
    isOpen, onClose, token, email
}) => {
    // const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [replayPassword, setReplayPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState(false);

    const { t } = useTranslation();

    const [show, setShow] = useState(false);

    const handleClick = () => setShow(!show);
    const textColorSecondary = 'gray.400';

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

    const handleConfirmation = async () => {
        setPasswordConfirm(true);
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
                setPasswordConfirm(false);
                onClose();
            }
        } catch (err) {
            if (err.response.data.status === 712) {
                showError(t('new_password:error_email_does_not_exist'));
                setPasswordConfirm(false);
            }
            if (err.response.data.status === 713) {
                showError(t('new_password:error_proccess_failed'));
                setPasswordConfirm(false);
            }
            showError(t('new_password:error_link_is_not_valide'));
            setPasswordConfirm(false);
            console.log(err);
        }
    };
    return (
        <Box>
            <Modal isCentered isOpen={isOpen} onClose={onClose} closeOnEsc={false} close size="full" colorScheme="brandScheme">
                <ModalOverlay />
                <ToastContainer
                    align="center"
                    justifyContent="center"
                />
                <Flex align="center" justify="center">
                    <ModalContent colorScheme="brandScheme">
                        <form>
                            <Card
                                marginTop="7%"
                            >
                                <Box border="solid" mr="25%" ml="25%" borderRadius="20px">
                                    <ModalHeader align="center" fontSize="30px" marginTop="6%">
                                        {t('new_password:text_header')}
                                    </ModalHeader>
                                    <Box marginLeft="15%" marginRight="15%">
                                        <ModalBody>
                                            <Flex flexDirection="column" alignItems="center">
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
                                                    <InputRightElement display="flex" alignItems="center" mt="14px">
                                                        <Icon
                                                            color={textColorSecondary}
                                                            _hover={{ cursor: 'pointer' }}
                                                            as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                                                            onClick={handleClick}
                                                        />
                                                    </InputRightElement>
                                                </InputGroup>
                                            </Flex>
                                        </ModalBody>
                                        <ModalFooter marginBottom="5%" justifyContent="center">
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
                                        </ModalFooter>
                                    </Box>
                                </Box>
                            </Card>
                        </form>
                    </ModalContent>
                </Flex>
            </Modal>
        </Box>
    );
};
export default SetPassword;
