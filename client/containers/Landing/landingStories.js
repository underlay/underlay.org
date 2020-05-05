import React from 'react';
import { storiesOf } from '@storybook/react';
import App from 'containers/App/App';
import { locationData, loginData } from 'utils/data';

storiesOf('containers', module).add('Landing', () => (
	<App
		chunkName="Landing"
		initialData={{ locationData: locationData, loginData: loginData }}
		viewData={{}}
	/>
));
