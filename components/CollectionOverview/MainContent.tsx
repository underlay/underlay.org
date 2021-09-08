import { Section } from "components";
import Editor from "components/Editor/Editor";
import React from "react";
// import styles from "./Avatar.module.scss";

type Props = {};

const MainContent: React.FC<Props> = function ({}) {
	return (
		<React.Fragment>
			<Section title="Readme">
				<p>
					This collection contains basic biography data as compiled by various sources and
					validated by the Arnold foundation.
				</p>

				<p>
					Contributions to this collection are welcome and this collection provides the
					default source of media headshots and information for requests to the
					foundation.
				</p>
				<h4>Project Timeframe</h4>
				<p>First test scores: February 2018 with latest update on test scores: May 2020</p>
				<h4>Problem</h4>
				<p>
					Analysis can monitor watching behavior: The full dataset are sets that connect
					to the internet, making it easy to stream videos from services. Most are
					equipped with “automated content recognition” (“ACR”) that scans images on
					viewers’ screens and identifies the content by comparing it to its own known
					videos, shows, and movies. In doing so, they can generate a detailed log without
					clear notice or permission.
				</p>
			</Section>

			<Section title="Schema">
				<img
					width="100%"
					style={{ border: "1px solid #bbb", borderRadius: "3px" }}
					src="https://s3.amazonaws.com/assets.underlay.org/dev-user-uploads/92b8884c2630d78f2de609f0b3324e04.png"
				/>
			</Section>
			<Section title="Data">
				{/* <img
					width="100%"
					src="https://s3.amazonaws.com/assets.underlay.org/dev-user-uploads/20223645ee209717b4c6f7c874bedd96.png"
				/> */}
				<Editor />
			</Section>
		</React.Fragment>
	);
};

export default MainContent;
