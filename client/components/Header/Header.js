import React from 'react';
import { GridWrapper, Avatar } from 'components';
import { Button} from '@blueprintjs/core';
import { usePageContext } from 'client/utils/hooks';

require('./header.scss');

const Header = function() {
	const { loginData } = usePageContext();

	return (
		<div className="header-component">
			<GridWrapper columnClassName="header-content">
				<div className="title">
					<a href="/">
						<img src="/static/logo.png" alt="R1 Logo" />
					</a>
					<a className="ul-link hoverline" href="https://www.underlay.org">
						underlay.org
					</a>
				</div>
				<div className="buttons">
					<Button icon="plus" rightIcon="caret-down" minimal />
					<Button
						text={<Avatar width={25} avatar={loginData.avatar} />}
						rightIcon="caret-down"
						minimal
					/>
				</div>
			</GridWrapper>
		</div>
	);
};

export default Header;
