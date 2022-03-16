import type { Node } from "utils/shared/types";
import classNames from "classnames";
import styles from "./Editor.module.scss";
import { Button } from "@blueprintjs/core";
import { Schema } from "components/Icons";

interface Props {
	node: Node;
	isRelationship: boolean;
	classClick?: (ev: MouseEvent) => void;
	schemaClick?: (ev: MouseEvent) => void;
	showSchema: boolean;
}

export const NodeOrRelationshipBlock: React.FC<Props> = function ({
	node,
	isRelationship,
	classClick,
	schemaClick,
	showSchema,
}) {
	return (
		<div
			key={node.id}
			className={classNames(
				styles.node,
				isRelationship && styles.relationship,
				!showSchema && styles.narrowWidth
			)}
			onClick={classClick as any}
		>
			<div className={styles.key}>
				<div className={styles.namespace}>{node.namespace}</div>
				<div className={styles.name}>{node.id}</div>
			</div>
			{showSchema && <Button minimal icon={<Schema />} onClick={schemaClick as any} />}
		</div>
	);
};
