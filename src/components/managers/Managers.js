import React from 'react';
import { Box, useStyleConfig } from '@chakra-ui/react';

const Managers = (props) => {
	const { variant, children, ...rest } = props;
	const styles = useStyleConfig('Managers', { variant });

	return (
		<Box __css={styles} {...rest}>
			{children}
		</Box>
	);
};

export default Managers;
