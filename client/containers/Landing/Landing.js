import React from 'react';
import { GridWrapper } from 'components';

const Landing = function() {
	return (
		<div className="landing-container">
			<GridWrapper>
				<h1>Sample Links</h1>
				<p>
					<a href="/user/mar">User 1</a>
				</p>
				<p>
					<a href="/user/foo">User 2</a>
				</p>
				<p>
					<a href="/org/arnold-foundation">Org 1</a>
				</p>
				<p>
					<a href="/org/futures">Org 2</a>
				</p>
				<p>
					<a href="/package/biography">Package</a>
				</p>
			</GridWrapper>
		</div>
	);
};

export default Landing;
