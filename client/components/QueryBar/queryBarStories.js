import React from 'react';
import { storiesOf } from '@storybook/react';
import { QueryBar } from 'components';

const wrapperStyle = {
	margin: '1em',
};

storiesOf('components', module).add('QueryBar', () => (
	<div>
		<div style={wrapperStyle}>
			<QueryBar />
		</div>
	</div>
));
