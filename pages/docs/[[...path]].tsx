import React from "react";
import { GetServerSideProps } from "next";

import { readdirSync, lstatSync, readFileSync } from "fs";
import { resolve } from "path";
import { DocFrame } from "components";
import { useRouter } from "next/router";

const docsRoot = resolve("docs");

interface DocsProps {
	content: string;
	sections: { slug: string; title: string }[];
	subSections: { slug: string; title: string }[];
}

type DocsParams = { path?: string[] };

const sectionPattern = /^\d+\. ([a-zA-Z ]+)$/;

/* Gets all top-level sections in the docs folder 
   The returned map is from slug keys to absolute file paths. */
function getSectionMap(): Map<string, { path: string; title: string }> {
	const map = new Map<string, { path: string; title: string }>();
	for (const name of readdirSync(docsRoot)) {
		if (name === "index.md") {
			continue;
		}
		const path = resolve(docsRoot, name);

		if (sectionPattern.test(name) && lstatSync(path).isDirectory()) {
			const [{}, title] = sectionPattern.exec(name)!;
			const slug = title.replace(/ /g, "-").toLowerCase();
			map.set(slug, { path, title });
		}
	}

	return map;
}

const subSectionPattern = /^\d+\. ([a-zA-Z ]+)\.md$/;

/* Gets all subSections in the docs folder for the current top-level section.
   The returned map is from slug keys to absolute file paths. */
function getSubSectionMap(sectionPath: string): Map<string, { path: string; title: string }> {
	const map = new Map<string, { path: string; title: string }>();
	for (const name of readdirSync(sectionPath)) {
		if (name === "index.md") {
			continue;
		}
		const path = resolve(sectionPath, name);
		if (subSectionPattern.test(name) && lstatSync(path).isFile()) {
			const [{}, title] = subSectionPattern.exec(name)!;
			const slug = title.replace(/ /g, "-").toLowerCase();
			map.set(slug, { path, title });
		}
	}
	return map;
}

const toEntries = ([slug, { title }]: [string, { title: string }]) => ({ slug, title });

export const getServerSideProps: GetServerSideProps<DocsProps, DocsParams> = async ({ params }) => {
	if (params === undefined) {
		return { notFound: true };
	}

	const sectionMap = getSectionMap();
	const sections = Array.from(sectionMap.entries()).map(toEntries);

	const path = params.path || [];
	if (path.length === 0) {
		const content = readFileSync(resolve(docsRoot, "index.md"), "utf-8");
		return { props: { content, sections, subSections: [] } };
	} else if (sectionMap.has(path[0])) {
		const { path: sectionPath } = sectionMap.get(path[0])!;
		const subSectionMap = getSubSectionMap(sectionPath);
		const subSections = Array.from(subSectionMap.entries()).map(toEntries);
		if (path.length === 1) {
			const content = readFileSync(resolve(sectionPath, "index.md"), "utf-8");
			return { props: { content, sections, subSections } };
		} else if (subSectionMap.has(path[1])) {
			const { path: subSectionPath } = subSectionMap.get(path[1])!;
			const content = readFileSync(subSectionPath, "utf-8");
			return { props: { content, sections, subSections } };
		} else {
			return { notFound: true };
		}
	} else {
		return { notFound: true };
	}
};

const DocsPage: React.FC<DocsProps> = ({ content, sections, subSections }) => {
	const router = useRouter();
	const path = (router.query.path || []) as string[];

	return (
		<DocFrame
			sections={sections}
			subSections={subSections}
			activeSection={path.length < 1 ? null : path[0]}
			activeSubSection={path.length < 2 ? null : path[1]}
			content={content}
		/>
	);
};

export default DocsPage;
