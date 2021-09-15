import React from "react";

import styles from "./UserPreview.module.scss";
import { Avatar } from "components";

type Props = {
	name: string;
	email: string;
	avatar: string;
	signupToken: string;
};

const UserPreview: React.FC<Props> = function ({ name, email, avatar, signupToken }) {
	return (
		<a href={`/${signupToken}`} className={styles.previewBlock}>
			<div className={styles.title}>
				<Avatar className={styles.avatar} name={name} src={avatar} size={24} />
				{name}
			</div>
			{email && <div className={styles.description}>{email}</div>}
		</a>
	);
};

export default UserPreview;
