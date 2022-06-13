import prisma from "prisma/db";

export const getNextSchemaVersion = async (collectionId: string) => {
	/* Schema versions are two digits long, x.y */
	/* Changes in y imply a mapping is possible */
	/* Changes in x imply a mapping is not possible */
	/* This allows all versions of a collection to correlate to the single schema */
	/* e.g. 2.3.1, 2.3.2, 2.3.3 all use schema 2.3 */

	/* TODO: Implementation
		Someday we will need to check whether the schema is a 
		minor update or major update. We'll have to pass in the nextSchema
		as well to do so. For now, we just increment the minor value.
	*/
	const collection = await prisma.collection.findUnique({
		where: { id: collectionId },
		select: { id: true, versions: { orderBy: { createdAt: "desc" } } },
	});
	if (!collection) {
		return null;
	}
	if (!collection.versions.length) {
		return "0.0";
	}
	const [major, minor] = collection.versions[0].number.split(".");
	return `${major}.${Number(minor) + 1}.0`;
};
