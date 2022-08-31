import React from "react";
import { Icon, Intent, Tag } from "@blueprintjs/core";

import { Avatar, ScopeNav } from "components";
import { buildUrl } from "utils/shared/urls";
import { useLocationContext } from "utils/client/hooks";
import {
	communityNavItems,
	communityOwnerNavItems,
	loggedInUserNavItems,
	userNavItems,
} from "utils/shared/navs";
import { Community, User } from "components/Icons";

import styles from "./ProfileHeader.module.scss";

type Props = {
	type: "user" | "community";
	mode: "overview" | "settings" | "members" | "discussions";
	name: string;
	slug: string;
	about?: string | null;
	isOwner: boolean;
	avatar?: string | null;
	verifiedUrl?: string | null;
	location?: string | null;
};

const ProfileHeader: React.FC<Props> = function ({
	type,
	mode,
	name,
	slug,
	about,
	isOwner,
	avatar,
	verifiedUrl,
	location,
}) {
	const { namespaceSlug = "" } = useLocationContext().query;

	const navItems =
		type === "user"
			? isOwner
				? loggedInUserNavItems
				: userNavItems
			: isOwner
			? communityOwnerNavItems
			: communityNavItems;

	return (
		<div>
			<div className={styles.scopeHeader}>
				<Avatar className={styles.avatarComponent} name={name} src={avatar} size={100} />

				<div className={styles.content}>
					<div className={styles.title}>
						<a href={buildUrl({ namespaceSlug })}>{name}</a>
					</div>

					<div className={styles.details}>
						<div className={styles.icon}>
							{type === "user" ? <User size={20} /> : <Community size={20} />}
						</div>
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

					<div className={styles.about}>
						<span>{about}</span>
					</div>
				</div>
			</div>
			<ScopeNav mode={mode} navItems={navItems} />
		</div>
	);
};

export default ProfileHeader;
