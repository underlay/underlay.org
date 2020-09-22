import React from "react";
import Avatar from "@atlaskit/avatar";

import { usePageContext } from "utils/client/hooks";
import Button from "components/Button";
import Icon from "components/Icon/Icon";

import styles from "./Header.module.scss";

const Header = () => {
	const { user } = usePageContext();
	return (
		<nav className={styles.header}>
			<div className={styles.content}>
				<div className={styles.left}>
					<Button appearance="subtle" href="/" className={styles.logo}>
						R1
					</Button>
				</div>
				<div>
					<Button appearance="subtle">
						<Avatar
							children={() => {
								return "+";
							}}
						/>
					</Button>
					<Button appearance="subtle" iconAfter={<Icon icon="edit" />}>
						<Avatar
							children={() => {
								return "T";
							}}
						/>
					</Button>
				</div>
			</div>
		</nav>
	);
};

export default Header;
