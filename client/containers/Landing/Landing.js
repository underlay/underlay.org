import React from 'react';
import PropTypes from 'prop-types';
import { GridWrapper } from 'components';
import { buildUrl } from 'utils/urls';

require('./landing.scss');

const propTypes = {
	usersData: PropTypes.array.isRequired,
	packagesData: PropTypes.array.isRequired,
	organizationsData: PropTypes.array.isRequired,
};

const Landing = function(props) {
	const { usersData, packagesData, organizationsData } = props;
	return (
		<div className="landing-container">
			<GridWrapper>
				<h1>Sample Links</h1>
				<div className="columns">
					<div>
						<h2>Users</h2>
						{usersData.map((user) => {
							return (
								<p key={user.id}>
									<a href={buildUrl({ namespaceSlug: user.slug })}>
										{user.fullName}
									</a>
								</p>
							);
						})}
					</div>
					<div>
						<h2>Organizations</h2>
						{organizationsData.map((org) => {
							return (
								<p key={org.id}>
									<a href={buildUrl({ namespaceSlug: org.slug })}>{org.title}</a>
								</p>
							);
						})}
					</div>
					<div>
						<h2>Packages</h2>
						{packagesData.map((pkg) => {
							const namespace = pkg.user || pkg.organization;
							return (
								<p key={pkg.id}>
									<a
										href={buildUrl({
											namespaceSlug: namespace.slug,
											packageSlug: pkg.slug,
										})}
									>
										{namespace.slug}/{pkg.slug}
									</a>
								</p>
							);
						})}
					</div>
				</div>
			</GridWrapper>
		</div>
	);
};

Landing.propTypes = propTypes;
export default Landing;
