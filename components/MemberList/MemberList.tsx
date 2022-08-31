import React from "react";

import styles from "./MemberList.module.scss";

type Props = {
	members: any[];
};

const MemberList: React.FC<Props> = function ({ members }) {
	return (
		<table className={styles.table}>
			<thead>
				<tr>
					<th className={styles.header}>Name</th>
					<th className={styles.header}>About</th>
					<th className={styles.header}>Email</th>
					<th className={styles.header}>Permission</th>
				</tr>
			</thead>
			<tbody>
				{members.length === 0 && <div>No members</div>}
				{members.length > 0 && (
					<tr>
						{members.map((m) => {
							return (
								<>
									<td>{m.user.name}</td>
									<td>{m.user.about}</td>
									<td>{m.user.email}</td>
									<td>{m.permission}</td>
								</>
							);
						})}
					</tr>
				)}
			</tbody>
		</table>
	);
};

export default MemberList;
