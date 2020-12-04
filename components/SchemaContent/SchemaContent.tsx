import React from "react";
import { majorScale, Pane } from "evergreen-ui";

import { UpdateProps } from "@underlay/tasl-codemirror";

import dynamic from "next/dynamic";

const TaslEditor = dynamic(
	async () => {
		const { Editor } = await import("@underlay/tasl-codemirror");
		return Editor;
	},
	{ ssr: false }
);

import styles from "./SchemaContent.module.scss";

export interface SchemaContentProps {
	initialValue: string;
	onChange?: (props: UpdateProps) => void;
	readOnly?: boolean;
}

const SchemaContent: React.FC<SchemaContentProps> = ({ initialValue, onChange, readOnly }) => {
	return (
		<Pane
			className={styles.editor}
			width={majorScale(64)}
			marginRight={majorScale(1)}
			border="default"
		>
			<TaslEditor initialValue={initialValue} onChange={onChange} readOnly={!!readOnly} />
		</Pane>
	);
};

export default SchemaContent;

export const initialSchemaContent = `# Welcome to the schema editor!
# If you're new, you probably want to read
# the schema language documentation here:
# http://r1.underlay.org/docs/schemas

namespace ex http://example.com#

type foo {
  ex:a -> ? uri ;
  ex:b -> string ;
  ex:c -> dateTime ;
}

edge ex:cool ==/ ex:map /=> ex:wau

class ex:cool unit

class ex:wau {
  ex:bar -> foo ;
  ex:age -> integer ;
  ex:self -> * ex:wau ;
}






`;
