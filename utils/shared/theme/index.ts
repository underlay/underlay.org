import { classicTheme, Theme } from "evergreen-ui";

declare module "evergreen-ui" {
	type ComponentPropGetter = (theme: Theme, props: {}) => number | string;
	type ComponentProp = number | string | ComponentPropGetter;
	type ComponentProps = Record<string, ComponentProp | Record<string, ComponentProp>>;
	interface Component {
		baseStyle: ComponentProps;
		appearances: Record<string, ComponentProps>;
		sizes: ComponentProps;
	}

	interface Theme {
		components: Record<string, Component>;
		colors: {
			muted: string;
			default: string;
			dark: string;
			selected: string;
			tint1: string;
			tint2: string;
			overlay: string;
			yellowTint: string;
			greenTint: string;
			orangeTint: string;
			redTint: string;
			blueTint: string;
			purpleTint: string;
			tealTint: string;
			border: {
				default: string;
				muted: string;
			};
			text: {
				success: string;
				info: string;
				danger: string;
			};
			icon: {
				default: string;
				muted: string;
				disabled: string;
				selected: string;
			};
		};
		fontFamilies: {
			display: string;
			mono: string;
			ui: string;
		};
		fontSizes: {
			body: string;
			heading: string;
			caption: string;
		};
		fontWeights: {
			light: number;
			normal: number;
			semibold: number;
			bold: number;
		};
	}
}

export const theme: Theme = {
	...classicTheme,
	colors: {
		...classicTheme.colors,
		default: "#333",
		dark: "#333",
		border: { default: "darkgray", muted: "lightgrey" },
		tint1: "whitesmoke",
	},
	components: {
		...classicTheme.components,
		Avatar: {
			...classicTheme.components.Avatar,
			baseStyle: {
				...classicTheme.components.Avatar.baseStyle,
				color: "white",
				backgroundColor: "#D3C9BD",
				borderRadius: 3,
			},
		},
		Button: {
			...classicTheme.components.Button,
			appearances: {
				...classicTheme.components.Button.appearances,
				minimal: {
					...classicTheme.components.Button.appearances.minimal,
					color: ({ colors }) => colors.default,
				},
			},
		},
	},
};
