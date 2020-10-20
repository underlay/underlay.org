import React from "react";
import classNames from "classnames";

import Section from "components/Section";
import Avatar from "components/Avatar";

import styles from "./Side.module.scss";

type Props = { contributors: any[] };

const Side: React.FC<Props> = function ({ contributors }) {
	return (
		<div className={styles.side}>
			<Section className={styles.section} title="Download">
				<div className={styles.download}>
					{`> ul addreg registry.underlay.org
> ul get arnold-foundation/biography`}
				</div>
			</Section>
			<Section className={classNames(styles.section, styles.stat)} title="Version">
				<span>3.2.0</span>
			</Section>
			<Section className={classNames(styles.section, styles.stat)} title="Reducer">
				<span>Basic</span>
			</Section>
			<Section className={classNames(styles.section, styles.stat)} title="Messages">
				<span>489</span>
			</Section>
			<Section className={classNames(styles.section, styles.stat)} title="Files">
				<span>24</span>
			</Section>
			<Section className={classNames(styles.section, styles.stat)} title="Dependencies">
				<span>3</span>
			</Section>
			<Section className={classNames(styles.section, styles.stat)} title="Dependant">
				<span>39</span>
			</Section>
			<Section className={classNames(styles.section, styles.stat)} title="Total Size">
				<span>89MB</span>
			</Section>
			<Section className={classNames(styles.section, styles.stat)} title="Current Size">
				<span>12MB</span>
			</Section>
			{!!contributors.length && (
				<Section className={styles.section} title="Contributors">
					{contributors.map((person) => {
						return (
							<a href={`/${person.slug}`} key={person.slug}>
								<Avatar src={person.avatar} initial={person.initial} width={35} />
							</a>
						);
					})}
				</Section>
			)}
		</div>
	);
};

export default Side;
