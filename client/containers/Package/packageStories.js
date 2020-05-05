import React from 'react';
import { storiesOf } from '@storybook/react';
import App from 'containers/App/App';
import { locationData, loginData, packagesData, usersData } from 'utils/data';

storiesOf('containers', module).add('Package', () => (
	<App
		chunkName="Package"
		initialData={{
			locationData: locationData,
			loginData: loginData,
		}}
		viewData={{
			packageData: {
				...packagesData[0],
				contributors: usersData,
			},
		}}
	/>
));
