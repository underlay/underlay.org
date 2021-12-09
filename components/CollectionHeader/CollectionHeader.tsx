import React from "react";
import { Icon, Tag } from "@blueprintjs/core";

import { ScopeNav } from "components";
import { Collection } from "components/Icons";
import { buildUrl } from "utils/shared/urls";
import { useLocationContext } from "utils/client/hooks";
import { collectionNavItems } from "utils/shared/navs";

import styles from "./CollectionHeader.module.scss";

type Props = {
	labels?: string[];
	isPrivate?: boolean;
	mode: string;
};

const CollectionHeader: React.FC<Props> = function ({ isPrivate = false, mode, labels = [] }) {
	const { profileSlug = "", collectionSlug = "" } = useLocationContext().query;
	return (
		<div>
			<div className={styles.scopeHeader}>
				<div className={styles.icon}>
					<Collection size={28} />
				</div>
				<div className={styles.content}>
					<div className={styles.title}>
						<a className={styles.profilePrefix} href={buildUrl({ profileSlug })}>
							{profileSlug}
						</a>
						<span>/</span>
						<a href={buildUrl({ profileSlug, collectionSlug })}>{collectionSlug}</a>

						{isPrivate && (
							<Tag className={styles.privateTag} minimal large>
								Private
							</Tag>
						)}
						<Icon icon="star-empty" size={22} />
					</div>

					<div className={styles.details}>
						{labels?.map((label) => {
							return (
								<Tag key={label} large minimal round className={styles.label}>
									{label}
								</Tag>
							);
						})}
					</div>
				</div>
			</div>
			<ScopeNav mode={mode} navItems={collectionNavItems} />
		</div>
	);
};

export default CollectionHeader;
