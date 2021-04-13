import React, { useCallback, useEffect, useState } from "react";
import {
	Checkbox,
	Heading,
	majorScale,
	Pane,
	Switch,
	Table,
	TextInput,
	toaster,
} from "evergreen-ui";

import { xsd } from "@underlay/namespaces";

import papaparse from "papaparse";

import type { State } from "@underlay/pipeline/csv-import";
import type { Editor } from "../../editor";

import { FileUpload } from "components";
import { useLocationContext } from "utils/client/hooks";
import { LocationData } from "utils/shared/urls";

import PreviewTable from "./PreviewTable";
import TypeConfig from "./TypeConfig";
import { getProxyURL } from "utils/client/upload";

type Column = State["columns"][number];

const getDefaultColumn = (
	{ profileSlug, contentSlug }: LocationData,
	id: string,
	index: number
): Column => ({
	key: `http://r1.underlay.org/${profileSlug}/${contentSlug}/${id}/${index}`,
	nullValue: null,
	type: { kind: "literal", datatype: xsd.string },
});

const parseFilePreview = (file: File | string): Promise<null | string[][]> =>
	new Promise((resolve) =>
		papaparse.parse<string[]>(file, {
			download: typeof file === "string",
			header: false,
			skipEmptyLines: true,
			preview: 10,
			complete: (results) => {
				if (results.errors.length > 0) {
					toaster.danger("Failed to parse CSV");
					for (const error of results.errors) {
						console.error(error);
						const message = `${error.type} in row ${error.row}: ${error.message}`;
						toaster.warning(message);
					}
					resolve(null);
				} else {
					resolve(results.data);
				}
			},
		})
	);

const CsvImportEditor: Editor<State> = {
	component({ id, setState, state }) {
		const [preview, setPreview] = useState<null | string[][]>(null);
		const [focus, setFocus] = useState(NaN);

		const location = useLocationContext();

		useEffect(() => {
			if (preview !== null && preview.length > 0 && state.columns.length === 0) {
				const [{ length }] = preview;
				const columns = new Array(length).fill(null);
				setState({ columns });
			}
		}, [preview, state.columns]);

		useEffect(() => {
			if (state.uri !== null) {
				const url = getProxyURL(state.uri);
				parseFilePreview(url).then(setPreview);
			}
		}, []);

		const handleUpload = useCallback(
			(uri: string, file: File) => {
				setState({ uri });
				parseFilePreview(file).then(setPreview);
			},
			[setState]
		);

		const handleReset = useCallback(() => setState({ uri: null }), []);

		const handleKeyChange = useCallback(
			({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
				setState({ key: value }),
			[]
		);

		const handleHeaderChange = useCallback(
			({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) =>
				setState({ header: checked }),
			[]
		);

		const setColumn = useCallback(
			(index: number, column: Column) => {
				const columns = state.columns.slice();
				columns[index] = column;
				setState({ columns });
			},
			[state.columns]
		);

		return (
			<>
				<Heading marginY={majorScale(2)}>File</Heading>
				<FileUpload uri={state.uri} onUpload={handleUpload} onReset={handleReset} />
				<Checkbox
					label="The first row is a header"
					checked={state.header}
					onChange={handleHeaderChange}
					userSelect="none"
				/>
				{preview && (
					<>
						<Heading marginY={majorScale(2)}>Preview</Heading>
						<PreviewTable
							data={preview}
							header={state.header}
							focus={focus}
							setFocus={setFocus}
						/>
					</>
				)}
				<Heading marginY={majorScale(2)}>Row key</Heading>
				<TextInput value={state.key} onChange={handleKeyChange} width={majorScale(64)} />
				<Heading marginY={majorScale(2)}>Columns</Heading>
				<Pane overflowX="scroll">
					<Table minWidth={1200}>
						<Table.Head>
							<Table.TextHeaderCell flexBasis={80} flexShrink={0} flexGrow={0}>
								Include
							</Table.TextHeaderCell>
							<Table.TextHeaderCell flexBasis={200} flexShrink={0} flexGrow={0}>
								Null value
							</Table.TextHeaderCell>
							<Table.TextHeaderCell flexShrink={0} flexGrow={1}>
								Column key
							</Table.TextHeaderCell>
							<Table.TextHeaderCell flexBasis={360} flexShrink={0} flexGrow={0}>
								Column type
							</Table.TextHeaderCell>
						</Table.Head>
						<Table.Body>
							{state.columns.map((column, index) => (
								<Table.Row
									key={index}
									onMouseEnter={({}) => setFocus(index)}
									background={index === focus ? "tealTint" : undefined}
								>
									<Table.Cell flexBasis={80} flexShrink={0} flexGrow={0}>
										<Checkbox
											checked={column !== null}
											onChange={({
												target: { checked },
											}: React.ChangeEvent<HTMLInputElement>) => {
												const column = checked
													? getDefaultColumn(location, id, index)
													: null;
												setColumn(index, column);
											}}
										/>
									</Table.Cell>
									<Table.Cell flexBasis={200} flexShrink={0} flexGrow={0}>
										<Switch
											height={20}
											disabled={column === null}
											checked={column !== null && column.nullValue !== null}
											onChange={({ target: { checked } }) => {
												if (column !== null) {
													setColumn(index, {
														...column,
														nullValue: checked ? "" : null,
													});
												}
											}}
										/>
										<TextInput
											marginX={majorScale(2)}
											width={majorScale(16)}
											placeholder="<empty string>"
											disabled={column === null || column.nullValue === null}
											value={column?.nullValue || ""}
											onChange={({
												target: { value },
											}: React.ChangeEvent<HTMLInputElement>) => {
												if (column !== null) {
													setColumn(index, {
														...column,
														nullValue: value,
													});
												}
											}}
										/>
									</Table.Cell>
									<Table.Cell flexShrink={0} flexGrow={1}>
										<TextInput
											width="100%"
											placeholder="http://example.com/..."
											disabled={column === null}
											value={column?.key || ""}
											onChange={({
												target: { value },
											}: React.ChangeEvent<HTMLInputElement>) => {
												if (column !== null) {
													setColumn(index, {
														...column,
														key: value,
													});
												}
											}}
										/>
									</Table.Cell>
									<Table.Cell flexBasis={360} flexShrink={0} flexGrow={0}>
										<TypeConfig
											index={index}
											column={column}
											onChange={setColumn}
										/>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				</Pane>
			</>
		);
	},
};

export default CsvImportEditor;
