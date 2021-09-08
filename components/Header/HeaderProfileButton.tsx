import React from "react";
import { Popover, Button, Menu, MenuItem, MenuDivider, Position } from "@blueprintjs/core";

import { useLoginContext } from "utils/client/hooks";
import { Avatar } from "components";

const HeaderProfileButton = () => {
	const loginData = useLoginContext();
	const handleSignout = async () => {
		await fetch("/api/logout", { redirect: "follow" });
		window.location.href = "/";
	};

	return (
		<Popover
			content={
				<Menu>
					<MenuDivider title={loginData?.name} />
					<MenuDivider />
					<MenuItem text="Profile" href={`/${loginData?.slug}`} />
					<MenuItem text="Settings" href={`/${loginData?.slug}/settings`} />
					<MenuDivider />
					<MenuItem text="Sign out" onClick={handleSignout} />
				</Menu>
			}
			position={Position.BOTTOM_RIGHT}
			minimal
		>
			<Button
				text={<Avatar name={loginData?.name} src={loginData?.avatar} />}
				large
				minimal
			/>
		</Popover>
	);
};

export default HeaderProfileButton;
