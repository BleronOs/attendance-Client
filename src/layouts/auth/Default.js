// Chakra imports
import {
  Flex,
  Box
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
// import Footer from 'components/footer/FooterAuth';
import FixedPlugin from 'components/fixedPlugin/FixedPlugin';
// // Custom components
// import { NavLink } from 'react-router-dom';
// // Assets
// import { FaChevronLeft } from 'react-icons/fa';

function AuthIllustration(props) {
  const { children, illustrationBackground } = props;
  return (
    <Flex position="relative" h="max-content">
      <Flex
        h={{
          sm: 'initial',
          md: 'unset',
          lg: '100vh',
          xl: '97vh',
        }}
        w="100%"
        maxW={{ md: '50%', lg: '1313px' }}
        mx="auto"
        pt={{ sm: '50px', md: '0px' }}
        px={{ lg: '100px', xl: '0px' }}
        ps={{ xl: '70px' }}
        justifyContent="center"
        ml={{ lg: '-220px', md: '220px' }}
      >
        {/* <NavLink
          to="/admin"
          style={() => ({
            width: 'fit-content',
            marginTop: '40px',
          })}
        /> */}
        {children}
        <Box
          display={{ base: 'none', md: 'block' }}
          h="100%"
          minH="100vh"
          w={{ lg: '45vw', '2xl': '44vw' }}
          position="absolute"
          right="0px"
        >
          <Flex
            bg={`url(${illustrationBackground})`}
            justify="center"
            align="end"
            w="100%"
            h="100%"
            bgSize="cover"
            bgPosition="50%"
            position="absolute"
            borderBottomLeftRadius={{ lg: '120px', xl: '200px' }}
          />
        </Box>
        {/* <Footer /> */}
      </Flex>
      <FixedPlugin />
    </Flex>
  );
}
// PROPS

AuthIllustration.propTypes = {
  illustrationBackground: PropTypes.string,
  image: PropTypes.any,
};

export default AuthIllustration;
