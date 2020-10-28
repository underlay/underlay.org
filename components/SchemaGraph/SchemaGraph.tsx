import React from "react";

import { select } from "d3-selection";
import { curveBasis } from "d3-shape";
import dagreD3 from "dagre-d3";
import graphlib from "graphlib";

import * as t from "io-ts";

import { TomlSchema, Datatype, Property } from "utils/shared/schemas/codec";

declare module "graphlib" {
	interface Graph {
		graph(): { width: number; height: number };
	}
}

const defaultWidth = 400;

const styles = {
	required: "stroke-width: 1.5px;",
	optional: "stroke: #333; fill: none; stroke-width: 1.5px; stroke-dasharray: 8, 3;",
	any: "stroke: #333; fill: none; stroke-width: 1.5px; stroke-dasharray: 3, 3;",
};

export interface SchemaGraphProps {
	schema: t.TypeOf<typeof TomlSchema>;
	width?: number;
}

const getProperty = (value: Datatype | Property): Property =>
	typeof value === "string" ? { kind: "literal", datatype: value } : value;

export default function Graph(props: SchemaGraphProps) {
	const width = props.width || defaultWidth;
	const handleRef = React.useCallback((element: SVGSVGElement) => {
		// Create the input graph
		const graph = new graphlib.Graph({ multigraph: true }).setGraph({});
		const labels = Object.keys(props.schema.classes);
		for (const [i, label] of labels.entries()) {
			const id = `n${i}`;
			graph.setNode(id, { label, shape: "circle" });
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
					style: styles[property.cardinality || "required"],
				};
				let target = `n${i}-${j}`;
				if (typeof property === "string") {
					graph.setNode(target, { label: property, shape: "rect" });
				} else if (property.kind === "reference") {
					target = `n${labels.indexOf(property.label)}`;
				} else if (property.kind === "uri") {
					graph.setNode(target, { label: "", shape: "diamond" });
				} else if (property.kind === "literal") {
					graph.setNode(target, {
						label: property.datatype,
						shape: "rect",
					});
				}
				graph.setEdge(id, target, style, edgeId);
			}
		}

		// Create the renderer
		const render = new dagreD3.render();
		const svg = select(element);
		const group = svg.append("g");
		render(group, graph);
		const dimensions = graph.graph();
		const offset = (width - dimensions.width) / 2;
		group.attr("transform", "translate(" + offset + ", 20)");
		svg.attr("height", dimensions.height + 40);
	}, []);

	return (
		<svg width={width} ref={handleRef}>
			<style>{`text {
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
			}`}</style>
		</svg>
	);
}
