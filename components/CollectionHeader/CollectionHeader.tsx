import React from "react";
import { Icon, Tag } from "@blueprintjs/core";

import { ScopeNav } from "components";
import { Collection } from "components/Icons";
import { buildUrl } from "utils/shared/urls";
import { useLocationContext } from "utils/client/hooks";
import { collectionNavItems } from "utils/shared/navs";

import styles from "./CollectionHeader.module.scss";
import Head from "next/head";
import { capitalize, getSlugPrefix } from "utils/shared/strings";

import { CollectionProps } from "utils/server/collections";

type Props = CollectionProps & { mode: string };

const CollectionHeader: React.FC<Props> = function ({ mode, collection }) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;

	const { labels, isPublic } = collection;
	return (
		<div>
			<Head>
				<title>
					{capitalize(mode)}
					{mode ? " · " : ""}
					{namespaceSlug}/{getSlugPrefix(collectionSlug)} · Underlay
				</title>
			</Head>
			<div className={styles.scopeHeader}>
				<div className={styles.content}>
					<div className={styles.title}>
						<a className={styles.profilePrefix} href={buildUrl({ namespaceSlug })}>
							{namespaceSlug}
						</a>
						<span>/</span>
						<a href={buildUrl({ namespaceSlug, collectionSlug })}>
							{getSlugPrefix(collectionSlug)}
						</a>

						{!isPublic && (
							<Tag className={styles.privateTag} minimal large>
								Private
							</Tag>
						)}
						<Icon icon="star-empty" size={22} />
					</div>

					<div className={styles.details}>
						<div className={styles.icon}>
							<Collection size={20} />
						</div>

						{
							//@ts-ignore
							labels?.map((label) => {
								return (
									<Tag key={label} large minimal round className={styles.label}>
										{label}
									</Tag>
								);
							})
						}
					</div>
				</div>
			</div>
			<ScopeNav mode={mode || "overview"} navItems={collectionNavItems} />
		</div>
	);
};

export default CollectionHeader;
