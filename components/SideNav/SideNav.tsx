import React from "react";
import classNames from "classnames";
import { Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import styles from "./SideNav.module.scss";

type Item = {
	text: string;
	href: string;
	active: boolean;
};
type Props = {
	menuItems: Item[];
	className?: string;
};

const SideNav: React.FC<Props> = function ({ menuItems, className = "" }) {
	return (
		<Menu className={classNames(styles.sideNav, className)}>
			{menuItems.map(({ text, href, active }, index) => {
				return (
					<React.Fragment key={text}>
						{index !== 0 && <MenuDivider />}
						<MenuItem
							text={text}
							href={href}
							className={classNames(styles.item, active && styles.active)}
						/>
					</React.Fragment>
				);
			})}
		</Menu>
	);
};

export default SideNav;
