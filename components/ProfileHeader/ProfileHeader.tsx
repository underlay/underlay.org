import React from "react";
import { Icon, Intent, Tag } from "@blueprintjs/core";

import { Avatar, ScopeNav } from "components";
import { buildUrl } from "utils/shared/urls";
import { useLocationContext } from "utils/client/hooks";
import { communityNavItems, userNavItems } from "utils/shared/navs";
import { Community, User } from "components/Icons";

import styles from "./ProfileHeader.module.scss";

type Props = {
	type: "user" | "community";
	mode: "overview" | "settings" | "people" | "discussions";
	name: string;
	slug: string;
	avatar?: string;
	verifiedUrl?: string;
	location?: string;
};

const ProfileHeader: React.FC<Props> = function ({
	type,
	mode,
	name,
	slug,
	avatar,
	verifiedUrl,
	location,
}) {
	const { profileSlug = "" } = useLocationContext();
	return (
		<div>
			<div className={styles.scopeHeader}>
				<div className={styles.icon}>
					{type === "user" ? <User size={28} /> : <Community size={28} />}
				</div>
				<Avatar className={styles.avatarComponent} name={name} src={avatar} size={100} />

				<div className={styles.content}>
					<div className={styles.title}>
						<a href={buildUrl({ profileSlug })}>{name}</a>
					</div>

					<div className={styles.details}>
						<span className={styles.slug}>{slug}</span>
						{verifiedUrl && (
							<Tag intent={Intent.SUCCESS} minimal large>
								Verified: {verifiedUrl}
							</Tag>
						)}
						{location && (
							<span>
								<Icon icon="map-marker" className={styles.mapMarker} />
								{location}
							</span>
						)}
					</div>
				</div>
			</div>
			<ScopeNav mode={mode} navItems={type === "user" ? userNavItems : communityNavItems} />
		</div>
	);
};

export default ProfileHeader;
