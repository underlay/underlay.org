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

type Props = {
	id: string;
	fish: number;
};

const Owner = (props: Props) => {
	const { id } = props;
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
			{/* <Select
				className="single-select"
				classNamePrefix="react-select"
				options={[
					{ label: "Adelaide", value: "adelaide" },
					{ label: "Brisbane", value: "brisbane" },
					{ label: "Canberra", value: "canberra" },
					{ label: "Darwin", value: "darwin" },
					{ label: "Hobart", value: "hobart" },
					{ label: "Melbourne", value: "melbourne" },
					{ label: "Perth", value: "perth" },
					{ label: "Sydney", value: "sydney" },
				]}
				placeholder="Choose a City"
			/> */}
			<Button iconBefore={<Icon icon="edit" />} />
		</div>
	);
};

export default Owner;

// export const getServerSideProps: GetServerSideProps = async (context) => {
// 	const initData = await getInitData(context.req);
// 	return { props: { initData: initData } };
// };
