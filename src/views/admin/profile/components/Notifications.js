// Chakra imports
import React from 'react';
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
// Custom components
import SwitchField from 'components/fields/SwitchField';
import Menu from 'components/menu/MainMenu';

const Notifications = (props) => {
  const { ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  return (
    <Card mb="20px" {...rest}>
      <Flex align="center" w="100%" justify="space-between" mb="30px">
        <Text
          color={textColorPrimary}
          fontWeight="bold"
          fontSize="2xl"
          mb="4px"
        >
          Notificationsssserearear
        </Text>
        <Menu />
      </Flex>
      <SwitchField
        isChecked
        reversed
        fontSize="sm"
        mb="20px"
        id="1"
        label="Item update notifications"
      />
      <SwitchField
        reversed
        fontSize="sm"
        mb="20px"
        id="2"
        label="Item comment notifications"
      />
      <SwitchField
        reversed
        fontSize="sm"
        mb="20px"
        id="3"
        label="Buyer review notifications"
      />
      <SwitchField
        reversed
        fontSize="sm"
        mb="20px"
        id="4"
        label="Rating reminders notifications"
      />
      <SwitchField
        reversed
        fontSize="sm"
        mb="20px"
        id="5"
        label="Meetups near you notifications"
      />
      <SwitchField
        reversed
        fontSize="sm"
        mb="20px"
        id="6"
        label="Company news notifications"
      />
      <SwitchField
        reversed
        fontSize="sm"
        mb="20px"
        id="7"
        label="New launches and projects"
      />
      <SwitchField
        reversed
        fontSize="sm"
        mb="20px"
        id="8"
        label="Monthly product changes"
      />
      <SwitchField
        reversed
        fontSize="sm"
        mb="20px"
        id="9"
        label="Subscribe to newsletter"
      />
      <SwitchField
        reversed
        fontSize="sm"
        mb="20px"
        id="10"
        label="Email me when someone follows me"
      />
    </Card>
  );
};
export default Notifications;
