import React from "react";
import {
	AnchorButton,
	OverflowList,
	Menu,
	MenuItem,
	Boundary,
	Popover,
	Button,
	Position,
	Icon,
} from "@blueprintjs/core";
import classNames from "classnames";

import { buildUrl } from "utils/shared/urls";
import { useLocationContext } from "utils/client/hooks";

import styles from "./ScopeNav.module.scss";

type NavItem = {
	slug: string;
	title: string;
};

type Props = {
	mode: string;
	navItems: NavItem[];
};

const ScopeNav: React.FC<Props> = function ({ navItems, mode }) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;

	return (
		<div className={styles.primary}>
			<OverflowList
				items={navItems}
				collapseFrom={Boundary.END}
				visibleItemRenderer={({ slug: modeSlug, title }: NavItem) => {
					const isActive = mode === modeSlug;
					return (
						<AnchorButton
							className={classNames(styles.button, isActive ? styles.active : "")}
							minimal
							large
							key={modeSlug}
							href={buildUrl({
								namespaceSlug: namespaceSlug,
								collectionSlug: collectionSlug,
								mode: modeSlug,
							})}
							text={title}
						/>
					);
				}}
				overflowRenderer={(overflowItems) => {
					return (
						<Popover
							content={
								<Menu>
									{overflowItems.map(({ slug: modeSlug, title }: NavItem) => {
										const isActive = mode === modeSlug;
										return (
											<MenuItem
												key={modeSlug}
												text={title}
												active={isActive}
												href={buildUrl({
													namespaceSlug: namespaceSlug,
													collectionSlug: collectionSlug,
													mode: modeSlug,
												})}
											/>
										);
									})}
								</Menu>
							}
							position={Position.BOTTOM_RIGHT}
							minimal
						>
							<Button
								minimal
								large
								className={styles.button}
								icon={<Icon icon="menu" />}
							/>
						</Popover>
					);
				}}
			/>
			{/* {navItems.map(({ slug: modeSlug, title }: NavItem) => {
				const isActive = mode === modeSlug;
				return (
					<AnchorButton
						className={classNames(styles.button, isActive ? styles.active : "")}
						minimal
						large
						key={modeSlug}
						href={buildUrl({
							namespaceSlug: namespaceSlug,
							collectionSlug: collectionSlug,
							mode: modeSlug,
						})}
						text={title}
					/>
				);
			})} */}
		</div>
	);
};

export default ScopeNav;
