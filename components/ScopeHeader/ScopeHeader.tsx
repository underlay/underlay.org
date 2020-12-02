import React from "react";
import classNames from "classnames";
import { Badge } from "evergreen-ui";

import { Avatar, Icon } from "components";

import styles from "./ScopeHeader.module.scss";
import { useLocationContext } from "utils/client/hooks";
import { buildUrl } from "utils/shared/urls";

export type ScopeHeaderProps = {
	type: "collection" | "schema" | "org" | "user";
	profileTitle?: string;
	detailsTop?: React.ReactNode;
	detailsBottom?: React.ReactNode;
	avatar?: string;
	initial?: string;
	isPrivate?: boolean;
};

const ScopeHeader: React.FC<ScopeHeaderProps> = function ({
	type,
	profileTitle = "",
	detailsTop = null,
	detailsBottom = null,
	avatar = "",
	initial = "",
	isPrivate = false,
}) {
	const { profileSlug, contentSlug, versionNumber } = useLocationContext();

	const showAvatar = avatar || initial;
	const isProfile = type === "org" || type === "user";
	return (
		<div className={classNames(styles.scopeHeader, "clearfix")}>
			<Icon className={styles.typeIcon} icon={type} size={28} />
			{showAvatar && (
				<Avatar className={styles.avatarComponent} name={initial} src={avatar} size={100} />
			)}
			<div className={styles.title}>
				{isProfile ? (
					<a href={buildUrl({ profileSlug })}>{profileTitle}</a>
				) : contentSlug === undefined ? (
					<a href={buildUrl({ profileSlug })}>{profileSlug}</a>
				) : versionNumber === undefined ? (
					<React.Fragment>
						<a href={buildUrl({ profileSlug })}>{profileSlug}</a>
						<span>/</span>
						<a href={buildUrl({ profileSlug, contentSlug })}>{contentSlug}</a>
					</React.Fragment>
				) : (
					<React.Fragment>
						<a href={buildUrl({ profileSlug })}>{profileSlug}</a>
						<span>/</span>
						<a href={buildUrl({ profileSlug, contentSlug })}>{contentSlug}</a>
						<span>/</span>
						<a href={buildUrl({ profileSlug, contentSlug, versionNumber })}>
							{versionNumber}
						</a>
					</React.Fragment>
				)}
				{isPrivate && (
					<Badge isSolid marginLeft={8} position="relative" top={-4}>
						Private
					</Badge>
				)}
			</div>
			<div className={classNames(styles.details, styles.top)}>{detailsTop}</div>
			<div className={classNames(styles.details)}>{detailsBottom}</div>
		</div>
	);
};

export default ScopeHeader;
