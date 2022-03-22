import type { Class } from "utils/shared/types";
import { NodeOrRelationshipBlock } from "components/DataViewer/DataViewer";
import styles from "./EntityRelationships.module.scss";

interface Props {
	relationships: Class[];
}

const EntityRelationships: React.FC<Props> = function ({ relationships }) {
	return (
		<div>
			<div className={styles.title}>Relationships</div>
			{relationships.map((r) => {
				return (
					<div className={styles.small}>
						<NodeOrRelationshipBlock node={r} onClick={() => {}} />
					</div>
				);
			})}
		</div>
	);
};
export default EntityRelationships;
