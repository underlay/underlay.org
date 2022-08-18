export default {
	title: "Underlay Docs",
	description: "Documentation for the Underlay project.",
	cleanUrls: "without-subfolders",
	head: [["link", { rel: "icon", href: "/favicon.svg" }]],
	themeConfig: {
		siteTitle: "Underlay Docs",
		logo: { light: "/logoLight.svg", dark: "/logoDark.svg" },
		nav: [{ text: "underlay.org", link: "https://www.underlay.org" }],
		sidebar: [
			{
				text: "About the Project",
				items: [
					{ text: "Introduction", link: "/" },
					{ text: "History", link: "/history" },
					{ text: "Protocol", link: "/protocol" },
					{ text: "Provenance", link: "/provenance" },
					{ text: "Federation", link: "/federation" },
					{ text: "Alpha Testing", link: "/alpha" },
				],
			},
			{
				text: "Namespaces",
				items: [
					{ text: "Introduction", link: "/namespaces" },
					{ text: "User Profiles", link: "/users" },
					{ text: "Communities", link: "/communities" },
				],
			},
			{
				text: "Collections",
				items: [
					{ text: "Introduction", link: "/collections" },
					{ text: "Versioning", link: "/versioning" },
					{ text: "Schemas", link: "/schemas" },
					{ text: "Data", link: "/data" },
					{ text: "Using Collections", link: "/using" },
					{ text: "Incentives", link: "/incentives" },
				],
			},
		],
		socialLinks: [{ icon: "github", link: "https://github.com/underlay/underlay.org" }],
	},
};
