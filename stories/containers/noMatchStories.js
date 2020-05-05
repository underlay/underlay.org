import React from 'react';
import { storiesOf } from '@storybook/react';
import App from 'containers/App/App';
import { locationData, loginData } from 'data';

storiesOf('containers', module).add('NoMatch', () => (
	<App
		chunkName="NoMatch"
		initialData={{ locationData: locationData, loginData: loginData }}
		viewData={{}}
	/>
));
