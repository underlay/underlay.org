import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	DotIcon,
	Heading,
	majorScale,
	minorScale,
	Pane,
	Text,
} from "evergreen-ui";
import React, { useMemo } from "react";
import { useLocationContext } from "utils/client/hooks";
import { buildUrl } from "utils/shared/urls";

export interface VersionNavigatorProps {
	createdAt: string;
	previous: null | string;
	next: null | string;
}

const VersionNavigator: React.FC<VersionNavigatorProps> = (props) => {
	const { profileSlug, contentSlug, versionNumber } = useLocationContext();

	const date = useMemo(() => new Date(props.createdAt), [props.createdAt]);

	const previousUrl = useMemo(() => {
		if (props.previous === null) {
			return "#";
		} else {
			return buildUrl({ profileSlug, contentSlug, versionNumber: props.previous });
		}
	}, [props.previous]);

	const nextUrl = useMemo(() => {
		if (props.next === null) {
			return "#";
		} else {
			return buildUrl({ profileSlug, contentSlug, versionNumber: props.next });
		}
	}, [props.next]);

	return (
		<Pane
			padding={majorScale(2)}
			display="flex"
			alignItems="baseline"
			marginTop={-majorScale(2)}
			marginBottom={majorScale(4)}
			background="tint1"
			border="muted"
		>
			<Pane flex={1} marginX={majorScale(1)} display="flex" alignItems="center">
				<Heading>{versionNumber}</Heading>
				<DotIcon marginX={minorScale(2)} color="muted" />
				<Text>{date.toISOString()}</Text>
			</Pane>

			<Button
				marginRight={12}
				iconBefore={ArrowLeftIcon}
				appearance="minimal"
				disabled={props.previous === null}
				is="a"
				href={previousUrl}
			>
				Previous
			</Button>
			<Button
				marginRight={12}
				iconAfter={ArrowRightIcon}
				appearance="minimal"
				disabled={props.next === null}
				is="a"
				href={nextUrl}
			>
				Next
			</Button>
		</Pane>
	);
};

export default VersionNavigator;
