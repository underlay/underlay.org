import React, { useCallback, useMemo } from "react";
import { Button, Link, majorScale, Pane, Paragraph, Select, Text } from "evergreen-ui";
import { useCollectionTargetContext, useStateRef } from "utils/client/hooks";

function CollectionTargets(props: { id: string | null; onChange: (id: string | null) => void }) {
	const { profileSlug: slug, targets } = useCollectionTargetContext();

	const initialValue = useMemo(() => {
		if (props.id !== null) {
			for (const { id } of targets) {
				if (id === props.id) {
					return id;
				}
			}
		}

		return targets.length > 0 ? targets[0].id : "";
	}, []);

	// const [currentVersion, setCurrentVersion] = useState()
	const [value, setValue, valueRef] = useStateRef(initialValue);

	const handleChange = useCallback(
		({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => setValue(value),
		[]
	);

	const handleClick = useCallback(() => {
		if (props.id === null) {
			props.onChange(valueRef.current);
		} else {
			props.onChange(null);
		}
	}, [props.onChange, props.id]);

	if (targets.length === 0) {
		return (
			<>
				<Paragraph>No collection targets found.</Paragraph>
				<Paragraph>
					Maybe you'd like to <Link href="/new/collection">create a new collection?</Link>
				</Paragraph>
			</>
		);
	}

	return (
		<>
			<Pane display="inline-block" verticalAlign="middle">
				<Select value={slug} disabled>
					<option value={slug}>{slug}</option>
				</Select>
				<Text marginX={majorScale(1)}>/</Text>
				<Select value={value} onChange={handleChange} disabled={props.id !== null}>
					{targets.map(({ id, slug }) => (
						<option key={id} value={id}>
							{slug}
						</option>
					))}
				</Select>
			</Pane>
			<Button marginX={majorScale(2)} onClick={handleClick}>
				{props.id === null ? "Save" : "Replace"}
			</Button>
		</>
	);
}

export default CollectionTargets;
