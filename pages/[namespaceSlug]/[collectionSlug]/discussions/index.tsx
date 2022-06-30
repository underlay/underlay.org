import React from "react";
import TimeAgo from "react-timeago";

import { CollectionHeader, ThreeColumnFrame } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";
import { AnchorButton } from "@blueprintjs/core";

import styles from "./index.module.scss";

const CollectionDiscussions: React.FC<CollectionProps> = function ({ collection }) {
	return (
		<div>
			<CollectionHeader mode="discussions" collection={collection} />
			<ThreeColumnFrame
				content={
					<div>
						<div style={{ display: "flex", justifyContent: "flex-end" }}>
							<AnchorButton
								outlined
								text={"New Discussion"}
								href={`discussions/new`}
							/>
						</div>
						{collection.discussionThreads
							.sort((foo, bar) => {
								if (foo.number > bar.number) {
									return -1;
								}
								if (foo.number < bar.number) {
									return 1;
								}
								return 0;
							})
							.map((thread) => {
								const numReplies = thread.discussionItems.length - 1;
								return (
									<div key={thread.id} className={styles.thread}>
										<div className={styles.title}>
											<a
												className="hoverline"
												href={`discussions/${thread.number}`}
											>
												{thread.title}
											</a>
										</div>
										<div>
											#{thread.number} · Created by {thread.user.name}{" "}
											<TimeAgo date={thread.createdAt} />
											{numReplies > 0 && (
												<span className={styles.replyCount}>
													{numReplies} repl
													{numReplies === 1 ? "y" : "ies"}
												</span>
											)}
										</div>
									</div>
								);
							})}
					</div>
				}
			/>
		</div>
	);
};

export default CollectionDiscussions;
export const getServerSideProps = getCollectionProps;
