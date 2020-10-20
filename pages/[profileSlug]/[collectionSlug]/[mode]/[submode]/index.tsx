// import { GetServerSideProps } from "next";
// import { getInitData } from "pages/api/init";
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// import { Button } from '@blueprintjs/core';

const Submode = () => {
	return (
		<div>
			In Collection Submode Page
			
		</div>
	);
};

export default Submode;

// export const getServerSideProps: GetServerSideProps = async (context) => {
// 	const initData = await getInitData(context.req);
// 	const { ownerSlug, collectionSlug } = context.params;
// 	return { props: { initData: initData } };
// };
