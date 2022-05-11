import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

import { mergeJsons } from "utils/server/versions";

const schema = [
	{
		id: "a747a976-332d-4f82-96ee-a3086e68b277",
		key: "Person",
		attributes: [
			{
				id: "6f470a36-cc83-426a-834c-1208d308c409",
				key: "name",
				type: "Text",
				isUnique: true,
				isOptional: false,
			},
			{
				id: "1234452-cc83-426a-834c-1208d308c409",
				key: "age",
				type: "Text",
				isUnique: false,
				isOptional: false,
			},
		],
	},
	{
		id: "c5bb7c5e-7ab6-4cbc-93e7-fd5b779084a1",
		key: "Location",
		attributes: [
			{
				id: "f1e41e7a-d57e-4c1e-816a-6cb1d610b125",
				key: "cityName",
				type: "Text",
				isUnique: false,
				isOptional: false,
			},
		],
	},
	{
		id: "27f5c1ae-1af0-4152-b613-08bcd6d47f70",
		key: "BornIn",
		attributes: [
			{
				id: "d7ecb2e2-0f93-47bf-aa7f-df54a41b6f29",
				key: "source",
				type: "a747a976-332d-4f82-96ee-a3086e68b277",
				isUnique: false,
				isOptional: false,
			},
			{
				id: "75d9bcc8-d57d-4d13-8c78-f1277cf308d9",
				key: "target",
				type: "c5bb7c5e-7ab6-4cbc-93e7-fd5b779084a1",
				isUnique: false,
				isOptional: false,
			},
			{
				id: "e6fd7312-1149-49d6-a132-f7ab4f595c8e",
				key: "year",
				type: "Number",
				isUnique: false,
				isOptional: false,
			},
		],
		isRelationship: true,
	},
];

const oldData = {
	Person: [
		{
			_ulid: "uuuA",
			_ulprov: "provA",
			name: "John",
			age: 13,
		},
		{
			_ulid: "uuuB",
			_ulprov: "provB",
			name: "Mary",
		},
	],
	Location: [
		{
			_ulid: "2a163a5c-5c3a-46db-9597-c096e3dd37bc",
			_ulprov: "d197a837-21ca-4bcb-8a16-429c218285e1",
			cityName: "Boston",
		},
		{
			_ulid: "5875aa36-1b7d-4ce3-b355-f2a52c38656c",
			_ulprov: "d197a837-21ca-4bcb-8a16-429c218285e1",
			cityName: "Austin",
		},
	],
	BornIn: [
		{
			_ulid: "uuuD",
			_ulprov: "provD",
			year: "1923",
			source: "37875e34-1f65-4954-bc1a-a6d89ef86ddf",
			target: "2a163a5c-5c3a-46db-9597-c096e3dd37bc",
		},
		{
			_ulid: "0bfcf890-781a-4aee-9569-fd9fac4184c9",
			_ulprov: "d197a837-21ca-4bcb-8a16-429c218285e1",
			year: "1955",
			source: "cf0ac1e4-f940-4b88-9871-60b42459ca8b",
			target: "5875aa36-1b7d-4ce3-b355-f2a52c38656c",
		},
	],
};
const newData = {
	Person: [
		{
			_ulid: "uuuAA",
			_ulprov: "provAA",
			name: "John",
			age: 27,
		},
		{
			_ulid: "uuuC",
			_ulprov: "provC",
			name: "Darren",
		},
	],
	BornIn: [
		{
			_ulid: "uuuuDD",
			_ulprov: "provDD",
			year: "1933",
			source: "37875e34-1f65-4954-bc1a-a6d89ef86ddf",
			target: "2a163a5c-5c3a-46db-9597-c096e3dd37bc",
		},
	],
};

export default nextConnect<NextApiRequest, NextApiResponse>().get(async (_req, res) => {
	const nextData = mergeJsons(schema, oldData, newData);
	return res.status(200).json(nextData);
});
