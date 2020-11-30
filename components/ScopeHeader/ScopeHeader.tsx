import React from "react";
import classNames from "classnames";
import { Badge } from "evergreen-ui";

import { Avatar, Icon } from "components";

import styles from "./ScopeHeader.module.scss";

export type Props = {
	type: "collection" | "schema" | "org" | "user";
	profileSlug: string;
	profileTitle?: string;
	contentSlug?: string;
	detailsTop?: React.ReactNode;
	detailsBottom?: React.ReactNode;
	avatar?: string;
	initial?: string;
	isPrivate?: boolean;
};

const ScopeHeader: React.FC<Props> = function ({
	type,
	profileSlug,
	profileTitle = "",
	contentSlug = "",
	detailsTop = null,
	detailsBottom = null,
	avatar = "",
	initial = "",
	isPrivate = false,
}) {
	const showAvatar = avatar || initial;
	const isProfile = type === "org" || type === "user";
	return (
		<div className={classNames(styles.scopeHeader, "clearfix")}>
			<Icon className={styles.typeIcon} icon={type} size={28} />
			{showAvatar && (
				<Avatar className={styles.avatarComponent} name={initial} src={avatar} size={100} />
			)}
			<div className={styles.title}>
				{isProfile && <a href={`/${profileSlug}`}>{profileTitle}</a>}
				{!isProfile && (
					<React.Fragment>
						<a href={`/${profileSlug}`}>{profileSlug}</a>
						<span>/</span>
						<a href={`/${profileSlug}/${type}s`}>{type}s</a>
						<span>/</span>
						<a href={`/${profileSlug}/${type}s/${contentSlug}`}>{contentSlug}</a>
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
