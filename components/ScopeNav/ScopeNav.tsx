import React from "react";
import classNames from "classnames";
import { Button, majorScale, Pane } from "evergreen-ui";

import { buildUrl } from "utils/shared/urls";
import { useLocationContext } from "utils/client/hooks";

import styles from "./ScopeNav.module.scss";

export interface NavItem {
	mode?: string;
	title: string;
}

export interface ScopeNavProps {
	navItems: NavItem[];
}

const ScopeNav: React.FC<ScopeNavProps> = ({ navItems }) => {
	const { mode: activeMode, profileSlug, contentSlug } = useLocationContext();

	return (
		<Pane marginY={majorScale(4)}>
			<Pane borderBottom="1px solid #acacac">
				{navItems.map(({ mode, title }) => (
					<Button
						className={classNames(styles.button, activeMode === mode && styles.active)}
						appearance="minimal"
						size="large"
						key={mode || ""}
						is="a"
						href={buildUrl({ profileSlug, contentSlug, mode })}
					>
						{title}
					</Button>
				))}
			</Pane>
		</Pane>
	);
};

export default ScopeNav;
