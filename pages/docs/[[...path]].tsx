import React from "react";
import { GetStaticProps } from "next";

import { readdirSync, lstatSync, existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { DocFrame } from "components";
import { useRouter } from "next/router";

const docsRoot = resolve("docs");

function* traverseDocsDirectory(
	path: string[]
): Generator<{ params: DocsParams }, void, undefined> {
	for (const name of readdirSync(resolve(docsRoot, ...path))) {
		const stat = lstatSync(resolve(docsRoot, ...path, name));
		if (stat.isDirectory()) {
			yield* traverseDocsDirectory([...path, name]);
		} else if (name.endsWith(".md")) {
			const urlPath =
				name === "index.md" ? [...path] : [...path, name.slice(0, name.lastIndexOf(".md"))];
			yield { params: { path: urlPath } };
		}
	}
}

export async function getStaticPaths() {
	const paths = Array.from(traverseDocsDirectory([]));
	return { paths, fallback: false };
}

interface DocsProps {
	content: string;
	sections: string[];
	subSections: string[];
}

type DocsParams = { path?: string[] };

function getFilePath(path: string[]): string | null {
	const directory = resolve(docsRoot, ...path);
	if (existsSync(directory) && lstatSync(directory).isDirectory()) {
		return resolve(docsRoot, ...path, "index.md");
	} else if (path.length > 0) {
		const tail = path[path.length - 1];
		return resolve(docsRoot, ...path.slice(0, -1), `${tail}.md`);
	} else {
		return null;
	}
}

/* Gets all top-level sections in the docs folder */
function getSections(): string[] {
	const sections = readdirSync(docsRoot).filter((x) => x !== "index.md");
	return ["overview", ...sections];
}

/* Gets all subSections  in the docs folder for the current top-level section */
function getSubSections(section: string): string[] {
	const directory = resolve(docsRoot, section);
	const subSections = readdirSync(directory)
		.filter((x) => x !== "index.md")
		.map((x) => x.replace(".md", ""));
	return subSections;
}

export const getStaticProps: GetStaticProps<DocsProps, DocsParams> = async ({ params }) => {
	if (params === undefined) {
		return { notFound: true };
	}
	const filePath = getFilePath(params.path || []);
	if (filePath !== null && existsSync(filePath) && lstatSync(filePath).isFile()) {
		const content = readFileSync(filePath, "utf-8");
		const sections = getSections();
		const subSections = params.path ? getSubSections(params.path[0]) : [];
		return { props: { content, sections, subSections } };
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
			activeSection={path[0]}
			activeSubSection={path[1]}
			content={content}
		/>
	);
};

export default DocsPage;
