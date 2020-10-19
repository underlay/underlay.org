import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import Tag from "@atlaskit/tag/simple-tag";

import ScopeHeader from "./ScopeHeader";

export default {
	title: "Components/ScopeHeader",
	component: ScopeHeader,
} as Meta;

const wrapperStyle = {
	margin: "1em",
};

export const Primary: React.FC<{}> = () => (
	<div>
		<div style={wrapperStyle}>
			<ScopeHeader
				type="collection"
				title="arnold-foundation/biography"
				detailsTop="3.2.0  ·  Updated 12 years ago"
				detailsBottom={
					<React.Fragment>
						<Tag text="People" />
						<Tag text="schema.org" />
						<Tag text="actors" />
					</React.Fragment>
				}
				avatar={undefined}
			/>
		</div>
		<div style={wrapperStyle}>
			<ScopeHeader
				type="user"
				title="Megan Jorg III"
				detailsTop="megan-jorg"
				detailsBottom={<Tag color="greenLight" text="Verified: @mjorg" />}
				avatar="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=100&h=100&fit=crop"
			/>
		</div>
		<div style={wrapperStyle}>
			<ScopeHeader
				type="org"
				title="Arnold Foundation"
				detailsTop="arnold-foundation"
				detailsBottom={<Tag color="greenLight" text="Verified: arnold.org" />}
				avatar="https://images.unsplash.com/photo-1516876437184-593fda40c7ce?&w=100&h=100&fit=crop"
			/>
		</div>
	</div>
);
