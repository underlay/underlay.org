import { Node } from "components/Editor/data";
import NodeOrRelationshipBlock from "components/Editor/NodeOrRelationshipBlock";
import styles from "./EntityRelationships.module.scss";

interface Props {
	relationshipAndIndexes: { relationship: Node; relationshipIndex: number }[];
	onRelationshipClick: (relationshipId: number) => void;
}

const EntityRelationships: React.FC<Props> = function ({
	relationshipAndIndexes,
	onRelationshipClick,
}) {
	return (
		<div>
			{relationshipAndIndexes.length > 0 && (
				<div>
					<div className={styles.title}>Relationships</div>
					{relationshipAndIndexes.map(({ relationship, relationshipIndex }) => {
						return (
							<div className={styles.small}>
								<NodeOrRelationshipBlock
									node={relationship}
									isRelationship={true}
									classClick={() => {
										onRelationshipClick(relationshipIndex);
									}}
									showSchema={false}
								/>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};
export default EntityRelationships;
