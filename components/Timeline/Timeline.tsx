import React, { ReactElement } from "react";
import classNames from "classnames";

import styles from "./Timeline.module.scss";
import { convertToLocaleTimeString } from "utils/shared/dates";

export type TimelineItemType = "created" | "discussion" | "publish";
type Props = {
	items: [Date, ReactElement, TimelineItemType][];
};

const Timeline: React.FC<Props> = function ({ items }) {
	return (
		<div className={styles.list}>
			<ul className={styles.timeline}>
				{items.map((i, idx) => {
					return (
						<li className={styles.timelineItem} key={idx}>
							<div className={styles.timelineItemTail}></div>
							<div
								className={classNames({
									[styles.timelineItemNode]: true,
									[styles.creationNode]: i[2] === "created",
									[styles.publishNode]: i[2] === "publish",
									[styles.discussionNode]: i[2] === "discussion",
								})}
							></div>
							<div className={styles.timelineItemWrapper}>
								<div className={styles.timelineItemContent}>{i[1]}</div>
								<div className={styles.timelineItemTimestamp}>
									{convertToLocaleTimeString(i[0])}
								</div>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default Timeline;
