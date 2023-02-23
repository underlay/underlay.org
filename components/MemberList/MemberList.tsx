import { Button, InputGroup, Intent } from "@blueprintjs/core";
import { useRouter } from "next/router";
import { ExtendedCommunity } from "pages/[namespaceSlug]";
import React, { useState } from "react";
import { useLoginContext } from "utils/client/hooks";

import styles from "./MemberList.module.scss";

type Props = {
	community: NonNullable<ExtendedCommunity>;
	members: any[];
};

const MemberList: React.FC<Props> = function ({ community, members }) {
	const router = useRouter();
	const refreshData = () => {
		router.replace(router.asPath);
	};

	const loginData = useLoginContext();
	const communityOwnerIds = community.members
		.filter((m) => m.permission === "owner")
		.map((m) => m.userId);
	const isCommunityOwner = !!(loginData && communityOwnerIds.includes(loginData.id));

	const [isAddingMember, setIsAddingMember] = useState(false);
	const [isUpdatingMembership, setIsUpdatingMembership] = useState(false);

	const [userIdToAdd, setUserIdToAdd] = useState("");

	const addMember = async () => {
		setIsUpdatingMembership(true);

		const response = await fetch("/api/member", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				action: "ADD",
				communityId: community.id,
				communityOwnerIds,
				memberId: userIdToAdd,
			}),
		});

		if (response.ok) {
			setIsUpdatingMembership(false);
			setIsAddingMember(false);
			refreshData();
		}
	};

	const removeMember = async (membershipId: string) => {
		setIsUpdatingMembership(true);

		const response = await fetch("/api/member", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				action: "REMOVE",
				communityOwnerIds,
				membershipId,
			}),
		});

		if (response.ok) {
			setIsUpdatingMembership(false);
			setIsAddingMember(false);
			refreshData();
		}
	};

	return (
		<div>
			<table className={styles.table}>
				<thead>
					<tr>
						<th className={styles.header}>Name</th>
						<th className={styles.header}>About</th>
						<th className={styles.header}>Permission</th>
						{isCommunityOwner && <th className={styles.header}>Delete</th>}
					</tr>
				</thead>
				<tbody>
					{members.length === 0 && <div>No members</div>}
					{members.map((m) => {
						return (
							<tr key={m.id}>
								<td>{m.user.name}</td>
								<td>{m.user.about}</td>
								<td>{m.permission}</td>

								{isCommunityOwner && (
									<td>
										{m.permission !== "owner" && (
											<Button
												intent={Intent.DANGER}
												onClick={() => {
													removeMember(m.id);
												}}
											>
												Delete
											</Button>
										)}
									</td>
								)}
							</tr>
						);
					})}
					<tr>
						<td></td>
						<td></td>
						<td></td>
					</tr>
				</tbody>
			</table>
			{isCommunityOwner && (
				<div>
					{!isAddingMember && (
						<Button
							intent={Intent.SUCCESS}
							onClick={() => {
								setIsAddingMember(true);
							}}
						>
							Add a member
						</Button>
					)}
					{isAddingMember && (
						<div className={styles.memberIdInput}>
							<InputGroup
								id={"member-id"}
								value={userIdToAdd}
								size={30}
								onChange={(evt: any) => {
									setUserIdToAdd(evt.target.value);
								}}
								placeholder={"enter user id here"}
							/>
							<Button
								intent={Intent.SUCCESS}
								onClick={() => {
									setIsAddingMember(false);
									addMember();
								}}
								loading={isUpdatingMembership}
							>
								Add Member
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default MemberList;
