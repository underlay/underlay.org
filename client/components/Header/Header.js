import React from 'react';
import { GridWrapper, Avatar } from 'components';
import { Button, AnchorButton } from '@blueprintjs/core';
import { usePageContext } from 'client/utils/hooks';

require('./header.scss');

const Header = function() {
	const { loginData } = usePageContext();

	return (
		<div className="header-component">
			<GridWrapper columnClassName="header-content">
				<AnchorButton className="title " href="/" minimal>
					<img src="/static/r1-trw.png" alt="R1 Logo" />
					.underlay.org
				</AnchorButton>
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
