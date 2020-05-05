import React from 'react';
import PropTypes from 'prop-types';
import { Section, Avatar } from 'components';

require('./packageOverviewSide.scss');

const propTypes = {
	contributors: PropTypes.array,
};

const defaultProps = {
	contributors: [],
};

const PackageOverviewSide = function(props) {
	const { contributors } = props;

	return (
		<div className="package-overview-side-component">
			<Section title="Download">
				<div className="download">
					{`> ul addreg registry.underlay.org
> ul get arnold-foundation/biography`}
				</div>
			</Section>
			<Section title="Version" className="stat">
				<span>3.2.0</span>
			</Section>
			<Section title="Reducer" className="stat">
				<span>Basic</span>
			</Section>
			<Section title="Messages" className="stat">
				<span>489</span>
			</Section>
			<Section title="Files" className="stat">
				<span>24</span>
			</Section>
			<Section title="Dependencies" className="stat">
				<span>3</span>
			</Section>
			<Section title="Dependant" className="stat">
				<span>39</span>
			</Section>
			<Section title="Total Size" className="stat">
				<span>89MB</span>
			</Section>
			<Section title="Current Size" className="stat">
				<span>12MB</span>
			</Section>
			{!!contributors.length && (
				<Section title="Contributors">
					{contributors.map((person) => {
						return (
							<Avatar
								key={person.slug}
								avatar={person.avatar}
								initials={person.initials}
								width={35}
							/>
						);
					})}
				</Section>
			)}
		</div>
	);
};

PackageOverviewSide.propTypes = propTypes;
PackageOverviewSide.defaultProps = defaultProps;
export default PackageOverviewSide;
