import React from 'react';
import { Icon } from 'components';
import { InputGroup, Button, Tag } from '@blueprintjs/core';

require('./queryBar.scss');

const QueryBar = function() {
	return (
		<div className="query-bar-component">
			<InputGroup
				placeholder="Query it..."
				rightElement={
					<Button title="Query!" minimal icon={<Icon icon="rocket" iconSize={20} />} />
				}
				large
			/>
			<div className="options">
				<Tag minimal rightIcon="caret-down">
					Filters
				</Tag>
				<Tag minimal rightIcon="caret-down">
					Package
				</Tag>
			</div>
		</div>
	);
};

export default QueryBar;
