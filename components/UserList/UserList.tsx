// @ts-nocheck
import React from "react";

import { UserPreview } from "components";

import styles from "./UserList.module.scss";

type Props = {
	users: any;
};

const UserList: React.FC<Props> = function ({ users }) {
	return (
		<div className={styles.list}>
			{users.map((user) => {
				return (
					<UserPreview
						key={user.id}
						{...user}
					/>
				);
			})}
		</div>
	);
};

export default UserList;
