import React from "react";
import classNames from "classnames";
import { Button } from "evergreen-ui";
import { useRouter } from "next/router";

import { buildUrl } from "utils/shared/urls";

import styles from "./ScopeNav.module.scss";

type NavChild = {
	slug: string;
	title: string;
};

type NavItem = {
	slug: string;
	title: string;
	children?: NavChild[];
};
export type Props = {
	navItems: NavItem[];
};

const ScopeNav: React.FC<Props> = function ({ navItems }) {
	const router = useRouter();
	const { profileSlug, collectionSlug, mode, subMode } = router.query as Record<string, string>;
	const activeModeData = navItems.find((item) => item.slug === mode);
	const activeChildren = activeModeData?.children;

	return (
		<div className={styles.scopeNav}>
			<div className={styles.primary}>
				{navItems.map((item) => {
					const { slug: modeSlug, title } = item;
					const isActive = mode === modeSlug || (!mode && !modeSlug);
					return (
						<Button
							className={classNames(styles.button, isActive && styles.active)}
							appearance="minimal"
							key={modeSlug}
							is="a"
							height={40}
							href={buildUrl({
								profileSlug: profileSlug,
								collectionSlug: collectionSlug,
								mode: modeSlug,
							})}
						>
							{title}
						</Button>
					);
				})}
			</div>
			{activeChildren && (
				<div className={styles.secondary}>
					{activeChildren.map((item) => {
						const { slug: subModeSlug, title } = item;
						const isActive = subMode === subModeSlug;
						const modeSlug = activeModeData?.slug;
						return (
							<Button
								className={classNames(styles.button, isActive && styles.active)}
								appearance="minimal"
								height={32}
								key={subModeSlug}
								is="a"
								href={buildUrl({
									profileSlug: profileSlug,
									collectionSlug: collectionSlug,
									mode: modeSlug,
									subMode: subModeSlug,
								})}
							>
								{title}
							</Button>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default ScopeNav;
