import React from 'react';
import { storiesOf } from '@storybook/react';
import { PackagePreview } from 'components';

const wrapperStyle = {
	margin: '1em',
};

storiesOf('components', module).add('PackagePreview', () => (
	<div>
		<div style={wrapperStyle}>
			<PackagePreview
				title="Query"
				description="This is a package"
				numMessages={14}
				numFiles={1}
				numVersions={5}
			/>
		</div>
		<div style={wrapperStyle}>
			<PackagePreview
				title="This is a package title that is really long, and while it doesn't make sense to have it be this long, we want to make sure it will ellipsize itself"
				description="This is a package with a really long description. And it keeps going, and we know it keeps going because we're the ones who are typing it here every so carefully."
				numMessages={14}
				numFiles={1}
				numVersions={5}
			/>
		</div>
	</div>
));
