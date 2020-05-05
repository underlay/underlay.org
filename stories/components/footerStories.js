import React from 'react';
import { storiesOf } from '@storybook/react';
import { Footer } from 'components';

const wrapperStyle = {
	border: '1px solid #ccc',
};

storiesOf('components', module).add('Footer', () => (
	<div>
		<div style={wrapperStyle}>
			<Footer />
		</div>
	</div>
));
