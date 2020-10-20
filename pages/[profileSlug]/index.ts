import { GetServerSideProps } from "next";

export { default } from "components/Profile";

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
