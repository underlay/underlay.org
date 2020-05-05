import React from 'react';
import PropTypes from 'prop-types';
import { usePageContext } from 'client/utils/hooks';
import { Icon } from 'components';

require('./packagePreview.scss');

const propTypes = {
	title: PropTypes.string.isRequired,
	slug: PropTypes.string.isRequired,
	description: PropTypes.string,
	numMessages: PropTypes.number,
	numFiles: PropTypes.number,
	numVersions: PropTypes.number,
};

const defaultProps = {
	description: undefined,
	numMessages: 0,
	numFiles: 0,
	numVersions: 0,
};

const Section = function(props) {
	const { title, slug, description, numMessages, numFiles, numVersions } = props;
	const { locationData } = usePageContext();
	const { slug: ownerSlug } = locationData;
	return (
		<a href={`/${ownerSlug}/${slug}`} className="package-preview-component">
			<Icon icon="package" iconSize={20} />
			<div className="title ellipsis">{title}</div>
			<div className="description">{description}</div>
			<div className="details">
				<span>
					{numMessages} Message{numMessages === 1 ? '' : 's'}
				</span>
				<span>
					{numFiles} File{numFiles === 1 ? '' : 's'}
				</span>
				<span>
					{numVersions} Version{numVersions === 1 ? '' : 's'}
				</span>
			</div>
		</a>
	);
};

Section.propTypes = propTypes;
Section.defaultProps = defaultProps;
export default Section;
