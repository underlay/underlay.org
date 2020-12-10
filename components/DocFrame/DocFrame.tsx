import React from "react";
import { TabNavigation, SidebarTab } from "evergreen-ui";

import { ReadmeViewer } from "components";

import styles from "./DocFrame.module.scss";

type Props = {
	sections: string[];
	subSections: string[];
	activeSection?: string;
	activeSubSection?: string;
	content: string;
};

const fixTitles = (title: string): string => {
	return title.replace("uri", "URI").replace(/-/gi, " ");
};

const DocFrame: React.FC<Props> = function ({
	sections,
	subSections,
	activeSection = "overview",
	activeSubSection = "",
	content,
}) {
	return (
		<div className={styles.docFrame}>
			<div className={styles.side}>
				<div className={styles.sideHeader}>Documentation</div>
				<TabNavigation>
					{sections.map((item) => {
						const sectionIsActive = activeSection === item;
						const href = item === "overview" ? "/docs" : `/docs/${item}`;
						return (
							<React.Fragment key={item}>
								<SidebarTab
									is="a"
									href={href}
									isSelected={sectionIsActive && !activeSubSection}
								>
									{fixTitles(item)}
								</SidebarTab>
								{sectionIsActive &&
									subSections.map((subItem) => (
										<SidebarTab
											key={subItem}
											is="a"
											href={`/docs/${item}/${subItem}`}
											isSelected={activeSubSection === subItem}
											className={styles.subSection}
										>
											{fixTitles(subItem)}
										</SidebarTab>
									))}
							</React.Fragment>
						);
					})}
				</TabNavigation>
			</div>
			<div>
				<ReadmeViewer source={content} />
			</div>
		</div>
	);
};

export default DocFrame;
