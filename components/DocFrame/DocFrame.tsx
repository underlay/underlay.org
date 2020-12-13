import React from "react";
import { TabNavigation, SidebarTab } from "evergreen-ui";

import { ReadmeViewer } from "components";

import styles from "./DocFrame.module.scss";

interface DocFrameProps {
	sections: { slug: string; title: string }[];
	subSections: { slug: string; title: string }[];
	activeSection: string | null;
	activeSubSection: string | null;
	content: string;
}

const DocFrame: React.FC<DocFrameProps> = ({
	sections,
	subSections,
	activeSection,
	activeSubSection,
	content,
}) => {
	return (
		<div className={styles.docFrame}>
			<div className={styles.side}>
				<div className={styles.sideHeader}>Documentation</div>
				<TabNavigation>
					<SidebarTab is="a" href="/docs" isSelected={activeSection === null}>
						Overview
					</SidebarTab>
					{sections.map((item) => {
						const sectionIsActive = activeSection === item.slug;
						return (
							<React.Fragment key={item.slug}>
								<SidebarTab
									is="a"
									href={`/docs/${item.slug}`}
									isSelected={sectionIsActive && activeSubSection === null}
								>
									{item.title}
								</SidebarTab>
								{sectionIsActive &&
									subSections.map((subItem) => (
										<SidebarTab
											key={subItem.slug}
											is="a"
											href={`/docs/${item.slug}/${subItem.slug}`}
											isSelected={activeSubSection === subItem.slug}
											className={styles.subSection}
										>
											{subItem.title}
										</SidebarTab>
									))}
							</React.Fragment>
						);
					})}
				</TabNavigation>
			</div>
			<div className={styles.content}>
				<ReadmeViewer source={content} />
			</div>
		</div>
	);
};

export default DocFrame;
