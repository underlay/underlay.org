import { AnchorButton, Icon } from "@blueprintjs/core";
import React from "react";

import { Section } from "components";
import { useLocationContext } from "utils/client/hooks";
import { CollectionProps } from "utils/server/collections";

import styles from "./SideGettingStarted.module.scss";
import classNames from "classnames";

const SideGettingStarted: React.FC<CollectionProps> = function ({ collection }) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;

	const steps = [
		{
			title: "Add a Readme",
			description: "A Readme provides context and instruction about your collection",
			link: undefined,
			completed: !!collection.readme,
			onClick: () => {
				const x = document.getElementsByClassName("readme-section")[0];
				const baseClassname = `${x.className} ${styles.readmeEffect}`;
				x.className = baseClassname;
				setTimeout(() => {
					x.className = `${baseClassname} ${styles.readmeEffectActive}`;
				}, 0);
				setTimeout(() => {
					x.className = baseClassname;
				}, 750);
			},
		},
		{
			title: "Define a Schema",
			description: "Schemas communicate the shape and structure of your data",
			link: `/${namespaceSlug}/${collectionSlug}/schema`,
			completed: !!collection.schema,
		},
		{
			title: "Add Data",
			description: "Import files and align them to your schema to publish a first version",
			link: `/${namespaceSlug}/${collectionSlug}/data`,
			completed: !!collection.version,
		},
	];
	return (
		<div className={styles.gettingStarted}>
			<Section title="Getting Started" className={styles.small}>
				{steps.map((step, index) => {
					return (
						<AnchorButton
							key={step.title}
							minimal
							className={classNames(styles.step, step.completed && styles.completed)}
							href={step.link}
							disabled={step.completed}
							onClick={step.onClick}
						>
							<div>
								<div className={styles.number}>{index + 1}</div>
							</div>
							<div>
								<div className={styles.title}>
									{step.title}
									{step.completed && <Icon className={styles.icon} icon="tick" />}
								</div>
								<div className={styles.description}>{step.description}</div>
							</div>
						</AnchorButton>
					);
				})}
			</Section>
		</div>
	);
};

export default SideGettingStarted;
