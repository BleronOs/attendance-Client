import React from 'react';

// Chakra imports
import { Flex } from '@chakra-ui/react';

// import { useColorModeValue } from '@chakra-ui/react';
// Custom components
// import { HorizonLogo } from 'components/icons/Icons';
import { HSeparator } from 'components/separator/Separator';

export function SidebarBrand() {
  //   Chakra color mode
  // const logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex align="center" direction="column">
      {/* <HorizonLogo h="26px" w="175px" my="32px" color={logoColor} /> */}
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
