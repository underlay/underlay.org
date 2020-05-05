import React from 'react';
import { storiesOf } from '@storybook/react';
import { Avatar } from 'components';

const wrapperStyle = { padding: '1em', display: 'flex', alignItems: 'flex-end' };

const plainBlock = {
	initials: 'MF',
};

const image = {
	avatar: 'https://assets.pubpub.org/mflaxicd/11505393046254.jpg',
	width: 50,
};

const sizes = [25, 50, 100, 250];
storiesOf('components', module).add('Avatar', () => (
	<div>
		<div style={wrapperStyle}>
			{sizes.map((size) => {
				return <Avatar key={`border-${size}`} {...plainBlock} width={size} />;
			})}
		</div>

		<div style={wrapperStyle}>
			{sizes.map((size) => {
				return <Avatar key={`border-${size}`} {...image} width={size} />;
			})}
		</div>
	</div>
));
