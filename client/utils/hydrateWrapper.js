import React from 'react';
import { hydrate } from 'react-dom';
import { FocusStyleManager } from '@blueprintjs/core';

import { getClientInitialData } from './initialData';

const isStorybookEnv = (windowObj) =>
	windowObj.location.origin === 'http://localhost:9001' || windowObj.STORYBOOK_ENV === 'react';

export const hydrateWrapper = (Component) => {
	if (typeof window !== 'undefined' && !isStorybookEnv(window)) {
		const initialData = getClientInitialData();
		FocusStyleManager.onlyShowFocusOnTabs();

		const viewData = JSON.parse(document.getElementById('view-data').getAttribute('data-json'));
		const chunkName = JSON.parse(
			document.getElementById('chunk-name').getAttribute('data-json'),
		);

		hydrate(
			<Component initialData={initialData} viewData={viewData} chunkName={chunkName} />,
			document.getElementById('root'),
		);
	}
};
