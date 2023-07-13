// Chakra imports
import {
    Box,
    Flex,
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
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useState, React } from 'react';
// import { changePassword } from 'utils/api/Account';
import { ToastContainer, toast } from 'react-toastify';
import { sendEmailForResetPassword } from 'utils/api/Account';
import { useTranslation } from 'react-i18next';

const ResetPasswordByEmail = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [emailConfirmSender, setEmailConfirmSender] = useState(false);

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
    const validation = () => {
        if (!email) {
            showError(t('email_confirm_link:error_fill_email_input'));
            return false;
        }
        return true;
    };

    const sendConfrimLinkToChangePassword = async (e) => {
        setEmailConfirmSender(true);
        try {
            const payload = {
                email
            };
            e.preventDefault();
            if (!validation()) return;
            const response = await sendEmailForResetPassword(payload);
            if (response.status === 200) {
                onClose();
                setEmail('');
                setEmailConfirmSender(false);
                showSuccess(t('email_confirm_link:success_link_sender'));
            }
        } catch (error) {
            if (error.response.data.status == 799) {
                showError(t('email_confirm_link:error_email_does_not_exist'));
                setEmailConfirmSender(false);
            }
            if (error.response.data.status == 798) {
                showError(t('email_confirm_link:error_email_unconfirm'));
                setEmailConfirmSender(false);
            }
            showError(t('email_confirm_link:error_catch'));
            setEmailConfirmSender(false);
        }
    };
    return (
        <Box>
            <Modal isCentered isOpen={isOpen} onClose={onClose} size="xl" colorScheme="brandScheme">
                <ModalOverlay
                    align="center"
                    justifyContent="center"
                />
                <ToastContainer
                    align="center"
                    justifyContent="center"
                />
                <Flex align="center" justify="center">
                    <ModalContent colorScheme="brandScheme">
                        <form>
                            <Card>
                                <ModalHeader marginTop="5%">
                                    {t('email_confirm_link:text_header')}
                                </ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Box>
                                        <Flex flexDirection="column" alignItems="center">
                                            <FormLabel htmlFor="invoicers">
                                                {t('email_confirm_link:text_email_input')}
                                            </FormLabel>
                                            <Input
                                                name="email"
                                                type="text"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </Flex>
                                    </Box>
                                </ModalBody>
                                <ModalFooter marginBottom="5%" justifyContent="center">
                                    <Button
                                        type="submit"
                                        onClick={sendConfrimLinkToChangePassword}
                                        background="teal"
                                        color="white"
                                        width="100%"
                                        borderRadius="9px"
                                        disabled={emailConfirmSender}
                                    >
                                        {t('email_confirm_link:button_submit')}

                                    </Button>
                                </ModalFooter>
                            </Card>
                        </form>
                    </ModalContent>
                </Flex>
            </Modal>
        </Box>
    );
};
export default ResetPasswordByEmail;
