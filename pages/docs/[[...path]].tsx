import React from "react";
import { GetStaticProps } from "next";

import { readdirSync, lstatSync, existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { ReadmeViewer } from "components";
import { useRouter } from "next/router";
import { Heading, Link, minorScale, Text } from "evergreen-ui";

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

export const getStaticProps: GetStaticProps<DocsProps, DocsParams> = async ({ params }) => {
	if (params === undefined) {
		return { notFound: true };
	}
	const filePath = getFilePath(params.path || []);
	if (filePath !== null && existsSync(filePath) && lstatSync(filePath).isFile()) {
		const content = readFileSync(filePath, "utf-8");
		return { props: { content } };
	} else {
		return { notFound: true };
	}
};

const DocsPage: React.FC<DocsProps> = ({ content }) => {
	const router = useRouter();
	const path = (router.query.path || []) as string[];
	return (
		<>
			<Heading>
				<Link href="/docs">docs</Link>
				{path.map((name, i) => (
					<React.Fragment key={i}>
						<Text marginX={minorScale(1)}>/</Text>
						<Link href={`/docs/${path.slice(0, i + 1).join("/")}`}>{name}</Link>
					</React.Fragment>
				))}
			</Heading>
			<hr />
			<ReadmeViewer source={content} />
		</>
	);
};

export default DocsPage;
