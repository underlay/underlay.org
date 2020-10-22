import React from "react";

import { Avatar, Button } from "components";
import { usePageContext } from "utils/client/hooks";

import styles from "./Header.module.scss";

const Header = () => {
	const { sessionData } = usePageContext();
	const user = sessionData?.user;
	return (
		<nav className={styles.header}>
			<div className={styles.content}>
				<div className={styles.left}>
					<Button appearance="subtle" href="/" className={styles.logo}>
						R1
					</Button>
				</div>
				<div>
					<Button
						href={user ? undefined : "/login"}
						appearance="subtle"
						iconBefore={
							user ? (
								<Avatar width={24} initial={user.email[0]} src={user.avatar} />
							) : undefined
						}
					>
						{user ? undefined : "Login"}
					</Button>
				</div>
			</div>
		</nav>
	);
};

export default Header;
