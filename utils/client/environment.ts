let environment: string;

/*
	The value of env originates from process.env.VERCEL_ENV which is documented here:
	https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables
*/
export const setEnv = (vercelEnv: string) => {
	environment = vercelEnv;
};

export const isProduction = () => {
	return environment === "production";
};
