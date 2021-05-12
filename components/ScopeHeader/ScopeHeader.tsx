import React from "react";

import { Badge, Heading, majorScale, minorScale, Pane } from "evergreen-ui";

import { Icon } from "components";

import { useLocationContext } from "utils/client/hooks";
import { buildUrl } from "utils/shared/urls";

import styles from "./ScopeHeader.module.scss";

export type ScopeHeaderProps = {
	type: "collection" | "schema" | "pipeline" | "organization" | "user";
	isPublic?: boolean;
};

const ScopeHeader: React.FC<ScopeHeaderProps> = (props) => {
	const isPrivate = props.isPublic === false;
	return (
		<Pane>
			<Pane display="flex">
				<Icon className={styles.icon} icon={props.type} size={28} />
				<Heading is="h1" className={styles.header}>
					<ResourcePath />
				</Heading>
				{isPrivate && (
					<Badge isSolid marginLeft={majorScale(2)} alignSelf="center">
						Private
					</Badge>
				)}
			</Pane>
			{props.children}
		</Pane>
	);
};

function ResourcePath({}: {}) {
	const { profileSlug, contentSlug, versionNumber } = useLocationContext();
	const profileUrl = buildUrl({ profileSlug });
	const contentUrl = buildUrl({ profileSlug, contentSlug });
	const versionUrl = buildUrl({ profileSlug, contentSlug, versionNumber });
	if (versionNumber !== undefined) {
		return (
			<>
				<ResourceHeaderLink key="content" url={profileUrl}>
					{profileSlug}
				</ResourceHeaderLink>
				<ResourceHeaderDelimiter />
				<ResourceHeaderLink url={contentUrl}>{contentSlug}</ResourceHeaderLink>
				<ResourceHeaderDelimiter />
				<ResourceHeaderLink url={versionUrl}>{versionNumber}</ResourceHeaderLink>
			</>
		);
	} else if (contentSlug !== undefined) {
		const contentUrl = buildUrl({ profileSlug, contentSlug });
		return (
			<>
				<ResourceHeaderLink key="content" url={profileUrl}>
					{profileSlug}
				</ResourceHeaderLink>
				<ResourceHeaderDelimiter />
				<ResourceHeaderLink url={contentUrl}>{contentSlug}</ResourceHeaderLink>
			</>
		);
	} else {
		return (
			<ResourceHeaderLink key="content" url={profileUrl}>
				{profileSlug}
			</ResourceHeaderLink>
		);
	}
}

const ResourceHeaderLink: React.FC<{ url: string }> = ({ url, children }) => (
	<Heading is="a" textDecoration="none" size={800} href={url}>
		{children}
	</Heading>
);

const ResourceHeaderDelimiter: React.FC<{}> = ({}) => (
	<Heading is="span" size={800} marginX={minorScale(1)}>
		/
	</Heading>
);

export default ScopeHeader;
