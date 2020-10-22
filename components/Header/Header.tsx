import React from "react";
import { Button, IconButton } from "evergreen-ui";

import { Avatar } from "components";
import { usePageContext } from "utils/client/hooks";

import styles from "./Header.module.scss";

const Header = () => {
	const { sessionData } = usePageContext();
	const user = sessionData?.user;
	return (
		<nav className={styles.header}>
			<div className={styles.content}>
				<div className={styles.left}>
					<Button
						height={40}
						appearance="minimal"
						is="a"
						href="/"
						className={styles.logo}
					>
						R1
					</Button>
				</div>
				<div>
					{user ? (
						<IconButton
							appearance="minimal"
							height={40}
							icon={<Avatar size={32} name={user.email} src={user.avatar} />}
						/>
					) : (
						<Button is="a" href="/login" appearance="minimal" height={40}>
							Login
						</Button>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Header;
