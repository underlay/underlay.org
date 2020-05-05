import React from 'react';
import PropTypes from 'prop-types';
import { Header, Footer } from 'components';
import { hydrateWrapper } from 'client/utils/hydrateWrapper';
import { PageContext } from 'client/utils/hooks';
import getPaths from './paths';

require('client/styles/base.scss');
require('./app.scss');

const propTypes = {
	chunkName: PropTypes.string.isRequired,
	initialData: PropTypes.object.isRequired,
	viewData: PropTypes.object.isRequired,
};

const App = (props) => {
	const { chunkName, initialData, viewData } = props;

	const pathObject = getPaths(chunkName);
	const { ActiveComponent, hideFooter } = pathObject;

	return (
		<PageContext.Provider value={initialData}>
			<div id="app">
				<Header />

				<div id="main-content" tabIndex="-1">
					<ActiveComponent {...viewData} />
				</div>
				{!hideFooter && <Footer />}
			</div>
		</PageContext.Provider>
	);
};

App.propTypes = propTypes;
export default App;

hydrateWrapper(App);
