export const userNavItems = [
	{
		slug: "overview",
		title: "Overview",
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
		slug: "people",
		title: "People",
	},
	{
		slug: "discussions",
		title: "Discussions",
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
		slug: "versions",
		title: "Versions",
	},
	{
		slug: "discussions",
		title: "Discussions",
	},
	{
		slug: "connections",
		title: "Connections",
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
