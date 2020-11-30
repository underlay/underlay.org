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
	contentType?: "collection" | "schema";
	activeMode?: string;
	activeSubmode?: string;
};

const ScopeNav: React.FC<Props> = function ({ navItems, contentType, activeMode, activeSubmode }) {
	const router = useRouter();
	console.log(router.query);
	const { profileSlug, contentSlug } = router.query as Record<string, string>;
	const activeModeData = navItems.find((item) => item.slug === activeMode);
	const activeChildren = activeModeData?.children;

	return (
		<div className={styles.scopeNav}>
			<div className={styles.primary}>
				{navItems.map((item) => {
					const { slug: modeSlug, title } = item;
					const isActive = activeMode === modeSlug || (!activeMode && !modeSlug);
					return (
						<Button
							className={classNames(styles.button, isActive && styles.active)}
							appearance="minimal"
							key={modeSlug}
							is="a"
							height={40}
							href={buildUrl({
								profileSlug: profileSlug,
								contentSlug: contentSlug,
								mode: modeSlug,
								type: contentType,
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
						const isActive = activeSubmode === subModeSlug;
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
									contentSlug: contentSlug,
									mode: modeSlug,
									subMode: subModeSlug,
									type: contentType,
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
