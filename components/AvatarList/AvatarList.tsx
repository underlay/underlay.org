import React from "react";

import { Avatar, Section } from "components";

import styles from "./AvatarList.module.scss";

type Props = {
	title?: string;
	users: any;
};

const AvatarList: React.FC<Props> = function ({ title = "Members", users }) {
	return (
		<Section title={title}>
			<div className={styles.users}>
				{
					// @ts-ignore
					users.map((user) => {
						const { name, avatar } = user;
						const { slug } = user.profile;
						return (
							<a key={slug} href={`/${slug}`} title={name} className={styles.anchor}>
								<Avatar
									className={styles.avatar}
									name={name}
									src={avatar}
									size={40}
								/>
							</a>
						);
					})
				}
			</div>
		</Section>
	);
};

export default AvatarList;
