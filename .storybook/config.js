import React from 'react';
import requireContext from 'require-context.macro';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { configureViewport } from '@storybook/addon-viewport';
import { FocusStyleManager } from '@blueprintjs/core';
import { locationData, loginData } from 'utils/data';
import { PageContext } from 'client/utils/hooks';

FocusStyleManager.onlyShowFocusOnTabs();

/* Require default styles as done in Html.js */
require('client/styles/base.scss');

/* Require stories */
const req = requireContext('../client', true, /Stories\.js$/);
function loadStories() {
	req.keys().forEach(req);
}

addDecorator((storyFn) => {
	return (
		<PageContext.Provider value={{ locationData, loginData }}>
			{storyFn()}
		</PageContext.Provider>
	);
});

/* Set Storybook options */
addParameters({
	options: {
		sortStoriesByKind: true,
		showPanel: false,
	},
});

configure(loadStories, module);
