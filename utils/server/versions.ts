import { Input, prisma } from "@prisma/client";
import { getServerSupabase } from "./supabase";

export const updateDraftVersion = async (inputObject: Input, slugSuffix: string) => {
	/* Merge it with past values */
	/* TODO here! */
	// Load/check current draft.json
	// OutputData has the same shape as version files, and a version file is just a reduction
	// of all outputData blobs up to the point of a version publication.

	// For all entities of a given type, we have to compare the unqiueness attribute
	// (How do you specify whether multiple relationships are possible? i.e. you can't have more than one age, but you can have more than one child)
	// If the uniqueness matches, we want to {...} the two objects (stripping `_ulid` and concatting ulprov)
	// That doesn't seem too tough - just perhaps a bit unperformant for large sets
	// What abotu relationships can change?
	// Perhaps for relationships, the source and target define a uniqueness in the absence of
	// no other unique value.
	// Rel: WasInCity (Travis<>Boston) - I may have many, but unless there is some field
	// specifying how to differentiate (e.g. a date) - it doesn't carry a bunch of info?
	// Eh - I don't know about that... `source-target` does not necessarily imply unique
	// Maybe unique for relationships is different, they aren't enumerated the same way, they
	// have meaning outside of their source/target the way a Node does. When looking at 'unique'
	// fields on a relationship, we only compare within the set of other relationships.
	// If you don't want us to merge things into a single relatiosnhip value, you need to specify
	// at least one field as being unique (it's sorta inverted from uniqueness on nodes -
	// we merge everything unless there is unqiue, rather than only merging if unique matches )

	// and on importing, if you uimport the same file with just one value changes, you don't want
	// to produce duplicate relationships, so you ahve to assume they merge unless there is a
	// new unique field on one of the relationships

	/* 
		Iterate over jsons in outputData per Class
		For each, iterate over all existing Classes of same,
		Match based on unique fields (or relationship values)
		If no match, it's a new entity, so append
		If matched, take two jsons,
		keep earlier _ulid
		concat _ulprov with commas
		then merge newer over older
		append result
	*/

	/* Or - Naive thing to do is just overwrite draft */
	const supabase = getServerSupabase();
	const fileName = `draft.json`;
	const filepath = `${slugSuffix}/versions/${fileName}`;
	/* Overwrite the file on supabase */
	const { error } = await supabase.storage
		.from("data")
		.upload(filepath, JSON.stringify(inputObject.outputData));
	if (error) {
		throw error;
	}
	/* return success */
	return true;
};
