import { CollectionHeader, DiscussionThread, ThreeColumnFrame } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";
import { useLocationContext } from "utils/client/hooks";

const CollectionDiscussions: React.FC<CollectionProps> = function ({ collection }) {
	const { query } = useLocationContext();
	const { threadNumber } = query;
	const initDiscussionThread = collection.discussionThreads.find((thread) => {
		return thread.number === Number(threadNumber);
	});
	if (!initDiscussionThread) {
		return null;
	}

	return (
		<div>
			<CollectionHeader mode="discussions" collection={collection} />
			<ThreeColumnFrame
				content={
					<div>
						<DiscussionThread initDiscussionThread={initDiscussionThread} />
					</div>
				}
			/>
		</div>
	);
};

export default CollectionDiscussions;
export const getServerSideProps = getCollectionProps;
