// import { GetServerSideProps } from "next";
// import { getInitData } from "pages/api/init";
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// import { Button } from '@blueprintjs/core';
import Button from "@atlaskit/button"

const Collection = () => {
	return (
		<div>
			In Collection Page
			<Button />
		</div>
	);
};

export default Collection;

// export const getServerSideProps: GetServerSideProps = async (context) => {
// 	const initData = await getInitData(context.req);
// 	const { ownerSlug, collectionSlug } = context.params;
// 	return { props: { initData: initData } };
// };
