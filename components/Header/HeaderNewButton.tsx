import React from "react";
import { Popover, Button, Menu, MenuItem, Position } from "@blueprintjs/core";

const HeaderNewButton = () => {
	return (
		<Popover
			content={
				<Menu>
					<MenuItem text="Create Collection" href="/create/collection" />
					<MenuItem text="Create Community" href="/create/community" />
				</Menu>
			}
			position={Position.BOTTOM_RIGHT}
			minimal
		>
			<Button icon="plus" text="New" minimal large />
		</Popover>
	);
};

export default HeaderNewButton;
