import React from 'react';
import { GridWrapper } from 'components';

const Landing = function() {
	return (
		<div className="landing-container">
			<GridWrapper>
				<h1>Sample Links</h1>
				<p>
					<a href="/mar">User 1</a>
				</p>
				<p>
					<a href="/foo">User 2</a>
				</p>
				<p>
					<a href="/arnold-foundation">Org 1</a>
				</p>
				<p>
					<a href="/futures">Org 2</a>
				</p>
				<p>
					<a href="/foo/biography">Package 1</a>
				</p>
				<p>
					<a href="/arnold-foundation/filmography">Package 2</a>
				</p>
			</GridWrapper>
		</div>
	);
};

export default Landing;
