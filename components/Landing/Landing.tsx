import { FormGroup, InputGroup } from "@blueprintjs/core";
import classNames from "classnames";
import Form from "components/Form/Form";
import React, { useState } from "react";

import styles from "./Landing.module.scss";

type Props = {};

const Landing: React.FC<Props> = function () {
	const [query, setQuery] = useState("");

	const links = [
		{
			title: "Featured Communities",
			items: [
				{ text: "Arcadia Science", href: "/arcadia" },
				{ text: "CUNY", href: "/cuny" },
				{ text: "NewsQ", href: "/newsq" },
			],
		},
		{
			title: "Featured Collections",
			items: [
				{ text: "arcadia/proteins", href: "/arcadia/proteins" },
				{ text: "newsq/full-source", href: "/newsq/full-source" },
				{
					text: "hh/reliable-vaccine-news-sources",
					href: "/hh/reliable-vaccine-news-sources",
				},
			],
		},
		{
			title: "Resources",
			items: [
				{ text: "Github", href: "https://github.com/underlay" },
				{
					text: "RFCs",
					href: "https://github.com/underlay/overview/blob/master/community/RFCs.md",
				},
				{ text: "Contact", href: "mailto:team@underlay.org" },
			],
		},
	];

	return (
		<div className={styles.landing}>
			<div className={styles.top}>
				<h1>Underlay</h1>
				<p>Publish data that people can use</p>
				<Form
					onSubmit={(evt) => {
						evt.preventDefault();
					}}
				>
					<InputGroup
						id="email-input"
						required={true}
						value={query}
						large
						onChange={(evt) => setQuery(evt.target.value)}
						placeholder="Find collections to use and communities to join..."
					/>
				</Form>
			</div>
			<div className={styles.bottom}>
				<div className={styles.details}>
					<p>
						Our mission is to build a neutral, open-source space to publish and share
						data. With features like…you can leverage provenance and rich structures to
						make your data sustainable, understood, and accessible.
					</p>
					<img className={styles.logo} src="/kfgIcon.svg" />
					<p>
						Underlay is a project of Knowledge Futures Group, a non-profit dedicated to
						sustainable, equitable, effective public knowledge infrastructure. Support
						Knowledge Futures by becoming a member.
					</p>
				</div>
				<div className={styles.links}>
					{links.map((section) => {
						return (
							<div key={section.title} className={styles.linkSection}>
								<div className={styles.sectionTitle}>{section.title}</div>
								{section.items.map((item) => {
									return (
										<a
											key={item.href}
											className={classNames("hoverline", styles.item)}
											href={item.href}
										>
											{item.text}
										</a>
									);
								})}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Landing;
