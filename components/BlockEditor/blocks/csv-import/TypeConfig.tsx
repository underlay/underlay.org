import React, { memo, useCallback } from "react";

import { majorScale, SegmentedControl, Select } from "evergreen-ui";

import { xsd, rdf } from "@underlay/namespaces";

import type { State } from "@underlay/pipeline/csv-import";

type Column = State["columns"][number];

const TypeOptionURI = { label: "URI", value: "uri" };
const TypeOptionLiteral = { label: "Literal", value: "literal" };
const TypeOptions = [TypeOptionURI, TypeOptionLiteral];

const DatatypeOptions = [
	{ label: "String", value: xsd.string },
	{ label: "Boolean", value: xsd.boolean },
	{ label: "Integer", value: xsd.integer },
	{ label: "Date", value: xsd.date },
	{ label: "DateTime", value: xsd.dateTime },
	{ label: "JSON", value: rdf.JSON },
	{ label: "float32", value: xsd.float },
	{ label: "float64", value: xsd.double },
	{ label: "int64", value: xsd.long },
	{ label: "int32", value: xsd.int },
	{ label: "int16", value: xsd.short },
	{ label: "uint64", value: xsd.unsignedLong },
	{ label: "uint32", value: xsd.unsignedInt },
	{ label: "uint16", value: xsd.unsignedShort },
	{ label: "uint8", value: xsd.unsignedByte },
	{ label: "Base64", value: xsd.base64Binary },
	{ label: "Hex", value: xsd.hexBinary },
];

const datatypes = new Set(DatatypeOptions.map(({ value }) => value));

interface TypeConfigProps {
	index: number;
	column: Column;
	onChange: (index: number, column: Column) => void;
}

function KindConfig({ index, column, onChange }: TypeConfigProps) {
	const kind = column === null ? "literal" : column.type.kind;
	const handleChange = useCallback(
		(value: string | number | boolean) => {
			if (column === null) {
				return;
			} else if (value === "uri") {
				onChange(index, { ...column, type: { kind: "uri" } });
			} else if (value === "literal") {
				onChange(index, { ...column, type: { kind: "literal", datatype: xsd.string } });
			}
		},
		[index, column, onChange]
	);

	return (
		<SegmentedControl
			userSelect="none"
			disabled={column === null}
			options={TypeOptions}
			width={160}
			value={kind}
			onChange={handleChange}
		/>
	);
}

function DatatypeConfig(props: TypeConfigProps) {
	const handleDatatypeChange = useCallback(
		({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
			if (props.column !== null) {
				props.onChange(props.index, {
					...props.column,
					type: { kind: "literal", datatype: value },
				});
			}
		},
		[props.index, props.column, props.onChange]
	);

	if (props.column === null) {
		return (
			<Select marginLeft={majorScale(2)} disabled defaultValue={xsd.string}>
				<option value={xsd.string}>String</option>
			</Select>
		);
	} else if (props.column.type.kind === "uri") {
		return null;
	} else {
		const datatype = datatypes.has(props.column.type.datatype)
			? props.column.type.datatype
			: xsd.string;
		return (
			<Select marginLeft={majorScale(2)} onChange={handleDatatypeChange} value={datatype}>
				{DatatypeOptions.map(({ value, label }, index) => (
					<option key={index} value={value}>
						{label}
					</option>
				))}
			</Select>
		);
	}
}

const TypeConfig: React.FC<TypeConfigProps> = (props) => {
	return (
		<>
			<KindConfig {...props} />
			<DatatypeConfig {...props} />
		</>
	);
};

export default memo(TypeConfig);
