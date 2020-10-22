import { GetServerSideProps } from "next";

export { Profile as default } from "components";

export const getServerSideProps: GetServerSideProps = async (context) => {
	console.log(context);
	const val = await new Promise((resolve) => {
		setTimeout(() => {
			resolve(10);
		}, 100);
	});
	return { props: { organizationData: { fish: val } } };
	// return { props: { serverSideNotFound: true } };
};
