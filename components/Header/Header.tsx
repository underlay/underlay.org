import React from "react";
import { AnchorButton } from "@blueprintjs/core";

import { useLoginContext } from "utils/client/hooks";

import styles from "./Header.module.scss";
import HeaderNewButton from "./HeaderNewButton";
import HeaderProfileButton from "./HeaderProfileButton";

const Header = () => {
	const loginData = useLoginContext();
	return (
		<nav className={styles.header}>
			<div className={styles.content}>
				<AnchorButton
					className={styles.title}
					icon={<img src="/logo.svg" alt="Underlay logo" />}
					// text="Underlay"
					href="/"
					minimal
				/>
				<div>
					<AnchorButton
						className={styles.discover}
						text="Discover"
						href="/discover"
						large
						minimal
					/>
					{!loginData && (
						<React.Fragment>
							<AnchorButton text="Login" href="/login" large minimal />
							<AnchorButton text="Sign up" href="/signup" large outlined />
						</React.Fragment>
					)}
					{!!loginData && (
						<React.Fragment>
							<HeaderNewButton />
							<HeaderProfileButton />
						</React.Fragment>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Header;
