import React from "react";

import styles from "./Footer.module.scss";

const Footer = function () {
	return (
		<div className={styles.footer}>
			<a className={styles.link} href="https://www.knowledgefutures.org">
				A project of the
				<img className={styles.logo} src="/kfgMini.svg" alt="KFG logo" />
			</a>
		</div>
	);
};

export default Footer;
