import React from "react";

import { CollectionSearchResultBlock } from "components";

import styles from "./SearchResultList.module.scss";
import { Collection } from "@prisma/client";

type Props = {
	collections: Collection[];
  queryString: string;
};

const SearchResultList: React.FC<Props> = function ({ collections, queryString }) {
	return (
		<div className={styles.list}>
			{collections.length > 0 &&
				collections.map((collection) => {
					return (
						<CollectionSearchResultBlock
							key={collection.id}
							collection={collection as any}
							queryString={queryString}
						/>
					);
				})}
		</div>
	);
};

export default SearchResultList;
