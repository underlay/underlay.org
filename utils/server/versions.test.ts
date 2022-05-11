import { concatJsons, overwriteJsons, mergeJsons } from "./versions";

// prettier-ignore
const schema = [
	{
		id: "s1",
		key: "Person",
		attributes: [
			{ id: "s2", key: "name", type: "Text", isUnique: true, isOptional: false },
			{ id: "s3", key: "age", type: "Text", isUnique: false, isOptional: false },
		],
	},
	{
		id: "s4",
		key: "Location",
		attributes: [
			{ id: "s5", key: "cityName", type: "Text", isUnique: true, isOptional: false },
		],
	},
	{
		id: "s6",
		key: "BornIn",
		isRelationship: true,
		attributes: [
			{ id: "s7", key: "source", type: "s1", isUnique: false, isOptional: false },
			{ id: "s8", key: "target", type: "s4", isUnique: false, isOptional: false },
			{ id: "s9", key: "year", type: "Number", isUnique: false, isOptional: false },
		],
		
	},
];

type BornIn = {
	_ulid: string;
	_ulprov: string;
	year: string;
	source: string;
	target: string;
	manualId?: string;
};
type Data = {
	Person: any[];
	Location: any[];
	BornIn: BornIn[];
};
// prettier-ignore
const data1: Data = {
	Person: [
		{ _ulid: "idA", _ulprov: "provA", name: "John", age: 13 },
		{ _ulid: "idB", _ulprov: "provA", name: "Mary" },
	],
	Location: [
		{ _ulid: "idC", _ulprov: "provA", cityName: "Boston" },
		{ _ulid: "idD", _ulprov: "provA", cityName: "Austin" },
	],
	BornIn: [
		{ _ulid: "idE", _ulprov: "provA", year: "1923", source: "idA", target: "idC" },
		{ _ulid: "idF", _ulprov: "provA", year: "1955", source: "idB", target: "idD" },
	],
};

// prettier-ignore
const data2: Data = {
	Person: [
		{ _ulid: "idG", _ulprov: "provB", name: "John", age: 27 },
		{ _ulid: "idL", _ulprov: "provB", name: "Mary" },
		{ _ulid: "idH", _ulprov: "provB", name: "Darren" },
	],
	Location: [
		{ _ulid: "idJ", _ulprov: "provB", cityName: "Boston" },
		{ _ulid: "idM", _ulprov: "provB", cityName: "Austin" },
	],
	BornIn: [
		{ _ulid: "idI", _ulprov: "provB", year: "1987", source: "idG", target: "idJ" },
		{ _ulid: "idN", _ulprov: "provB", year: "1955", source: "idL", target: "idM" },
		{ _ulid: "idK", _ulprov: "provB", year: "1933", source: "idH", target: "idJ" },
	],
};

test("concat", () => {
	const nextData = concatJsons(schema, data1, data2);
	// prettier-ignore
	expect(nextData).toEqual({
		Person: [
			{ _ulid: "idA", _ulprov: "provA", name: "John", age: 13 },
			{ _ulid: "idB", _ulprov: "provA", name: "Mary" },
			{ _ulid: "idG", _ulprov: "provB", name: "John", age: 27 },
			{ _ulid: "idL", _ulprov: "provB", name: "Mary" },
			{ _ulid: "idH", _ulprov: "provB", name: "Darren" },
		],
		Location: [
			{ _ulid: "idC", _ulprov: "provA", cityName: "Boston" },
			{ _ulid: "idD", _ulprov: "provA", cityName: "Austin" },
			{ _ulid: "idJ", _ulprov: "provB", cityName: "Boston" },
			{ _ulid: "idM", _ulprov: "provB", cityName: "Austin" },
		],
		BornIn: [
			{ _ulid: "idE", _ulprov: "provA", year: "1923", source: "idA", target: "idC" },
			{ _ulid: "idF", _ulprov: "provA", year: "1955", source: "idB", target: "idD" },
			{ _ulid: "idI", _ulprov: "provB", year: "1987", source: "idG", target: "idJ" },
			{ _ulid: "idN", _ulprov: "provB", year: "1955", source: "idL", target: "idM" },
			{ _ulid: "idK", _ulprov: "provB", year: "1933", source: "idH", target: "idJ" },
		],
	})
});

test("overwrite", () => {
	const nextData = overwriteJsons(schema, data1, data2);
	expect(nextData).toEqual(data2);
});

test("merge", () => {
	/* This tests:
		- adding nodes (add idH)
		- overwriting values in existing nodes (update idA to age=27)
		- adding relationships (add idK)
		- including unchanged nodes does not append prov
		- overwriting values in relationships (update idE to year=1987)
		- persisting ids
		- building prov 
	*/
	const nextData = mergeJsons(schema, data1, data2);
	// prettier-ignore
	expect(nextData).toEqual({
		Person: [
			{ _ulid: "idA", _ulprov: "provA,provB", name: "John", age: 27 },
			{ _ulid: "idB", _ulprov: "provA", name: "Mary" },
			{ _ulid: "idH", _ulprov: "provB", name: "Darren" },
		],
		Location: [
			{ _ulid: "idC", _ulprov: "provA", cityName: "Boston" },
			{ _ulid: "idD", _ulprov: "provA", cityName: "Austin" },
		],
		BornIn: [
			{ _ulid: "idE", _ulprov: "provA,provB", year: "1987", source: "idA", target: "idC" },
			{ _ulid: "idF", _ulprov: "provA", year: "1955", source: "idB", target: "idD" },
			{ _ulid: "idK", _ulprov: "provB", year: "1933", source: "idH", target: "idC" },
		],
	})
});

test("merge - relationship with unique", () => {
	/* This tests:
		- relationships with unique feel are not merges
	*/
	const schemaRel = [...schema];
	// prettier-ignore
	schemaRel[2].attributes.push({ id: "s10", key: "manualId", type: "Number", isUnique: true, isOptional: false });

	const data1Rel = { ...data1 };
	data1Rel.BornIn[0].manualId = "0";
	data1Rel.BornIn[1].manualId = "1";

	const data2Rel = { ...data2 };
	data2Rel.BornIn[0].manualId = "5";
	data2Rel.BornIn[1].manualId = "1";
	data2Rel.BornIn[2].manualId = "3";

	const nextData = mergeJsons(schemaRel, data1Rel, data2Rel);
	// prettier-ignore
	expect(nextData).toEqual({
		Person: [
			{ _ulid: "idA", _ulprov: "provA,provB", name: "John", age: 27 },
			{ _ulid: "idB", _ulprov: "provA", name: "Mary" },
			{ _ulid: "idH", _ulprov: "provB", name: "Darren" },
		],
		Location: [
			{ _ulid: "idC", _ulprov: "provA", cityName: "Boston" },
			{ _ulid: "idD", _ulprov: "provA", cityName: "Austin" },
		],
		BornIn: [
			{ _ulid: "idE", _ulprov: "provA", year: "1923", manualId: '0', source: "idA", target: "idC" },
			{ _ulid: "idF", _ulprov: "provA", year: "1955", manualId: '1', source: "idB", target: "idD" },
			{ _ulid: "idI", _ulprov: "provB", year: "1987", manualId: '5', source: "idA", target: "idC" },
			{ _ulid: "idK", _ulprov: "provB", year: "1933", manualId: '3', source: "idH", target: "idC" },
		],
	})
});
