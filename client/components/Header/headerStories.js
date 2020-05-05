import React from 'react';
import { storiesOf } from '@storybook/react';
import { Header } from 'components';

const wrapperStyle = {};

storiesOf('components', module).add('Header', () => (
	<div>
		<div style={wrapperStyle}>
			<Header />
		</div>
	</div>
));
