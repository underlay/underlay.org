import React from 'react';

require('./footer.scss');

const Footer = function() {
	return (
		<div className="footer-component">
			<a href="https://www.knowledgefutures.org">
				A project of the
				<img className="logo" src="/static/kfgMini.svg" alt="KFG logo" />
			</a>
		</div>
	);
};

export default Footer;
