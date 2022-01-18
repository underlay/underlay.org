export interface Entity {
	id: string;
	source?: string;
	[prop: string]: any;
}

export type FieldType = "string" | "boolean" | "number";
export interface Field {
	id: string;
	namespace: string;
	type: FieldType;
	isRequired: boolean;
	allowMultiple: boolean;
}

export interface Node {
	id: string;
	namespace: string;
	fields: Field[];
}

export const entities: { [key: string]: Entity[] } = {
	Person: [
		{ id: "p0", name: "Carmen Peterson", age: "28" },
		{ id: "p1", name: "Alice Owens", age: "64" },
		{ id: "p2", name: "Zoey Lawson", age: "22" },
		{ id: "p3", name: "Eli Grant", age: "73" },
		{ id: "p4", name: "Jerry Austin", age: "44" },
	],
	Institution: [
		{ id: "i0", name: "Carnegie Mellon University", location: "Pennsylvania" },
		{ id: "i1", name: "MIT", location: "Massachusetts" },
		{ id: "i2", name: "Brisbane University", location: "Queensland" },
		{ id: "i3", name: "Boston University", location: "Massachusetts" },
		{ id: "i4", name: "University of Vermont", location: "Vermont" },
		{ id: "i5", name: "Michigan State University", location: "Michigan" },
	],
	Publication: [
		{ id: "pub0", title: "New Tables that are also Periodic", doi: "10.3294/new-tables" },
		{
			id: "pub1",
			title: "United States pharmacopeia safety evaluation of Spirulina",
			doi: "10.3294/124124-1255",
		},
		{ id: "pub2", title: "The biology of the laboratory rabbit", doi: "10.3294/rabbit1241" },
		{
			id: "pub3",
			title: "Preparation and study of fragments of single rabbit nephrons",
			doi: "10.3294/single-nephron113-2",
		},
		{ id: "pub4", title: "Biology of the Cyclostomes", doi: "10.3294/v1/2944j" },
		{ id: "pub5", title: "The biology of eucalypts", doi: "10.3294/bio-euc" },
		{ id: "pub6", title: "The biology of mycorrhiza", doi: "10.3294/bio-myc" },
	],
	gotDegreeFrom: [
		{ id: "gdf0", source: "p0", target: "i0", year: "2002" },
		{ id: "gdf1", source: "p0", target: "i1", year: "1996" },
		{ id: "gdf2", source: "p1", target: "i2", year: "2008" },
		{ id: "gdf3", source: "p2", target: "i2", year: "2010" },
		{ id: "gdf4", source: "p3", target: "i3", year: "2000" },
		{ id: "gdf4", source: "p3", target: "i4", year: "1976" },
		{ id: "gdf5", source: "p3", target: "i5", year: "1983" },
		{ id: "gdf6", source: "p4", target: "i4", year: "1990" },
		{ id: "gdf7", source: "p4", target: "i3", year: "2018" },
	],
	authored: [
		{ id: "a0", source: "p0", target: "pub0" },
		{ id: "a1", source: "p0", target: "pub1" },
		{ id: "a2", source: "p0", target: "pub2" },
		{ id: "a3", source: "p1", target: "pub1" },
		{ id: "a4", source: "p2", target: "pub2" },
		{ id: "a5", source: "p3", target: "pub3" },
		{ id: "a6", source: "p4", target: "pub4" },
		{ id: "a7", source: "p1", target: "pub5" },
		{ id: "a8", source: "p2", target: "pub6" },
		{ id: "a9", source: "p3", target: "pub5" },
		{ id: "a10", source: "p0", target: "pub4" },
		{ id: "a11", source: "p4", target: "pub3" },
	],
	employedAt: [
		{ id: "e0", source: "p0", target: "i0", startYear: "2002", endYear: "2007" },
		{ id: "e1", source: "p0", target: "i1", startYear: "1996", endYear: "1997" },
		{ id: "e2", source: "p1", target: "i2", startYear: "2008", endYear: "" },
		{ id: "e3", source: "p1", target: "i3", startYear: "2010", endYear: "2018" },
		{ id: "e4", source: "p2", target: "i4", startYear: "2000", endYear: "2005" },
		{ id: "e5", source: "p3", target: "i3", startYear: "1966", endYear: "1973" },
		{ id: "e6", source: "p4", target: "i2", startYear: "1990", endYear: "1999" },
		{ id: "e7", source: "p4", target: "i0", startYear: "2018", endYear: "" },
	],
};

export const nodes: Node[] = [
	{
		id: "Person",
		namespace: "./",
		fields: [
			{
				id: "name",
				namespace: "schema.org/Person/",
				type: "string",
				isRequired: true,
				allowMultiple: false,
			},
			{
				id: "age",
				namespace: "schema.org/Person/",
				type: "string",
				isRequired: false,
				allowMultiple: false,
			},
		],
	},
	{
		id: "Institution",
		namespace: "./",
		fields: [
			{
				id: "name",
				namespace: "schema.org/Organization/",
				type: "string",
				isRequired: true,
				allowMultiple: false,
			},
			{
				id: "location",
				namespace: "schema.org/Organization/",
				type: "string",
				isRequired: false,
				allowMultiple: false,
			},
		],
	},
	{
		id: "Publication",
		namespace: "./",
		fields: [
			{
				id: "title",
				namespace: "schema.org/Publication/",
				type: "string",
				isRequired: true,
				allowMultiple: false,
			},
			{
				id: "doi",
				namespace: "schema.org/Publication/",
				type: "string",
				isRequired: false,
				allowMultiple: false,
			},
		],
	},
];

export const relationships: Node[] = [
	{
		id: "gotDegreeFrom",
		namespace: "./",
		fields: [
			{
				id: "source",
				namespace: "ul.org/",
				type: "string",
				isRequired: true,
				allowMultiple: false,
			},
			{
				id: "target",
				namespace: "ul.org/",
				type: "string",
				isRequired: true,
				allowMultiple: false,
			},
			{
				id: "year",
				namespace: "schema.org/time/",
				type: "number",
				isRequired: false,
				allowMultiple: false,
			},
		],
	},
	{
		id: "authored",
		namespace: "./",
		fields: [
			{
				id: "source",
				namespace: "ul.org/",
				type: "string",
				isRequired: true,
				allowMultiple: false,
			},
			{
				id: "target",
				namespace: "ul.org/",
				type: "string",
				isRequired: true,
				allowMultiple: false,
			},
		],
	},
	{
		id: "employedAt",
		namespace: "./",
		fields: [
			{
				id: "source",
				namespace: "ul.org/",
				type: "string",
				isRequired: true,
				allowMultiple: false,
			},
			{
				id: "target",
				namespace: "ul.org/",
				type: "string",
				isRequired: true,
				allowMultiple: false,
			},
			{
				id: "startYear",
				namespace: "schema.org/time/",
				type: "number",
				isRequired: false,
				allowMultiple: false,
			},
			{
				id: "endYear",
				namespace: "schema.org/time/",
				type: "number",
				isRequired: false,
				allowMultiple: false,
			},
		],
	},
];
