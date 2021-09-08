import React from "react";

import { Avatar, Section } from "components";

import styles from "./CommunityList.module.scss";

type Props = {
	memberships: any;
};

const CommunityList: React.FC<Props> = function ({ memberships }) {
	return (
		<Section title="Communities">
			<div className={styles.communities}>
				{// @ts-ignore 
				memberships.map((membership) => {
					const { name, avatar } = membership.community;
					const { slug } = membership.community.profile;
					return (
						<a key={slug} href={`/${slug}`} title={name} className={styles.anchor}>
							<Avatar className={styles.avatar} name={name} src={avatar} size={40} />
						</a>
					);
				})}
			</div>
		</Section>
	);
};

export default CommunityList;
