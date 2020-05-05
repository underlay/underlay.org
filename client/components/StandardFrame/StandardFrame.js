import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { GridWrapper, ScopeHeader, ScopeNav } from 'components';
import { NonIdealState } from '@blueprintjs/core';

require('./standardFrame.scss');

const propTypes = {
	className: PropTypes.string,
	scopeHeaderProps: PropTypes.object.isRequired,
	scopeNavProps: PropTypes.object.isRequired,
	content: PropTypes.node,
	sideContent: PropTypes.node,
};

const defaultProps = {
	className: '',
	content: <NonIdealState icon="circle" title="No content yet" />,
	sideContent: null,
};

const StandardFrame = function(props) {
	const { className, scopeHeaderProps, scopeNavProps, content, sideContent } = props;

	return (
		<div className={classNames('standard-frame-component', className)}>
			<GridWrapper>
				<ScopeHeader {...scopeHeaderProps} />

				<div className="body">
					<ScopeNav {...scopeNavProps} />
					<div className="content">
						<div className="main">{content}</div>
						{sideContent && <div className="side">{sideContent}</div>}
					</div>
				</div>
			</GridWrapper>
		</div>
	);
};

StandardFrame.propTypes = propTypes;
StandardFrame.defaultProps = defaultProps;
export default StandardFrame;
