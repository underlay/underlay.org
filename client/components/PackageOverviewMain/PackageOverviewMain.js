import React from 'react';
import PropTypes from 'prop-types';
import { Section, QueryBar } from 'components';
import { NonIdealState } from '@blueprintjs/core';

require('./packageOverviewMain.scss');

const propTypes = {
	assertions: PropTypes.array,
	files: PropTypes.array,
	readme: PropTypes.node,
};

const defaultProps = {
	assertions: [],
	files: [],
	readme: (
		<React.Fragment>
			<h1>Biography Data</h1>

			<p>
				This package contains basic biography data as compiled by various sources and
				validated by the Arnold foundation.
			</p>

			<p>
				Contributions to this package are welcome and this package provides the default
				source of media headshots and information for requests to the foundation.
			</p>
		</React.Fragment>
	),
};

const PackageOverviewMain = function(props) {
	const { assertions, files, readme } = props;

	return (
		<div className="package-overview-main-component">
			<Section title="Query">
				<QueryBar />
			</Section>
			<Section title="Readme">
				<div className="readme">{readme}</div>
			</Section>
			<Section title="Files">
				<NonIdealState icon="circle" title="No Files yet" />
			</Section>
			<Section title="Assertions">
				<NonIdealState icon="circle" title="No Assertions yet" />
			</Section>
		</div>
	);
};

PackageOverviewMain.propTypes = propTypes;
PackageOverviewMain.defaultProps = defaultProps;
export default PackageOverviewMain;
