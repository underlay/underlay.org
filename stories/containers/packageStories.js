import React from 'react';
import { storiesOf } from '@storybook/react';
import App from 'containers/App/App';
import { locationData, loginData } from 'stories/data';

storiesOf('containers', module).add('Package', () => (
	<App
		chunkName="Package"
		initialData={{ locationData: locationData, loginData: loginData }}
		viewData={{}}
	/>
));
