import { Timeline } from "components";
import { TimelineItemType } from "components/Timeline/Timeline";
import React from "react";
import { ReactElement } from "react";

import { CollectionProps } from "utils/server/collections";

const CollectionOverviewTimeline: React.FC<CollectionProps> = function ({ collection }) {
	const timelineItems: [Date, ReactElement, TimelineItemType][] = [];

	timelineItems.push([collection.createdAt, <span>Collection created</span>, "created"]);

	collection.versions.forEach((v) =>
		timelineItems.push([
			v.createdAt,
			<span>
				Version <span>{v.number}</span> published
			</span>,
			"publish",
		])
	);

	const colFullSlug = `/${collection.namespace.slug}/${collection.slugPrefix}-${collection.slugSuffix}`;
	collection.discussionThreads.forEach((dt) => {
		timelineItems.push([
			dt.createdAt,
			<span>
				Discussion{" "}
				<a target="_blank" href={`${colFullSlug}/discussions/${dt.number}`}>
					{dt.title}
				</a>
			</span>,
			"discussion",
		]);
	});

	timelineItems.sort((a, b) => {
		return b[0].getTime() - a[0].getTime();
	});

	return (
		<div>
			<Timeline items={timelineItems} />
		</div>
	);
};

export default CollectionOverviewTimeline;
