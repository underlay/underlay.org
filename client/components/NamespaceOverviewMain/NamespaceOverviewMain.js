import React from 'react';
import PropTypes from 'prop-types';
import { Section, PackageList, QueryBar } from 'components';

const propTypes = {
	packages: PropTypes.array.isRequired,
};

const NamespaceOverviewMain = function(props) {
	const { packages } = props;

	return (
		<React.Fragment>
			<Section title="Query">
				<QueryBar />
			</Section>
			<Section title="Packages">
				<PackageList packages={packages} />
			</Section>
		</React.Fragment>
	);
};

NamespaceOverviewMain.propTypes = propTypes;
export default NamespaceOverviewMain;
