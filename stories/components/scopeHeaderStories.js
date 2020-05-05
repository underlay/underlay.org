import React from 'react';
import { storiesOf } from '@storybook/react';
import { ScopeHeader } from 'components';
import { Tag, Intent } from '@blueprintjs/core';

const wrapperStyle = {
	border: '1px solid #ccc',
	margin: '1em',
};

storiesOf('components', module).add('ScopeHeader', () => (
	<div>
		<div style={wrapperStyle}>
			<ScopeHeader
				type="package"
				title="arnold-foundation/biography"
				detailsTop="3.2.0  ·  Updated 12 years ago"
				detailsBottom={
					<React.Fragment>
						<Tag minimal>People</Tag>
						<Tag minimal>schema.org</Tag>
						<Tag minimal>actors</Tag>
					</React.Fragment>
				}
				avatar={undefined}
			/>
		</div>
		<div style={wrapperStyle}>
			<ScopeHeader
				type="user"
				title="Megan Jorg III"
				detailsTop="megan-jorg"
				detailsBottom={
					<Tag minimal intent={Intent.SUCCESS}>
						Verified: @mjorg
					</Tag>
				}
				avatar="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=100&h=100&fit=crop"
			/>
		</div>
		<div style={wrapperStyle}>
			<ScopeHeader
				type="org"
				title="Arnold Foundation"
				detailsTop="arnold-foundation"
				detailsBottom={
					<Tag minimal intent={Intent.SUCCESS}>
						Verified: arnold.org
					</Tag>
				}
				avatar="https://images.unsplash.com/photo-1516876437184-593fda40c7ce?&w=100&h=100&fit=crop"
			/>
		</div>
	</div>
));
