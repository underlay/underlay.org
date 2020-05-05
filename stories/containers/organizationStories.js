import React from 'react';
import { storiesOf } from '@storybook/react';
import App from 'containers/App/App';
import {
	locationData,
	loginData,
	organizationsData,
	packagesData,
	discussionsData,
	usersData,
} from 'stories/data';

storiesOf('containers', module).add('Organization', () => (
	<App
		chunkName="Organization"
		initialData={{
			locationData: { ...locationData, params: { ...locationData.params, mode: 'overview' } },
			loginData: loginData,
		}}
		viewData={{
			organizationData: {
				...organizationsData[0],
				packages: packagesData,
				discussions: discussionsData,
				people: usersData,
			},
		}}
	/>
));
