import React from 'react';
import PropTypes from 'prop-types';
import { PackagePreview } from 'components';

require('./packageList.scss');

const propTypes = {
	packages: PropTypes.array.isRequired,
};

const PackageList = function(props) {
	const { packages } = props;
	return (
		<div className="package-list-component">
			{packages.map((pkg) => {
				return <PackagePreview key={pkg.slug} {...pkg} />;
			})}
		</div>
	);
};

PackageList.propTypes = propTypes;
export default PackageList;
