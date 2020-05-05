import React from 'react';
import { storiesOf } from '@storybook/react';
import App from 'containers/App/App';
import {
	locationData,
	loginData,
	organizationsData,
	packagesData,
	discussionsData,
} from 'stories/data';

storiesOf('containers', module).add('Organization', () => (
	<App
		chunkName="Organization"
		initialData={{
			locationData: { ...locationData, params: { ...locationData.params, mode: 'packages' } },
			loginData: loginData,
		}}
		viewData={{
			organizationData: {
				...organizationsData[0],
				packages: packagesData,
				discussions: discussionsData,
			},
		}}
	/>
));
