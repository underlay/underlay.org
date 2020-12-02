import React from "react";
import classNames from "classnames";
import { Button } from "evergreen-ui";

import { buildUrl } from "utils/shared/urls";

import styles from "./ScopeNav.module.scss";
import { useLocationContext } from "utils/client/hooks";

export interface NavChild {
	subMode?: string;
	title: string;
}

export interface NavItem {
	mode?: string;
	title: string;
	children?: NavChild[];
}

export interface ScopeNavProps {
	navItems: NavItem[];
}

const ScopeNav: React.FC<ScopeNavProps> = ({ navItems }) => {
	const { mode: activeMode, subMode: activeSubmode, ...locationData } = useLocationContext();

	const activeModeData = navItems.find(({ mode }) => mode === activeMode);
	const activeChildren = activeModeData?.children;

	return (
		<div className={styles.scopeNav}>
			<div className={styles.primary}>
				{navItems.map(({ mode, title }) => {
					const isActive = activeMode === mode;
					return (
						<Button
							className={classNames(styles.button, isActive && styles.active)}
							appearance="minimal"
							key={mode || ""}
							is="a"
							height={40}
							href={buildUrl({ ...locationData, mode })}
						>
							{title}
						</Button>
					);
				})}
			</div>
			{activeChildren && (
				<div className={styles.secondary}>
					{activeChildren.map((item) => {
						const { subMode: subMode, title } = item;
						const isActive = activeSubmode === subMode;
						const mode = activeModeData?.mode;
						const url = buildUrl({ ...locationData, mode, subMode });
						return (
							<Button
								className={classNames(styles.button, isActive && styles.active)}
								appearance="minimal"
								height={32}
								key={subMode}
								is="a"
								href={url}
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
