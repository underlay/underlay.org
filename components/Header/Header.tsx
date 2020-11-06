import React from "react";
import { Button, IconButton, Menu, Pane, Popover, Position } from "evergreen-ui";

import { Avatar } from "components";
import { usePageContext } from "utils/client/hooks";

import styles from "./Header.module.scss";
import { signOut } from "next-auth/client";

const Header = () => {
	const { session } = usePageContext();
	const user = session?.user;
	return (
		<nav className={styles.header}>
			<div className={styles.content}>
				<Pane>
					<Button height={40} appearance="minimal" is="a" href="/">
						R1
					</Button>
				</Pane>
				<Pane display="flex" alignItems="center">
					{user ? (
						<>
							<Button is="a" href="/new/schema" marginRight={12} appearance="minimal">
								New schema
							</Button>
							<Popover
								position={Position.BOTTOM_LEFT}
								content={
									<Menu>
										<Menu.Group>
											<Menu.Item
												is="a"
												href={`/${user.slug}`}
												disabled={true}
											>
												Profile
											</Menu.Item>
											<Menu.Item
												is="a"
												href={`/${user.slug}/settings`}
												disabled={true}
											>
												Settings
											</Menu.Item>
										</Menu.Group>
										<Menu.Divider />
										<Menu.Group>
											<Menu.Item onSelect={() => signOut()}>
												Log out
											</Menu.Item>
										</Menu.Group>
									</Menu>
								}
							>
								<IconButton
									appearance="minimal"
									height={40}
									icon={
										<Avatar
											size={32}
											name={user.email}
											src={user.avatar || undefined}
										/>
									}
								/>
							</Popover>
						</>
					) : (
						<Button is="a" href="/login" appearance="minimal" height={40}>
							Login
						</Button>
					)}
				</Pane>
			</div>
		</nav>
	);
};

export default Header;
