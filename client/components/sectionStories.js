import React from 'react';
import { storiesOf } from '@storybook/react';
import { Section } from 'components';

const wrapperStyle = {
	margin: '1em',
};

storiesOf('components', module).add('Section', () => (
	<div>
		<div style={wrapperStyle}>
			<Section title="Query">This is my content</Section>
		</div>
		<div style={wrapperStyle}>
			<Section title="Query" useMargin={true}>
				This is my content
			</Section>
		</div>
		<div style={wrapperStyle}>
			<Section title="Messages" useMargin={false}>
				489
			</Section>
		</div>
	</div>
));
