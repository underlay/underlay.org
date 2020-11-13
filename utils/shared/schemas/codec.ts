import * as t from "io-ts";

import { xsd } from "n3.ts/lib/IRIs.js";
import { APG } from "@underlay/apg"; // Only for types
import * as ns from "@underlay/apg/lib/namespace.js";
import { isRelationalSchema, relationalSchema } from "@underlay/apg/lib/codecs/relational.js";

export const datatype = t.union([
	t.literal("string"),
	t.literal("integer"),
	t.literal("double"),
	t.literal("boolean"),
	t.literal("date"),
	t.literal("dateTime"),
	t.literal("hexBinary"),
	t.literal("base64Binary"),
]);

export type Datatype = t.TypeOf<typeof datatype>;

export const type = t.union([
	t.type({ kind: t.literal("reference"), label: t.string }),
	t.type({
		kind: t.literal("literal"),
		datatype: datatype,
	}),
	t.type({ kind: t.literal("uri") }),
]);

export type Type = t.TypeOf<typeof type>;

export const property = t.intersection([
	type,
	t.partial({
		cardinality: t.union([t.literal("required"), t.literal("optional"), t.literal("any")]),
	}),
]);

export type Property = t.TypeOf<typeof property>;

const codec = t.type({
	namespace: t.string,
	classes: t.record(t.string, t.record(t.string, t.union([datatype, property]))),
});

const namespacePattern = /^[a-z0-9]+:(?:\/[A-Za-z0-9-._:]*)+\/$/;
const propertyPattern = /^[a-z0-9]+:(?:\/[A-Za-z0-9-._:]*)*[A-Za-z0-9-._:]+(?:\/|#)[A-Za-z0-9-._]+$/;

const schemaKeys = new Set(["classes", "namespace"]);

export const TomlSchema = new t.Type<t.TypeOf<typeof codec>, t.TypeOf<typeof relationalSchema>>(
	"TomlSchema",
	codec.is,
	(input, context) => {
		const result = codec.validate(input, context);
		if (result._tag === "Left") {
			return result;
		}

		for (const key of Object.keys(result.right)) {
			if (schemaKeys.has(key)) {
				continue;
			} else {
				return t.failure(input, context, `Extraneous top-level key: ${key}`);
			}
		}

		const { namespace, classes } = result.right;

		if (namespacePattern.test(namespace) === false) {
			return t.failure(
				input,
				t.appendContext(context, "namespace", codec),
				`Invalid namespace string: ${namespace}`
			);
		}

		const labels = Object.keys(classes);
		for (const label of labels) {
			const key = label.includes(":") ? label : namespace + label;
			if (propertyPattern.test(key) === false) {
				return t.failure(label, context, `Invalid label URI: ${key}`);
			}
			const shape = classes[label];
			const properties = Object.keys(shape);
			for (const property of properties) {
				const key = property.includes(":") ? property : namespace + property;
				if (propertyPattern.test(key) === false) {
					return t.failure(
						property,
						t.appendContext(context, `classes/${label}/${property}`, codec),
						`Invalid property URI: ${key}`
					);
				}
				const value = shape[property];
				if (typeof value !== "string") {
					const keys = new Set(Object.keys(value));
					keys.delete("kind");
					keys.delete("cardinality");
					if (value.kind === "reference") {
						keys.delete("label");
						if (labels.includes(value.label) === false) {
							return t.failure(
								value,
								t.appendContext(context, `classes/${label}/${property}`, codec),
								`Invalid reference label: class ${value.label} does not exist`
							);
						}
					} else if (value.kind === "uri") {
					} else if (value.kind === "literal") {
						keys.delete("datatype");
					}
					if (keys.size > 0) {
						return t.failure(
							value,
							t.appendContext(context, `classes/${label}/${property}`, codec),
							`Extraneous property keys: ${Array.from(keys).join(", ")}`
						);
					}
				}
			}
		}
		return result;
	},
	(input): t.TypeOf<typeof relationalSchema> => {
		const labelKeys: string[] = [];
		for (const label of Object.keys(input.classes)) {
			const key = label.includes(":") ? label : input.namespace + label;
			labelKeys.push(key);
			const shape = input.classes[label];
			for (const property of Object.keys(shape)) {
				const value = shape[property];
				if (typeof value !== "string" && value.cardinality === "any") {
					labelKeys.push(property.includes(":") ? property : `${key}/${property}`);
				}
			}
		}
		labelKeys.sort();
		const schema: APG.Schema = new Array(labelKeys.length);
		for (const label of Object.keys(input.classes)) {
			const labelKey = label.includes(":") ? label : input.namespace + label;
			const shape = input.classes[label];
			const propertyLabels = new Map<string, string>(
				Object.keys(shape)
					.map((property): [string, string] => [
						property,
						property.includes(":") ? property : `${labelKey}/${property}`,
					])
					.sort(([{}, a], [{}, b]) => (a < b ? -1 : b < a ? 1 : 0))
			);
			if (propertyLabels.size === 0) {
				const value: APG.Unit = Object.freeze({ type: "unit" });
				schema.push(Object.freeze({ type: "label", key: label, value }));
			} else {
				const components: APG.Component[] = [];
				for (const [propertyLabel, propertyKey] of propertyLabels) {
					const property = shape[propertyLabel];
					if (typeof property === "string") {
						const literal: APG.Literal = Object.freeze({
							type: "literal",
							datatype: xsd[property],
						});
						components.push(
							Object.freeze({
								type: "component",
								key: propertyKey,
								value: literal,
							})
						);
					} else {
						const value = parseValue(property, input.namespace, labelKeys);
						if (
							property.cardinality === undefined ||
							property.cardinality === "required"
						) {
							components.push(
								Object.freeze({ type: "component", key: propertyKey, value })
							);
						} else if (property.cardinality === "optional") {
							const unit: APG.Unit = Object.freeze({ type: "unit" });
							const options: APG.Option[] = [
								Object.freeze({ type: "option", key: ns.none, value: unit }),
								Object.freeze({ type: "option", key: ns.some, value }),
							];
							Object.freeze(options);
							const coproduct: APG.Coproduct = { type: "coproduct", options };
							Object.freeze(coproduct);
							components.push(
								Object.freeze({
									type: "component",
									key: propertyKey,
									value: coproduct,
								})
							);
						} else if (property.cardinality === "any") {
							const propertyIndex = labelKeys.indexOf(propertyKey);
							if (propertyIndex === -1) {
								throw new Error("Property label index not found");
							}
							const sourceIndex = labelKeys.indexOf(labelKey);
							if (sourceIndex === -1) {
								throw new Error("Source label index not found");
							}
							const reference: APG.Reference = Object.freeze({
								type: "reference",
								value: sourceIndex,
							});
							const propertyComponents: APG.Component[] = [
								Object.freeze({
									type: "component",
									key: ns.source,
									value: reference,
								}),
								Object.freeze({
									type: "component",
									key: ns.target,
									value: value,
								}),
							];
							Object.freeze(propertyComponents);
							const product: APG.Product = Object.freeze({
								type: "product",
								components: propertyComponents,
							});
							schema[propertyIndex] = Object.freeze({
								type: "label",
								key: propertyKey,
								value: product,
							});
						}
					}
				}

				const index = labelKeys.indexOf(labelKey);
				if (components.length === 0) {
					const unit: APG.Unit = Object.freeze({ type: "unit" });
					schema[index] = Object.freeze({
						type: "label",
						key: labelKey,
						value: unit,
					});
				} else {
					Object.freeze(components);
					const product: APG.Product = { type: "product", components };
					Object.freeze(product);
					schema[index] = Object.freeze({
						type: "label",
						key: labelKey,
						value: product,
					});
				}
			}
		}
		Object.freeze(schema);
		if (isRelationalSchema(schema)) {
			return schema;
		} else {
			throw new Error("Internal schema construction failure");
		}
	}
);

function parseValue(
	value: t.TypeOf<typeof type>,
	namespace: string,
	labelKeys: string[]
): APG.Reference | APG.Literal | APG.Iri {
	if (value.kind === "literal") {
		return Object.freeze({
			type: "literal",
			datatype: xsd[value.datatype],
		});
	} else if (value.kind === "reference") {
		const labelKey = value.label.includes(":") ? value.label : namespace + value.label;
		const labelIndex = labelKeys.indexOf(labelKey);
		if (labelIndex === -1) {
			throw new Error("Reference label index not found");
		}
		return Object.freeze({ type: "reference", value: labelIndex });
	} else if (value.kind === "uri") {
		return Object.freeze({ type: "iri" });
	} else {
		throw new Error("Invalid type");
	}
}
