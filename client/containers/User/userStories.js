import React from 'react';
import { storiesOf } from '@storybook/react';
import App from 'containers/App/App';
import { locationData, loginData, usersData, packagesData, discussionsData } from 'utils/data';

storiesOf('containers', module).add('User', () => (
	<App
		chunkName="User"
		initialData={{
			locationData: { ...locationData, params: { ...locationData.params, mode: 'overview' } },
			loginData: loginData,
		}}
		viewData={{
			userData: { ...usersData[0], packages: packagesData, discussions: discussionsData },
		}}
	/>
));
