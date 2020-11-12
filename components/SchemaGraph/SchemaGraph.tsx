import React, { useCallback, useEffect, useState } from "react";

import { select } from "d3-selection";
import { curveBasis } from "d3-shape";
import dagreD3 from "dagre-d3";
import graphlib from "graphlib";

import * as t from "io-ts";

import styles from "./SchemaGraph.module.scss";

import { TomlSchema, Datatype, Property } from "utils/shared/schemas/codec";
import { IconButton, LinkIcon, Pane } from "evergreen-ui";

const SVGStyle = `text {
	font-family: "Monaco", monospace;
	font-size: 14px;
}

.node rect,
.node circle,
.node polygon {
	stroke: #333;
	fill: #fff;
	stroke-width: 1.5px;
}

.edgePath path.path {
	stroke: #333;
	fill: none;
	stroke-width: 1.5px;
}`;

declare module "graphlib" {
	interface Graph {
		graph(): { width: number; height: number };
	}
}

const edgeStyles = {
	required: "stroke-width: 1.5px;",
	optional: "stroke: #333; fill: none; stroke-width: 1.5px; stroke-dasharray: 8, 3;",
	any: "stroke: #333; fill: none; stroke-width: 1.5px; stroke-dasharray: 3, 3;",
};

const nodeStyles = {
	class: "fill: seashell",
	uri: "fill: darkseagreen",
	literal: "fill: lightyellow",
};

export interface SchemaGraphProps {
	schema: t.TypeOf<typeof TomlSchema>;
}

const getProperty = (value: Datatype | Property): Property =>
	typeof value === "string" ? { kind: "literal", datatype: value } : value;

export default function Graph(props: SchemaGraphProps) {
	const [element, setElement] = useState<SVGSVGElement | null>(null);
	const [sourceUrl, setSourceUrl] = useState<string | null>(null);

	const elementRef = useCallback((element: SVGSVGElement) => {
		setElement(element);
		select(element).append("g").classed("graph", true);
	}, []);

	useEffect(() => {
		if (element === null) {
			return;
		}

		// Create the input graph
		const graph = new graphlib.Graph({ multigraph: true }).setGraph({});
		const labels = Object.keys(props.schema.classes);
		for (const [i, label] of labels.entries()) {
			const id = `n${i}`;
			graph.setNode(id, { label, shape: "circle", style: nodeStyles.class });
		}

		for (const [i, label] of labels.entries()) {
			const shape = props.schema.classes[label];
			const id = `n${i}`;
			for (const [j, key] of Object.keys(shape).entries()) {
				const edgeId = `e${i}-${j}`;
				const property = getProperty(shape[key]);
				const style = {
					label: key,
					curve: curveBasis,
					style: edgeStyles[property.cardinality || "required"],
				};
				let target = `n${i}-${j}`;
				if (typeof property === "string") {
					graph.setNode(target, {
						label: property,
						shape: "rect",
						style: nodeStyles.literal,
					});
				} else if (property.kind === "reference") {
					target = `n${labels.indexOf(property.label)}`;
				} else if (property.kind === "uri") {
					graph.setNode(target, { label: "", shape: "diamond", style: nodeStyles.uri });
				} else if (property.kind === "literal") {
					graph.setNode(target, {
						label: property.datatype,
						shape: "rect",
						style: nodeStyles.literal,
					});
				}
				graph.setEdge(id, target, style, edgeId);
			}
		}

		// Create the renderer
		const render = new dagreD3.render();
		const svg = select(element);
		const group = svg.select("g.graph");
		render(group, graph);
		const dimensions = graph.graph();

		group.attr("transform", "translate(20, 20)");
		const source = `<svg
version="1.1"
width="${dimensions.width + 40}"
height="${dimensions.height + 40}"
xmlns="http://www.w3.org/2000/svg"
>
${element.innerHTML}
</svg>`;
		const blob = new Blob([source], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		setSourceUrl(url);

		const svgWidth = parseFloat(svg.style("width"));
		if (dimensions.width + 40 > svgWidth) {
			const scale = svgWidth / (dimensions.width + 40);
			group.attr("transform", `scale(${scale}), translate(20, 20)`);
			const svgHeight = scale * (dimensions.height + 40);
			svg.attr("height", svgHeight);
		} else {
			group.attr("transform", "translate(20, 20)");
			svg.attr("height", dimensions.height + 40);
		}
		return () => URL.revokeObjectURL(url);
	}, [props.schema, element]);

	return (
		<Pane width="100%" position="relative" className={styles.graph}>
			<svg ref={elementRef}>
				<style>{SVGStyle}</style>
			</svg>
			{sourceUrl && (
				<IconButton
					className={styles.link}
					position="absolute"
					left={0}
					top={0}
					is="a"
					allowUnsafeHref={true}
					href={sourceUrl}
					target="_blank"
					icon={LinkIcon}
					appearance="minimal"
				/>
			)}
		</Pane>
	);
}
