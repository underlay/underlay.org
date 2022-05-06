import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";
import https from "https";
import { parse } from "csv-parse";

export default nextConnect<NextApiRequest, NextApiResponse>().get(async (_req, res) => {
	const source = await prisma.sourceCsv.findUnique({
		where: { id: "85de9037-bb66-4f92-9d40-9909dfa6fb33" },
		include: {
			input: { include: { schema: true } },
		},
	});
	if (!source) {
		return res.status(200).json("Dang");
	}
	const schema = source.input[0].schema.content;
	const mapping = source.mapping;
	const csvUri = source.fileUri;

	const records: any = [];
	https.get(csvUri, async (stream) => {
		const parser = stream.pipe(
			parse({
				columns: true,
				trim: true,
			})
		);
		for await (const record of parser) {
			/* 
			On each row, we can 1) generate entities, 2) generate relationships
			We need to:
				- Know which entities to generate
				- Create those
				- Know which entities have a relationship in a row
					- Check which nodes have mappings and have a relationship type that specifies them	
			*/

			records.push(record);
		}

		return res.status(200).json({ records, schema, mapping });
	});
});
