import React from 'react';
import { NonIdealState } from '@blueprintjs/core';

require('./noMatch.scss');

const NoMatch = () => {
	return (
		<div id="no-match-container">
			<NonIdealState title="Page Not Found" visual="path-search" />
		</div>
	);
};

export default NoMatch;
