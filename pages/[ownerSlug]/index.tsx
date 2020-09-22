// import { GetServerSideProps } from "next";
// import { getInitData } from "pages/api/init";
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
import React from "react";
import Button from "@atlaskit/button";
import DropdownMenu, { DropdownItem, DropdownItemGroup } from "@atlaskit/dropdown-menu";
// import Select from '@atlaskit/select';
// import { Button } from "@blueprintjs/core";
import Icon from "components/Icon/Icon";

const Owner = () => {
	return (
		<div>
			In Owner Page
			<DropdownMenu trigger="Cities in Australia" triggerType="button">
				<DropdownItemGroup>
					<DropdownItem>Sydney</DropdownItem>
					<DropdownItem>Melbourne</DropdownItem>
					<DropdownItem>Adelaide</DropdownItem>
					<DropdownItem>Perth</DropdownItem>
				</DropdownItemGroup>
				<DropdownItemGroup>
					<DropdownItem>Sydney</DropdownItem>
					<DropdownItem>Melbourne</DropdownItem>
					<DropdownItem>Adelaide</DropdownItem>
					<DropdownItem>Perth</DropdownItem>
					<DropdownItem>Brisbane</DropdownItem>
					<DropdownItem>Canberra</DropdownItem>
					<DropdownItem>Hobart</DropdownItem>
					<DropdownItem>Darwin</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>
			<Button iconBefore={<Icon icon="edit" />} />
		</div>
	);
};

export default Owner;

// export const getServerSideProps: GetServerSideProps = async (context) => {
// 	const initData = await getInitData(context.req);
// 	return { props: { initData: initData } };
// };
