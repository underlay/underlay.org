import React from "react";

import Section from "components/Section";

import styles from "./Main.module.scss";

type Props = {
	assertions: any[];
	files: any[];
	readme?: React.ReactNode;
};

const defaultReadme = (
	<React.Fragment>
		<h1>Biography Data</h1>

		<p>
			This package contains basic biography data as compiled by various sources and validated
			by the Arnold foundation.
		</p>

		<p>
			Contributions to this package are welcome and this package provides the default source
			of media headshots and information for requests to the foundation.
		</p>
	</React.Fragment>
);

const PackageOverviewMain: React.FC<Props> = function ({
	assertions,
	files,
	readme = defaultReadme,
}) {

	return (
		<div>
			<Section title="Readme">
				<div className={styles.readme}>{readme}</div>
			</Section>
			<Section title="Files">
				{!files.length && <div>No Files Yet</div>}
			</Section>
			<Section title="Assertions">
				{!assertions.length && <div>No Assertions Yet</div>}
			</Section>
		</div>
	);
};

export default PackageOverviewMain;
