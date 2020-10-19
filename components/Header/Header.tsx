import React from "react";

import { usePageContext } from "utils/client/hooks";
import Button from "components/Button";
import Avatar from "components/Avatar";
import Icon from "components/Icon";

import styles from "./Header.module.scss";

const Header = () => {
	const { sessionData }= usePageContext();
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
						appearance="subtle"
						iconBefore={
							<Avatar width={24} initial={user?.name[0]} src={user?.avatar} />
						}
						iconAfter={<Icon icon="edit" />}
					/>
				</div>
			</div>
		</nav>
	);
};

export default Header;
