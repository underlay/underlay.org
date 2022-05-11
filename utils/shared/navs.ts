export const userNavItems = [
	{
		slug: "overview",
		title: "Overview",
	},
	{
		slug: "communities",
		title: "Communities",
	},
	{
		slug: "settings",
		title: "Settings",
	},
];

export const communityNavItems = [
	{
		slug: "overview",
		title: "Overview",
	},
	{
		slug: "members",
		title: "Members",
	},
	{
		slug: "settings",
		title: "Settings",
	},
];

export const collectionNavItems = [
	{
		slug: "overview",
		title: "Overview",
	},
	{
		slug: "schema",
		title: "Schema",
	},
	{
		slug: "data",
		title: "Data",
	},
	{
		slug: "discussions",
		title: "Discussions",
	},
	{
		slug: "exports",
		title: "Exports",
	},
	{
		slug: "settings",
		title: "Settings",
	},
];

export const forbiddenUserCreatedSlugs = [
	...userNavItems.map((x) => x.slug),
	...communityNavItems.map((x) => x.slug),
	...collectionNavItems.map((x) => x.slug),
	"about",
	"help",
];
