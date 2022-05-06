import prisma from "prisma/db";

export const getNextSchemaVersion = async (collectionId: string) => {
	/* TODO: Implementation
		Someday we will need to check whether the schema is a 
		minor update or major update. We'll have to pass in the nextSchema
		as well to do so. For now, we just increment the minor value.
	*/
	const collection = await prisma.collection.findUnique({
		where: { id: collectionId },
		select: { id: true, version: true },
	});
	if (!collection) {
		return null;
	}
	if (!collection.version) {
		return "0.0.0";
	}
	if (collection.version === "0.0.0") {
		return "0.0.0";
	}
	const [major, minor] = collection.version.split(".");
	return `${major}.${Number(minor) + 1}.0`;
};
