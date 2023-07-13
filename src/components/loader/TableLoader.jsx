import { Box, Spinner } from '@chakra-ui/react';

const TableLoader = () => (
  <Box
    width="full"
    display="flex"
    justifyContent="center"
    alignItems="center"
  >
    <Spinner width="10" height="10" />
  </Box>
);

export default TableLoader;
