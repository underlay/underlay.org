import React, { useCallback, useState } from "react";

import { APG } from "@underlay/apg";
import { UpdateProps } from "@underlay/tasl-codemirror";

import { majorScale, Pane } from "evergreen-ui";
import { SchemaGraph, SchemaContent } from "components";

export interface SchemaEditorProps {
	initialValue: string;
	readOnly?: boolean;
	onChange?: (props: UpdateProps) => void;
}

export default function SchemaEditor({ initialValue, onChange, readOnly }: SchemaEditorProps) {
	const [schema, setSchema] = useState<APG.Schema | null>(null);
	const [namespaces, setNamespaces] = useState<Record<string, string>>({});

	const handleChange = useCallback(
		(props: UpdateProps) => {
			if (onChange !== undefined) {
				onChange(props);
			}
			setSchema(props.schema);
			setNamespaces(props.namespaces);
		},
		[onChange]
	);

	return (
		<Pane>
			<Pane marginRight={majorScale(1)} marginBottom={majorScale(1)}>
				<SchemaContent
					initialValue={initialValue}
					onChange={handleChange}
					readOnly={!!readOnly}
				/>
			</Pane>
			<Pane>{schema && <SchemaGraph schema={schema} namespaces={namespaces} />}</Pane>
		</Pane>
	);
}
