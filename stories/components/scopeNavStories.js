import React from 'react';
import { storiesOf } from '@storybook/react';
import { ScopeNav } from 'components';

const wrapperStyle = {
	margin: '1em',
};

storiesOf('components', module).add('ScopeNav', () => (
	<div>
		<div style={wrapperStyle}>
			<ScopeNav
				navItems={[
					{ slug: 'content', title: 'Content' },
					{ slug: 'query', title: 'Query' },
				]}
			/>
		</div>
		<div style={wrapperStyle}>
			<ScopeNav
				navItems={[
					{
						slug: 'content',
						title: 'Content',
						children: [
							{ slug: 'overview', title: 'Overview' },
							{ slug: 'assertions', title: 'Assertions' },
						],
					},
					{ slug: 'query', title: 'Query' },
				]}
			/>
		</div>
	</div>
));
