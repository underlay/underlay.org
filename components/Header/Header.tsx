import React from "react";
import { Button, Avatar } from "evergreen-ui";

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
					<Button
						is={user ? undefined : "a"}
						href={user ? undefined : "/login"}
						appearance="minimal"
						height={40}
						iconBefore={
							user ? (
								<Avatar
									borderRadius="3px"
									size={32}
									name={user.email}
									src={user.avatar}
								/>
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
