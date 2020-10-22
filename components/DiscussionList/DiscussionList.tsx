import React from "react";

import { DiscussionPreview } from "components";
import { Discussion } from "components/DiscussionPreview/DiscussionPreview";

import styles from "./DiscussionList.module.scss";

type Props = {
	discussions: Discussion[];
};

const DiscussionList: React.FC<Props> = function ({ discussions }) {
	return (
		<div>
			{discussions.map((disc) => {
				return <DiscussionPreview key={disc.id} className={styles.preview} {...disc} />;
			})}
		</div>
	);
};

export default DiscussionList;
