import React from "react";

import {
	CollectionHeader,
	CollectionOverviewSide,
	DataExport,
	DataUpload,
	Section,
	ThreeColumnFrame,
} from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";
import { getNextVersion } from "utils/shared/version";
import { useLocationContext } from "utils/client/hooks";

const CollectionData: React.FC<CollectionProps> = function ({ collection }) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;

	return (
		<div>
			<CollectionHeader mode="data" collection={collection} />
			<ThreeColumnFrame
				content={
					<div>
						<Section title="Select Data to Import">
							<DataUpload
								onComplete={({ url: _url, bytes }) => {
									fetch("/api/collection", {
										method: "PATCH",
										headers: { "Content-Type": "application/json" },
										body: JSON.stringify({
											...collection,
											version: getNextVersion(collection.version || ""),
											publishedAt: new Date(),
											publishedDataSize: bytes,
										}),
									});
								}}
								fullSlug={`${namespaceSlug}/${collectionSlug}`}
								version={collection.version || ""}
							/>
						</Section>
						<Section title="Exports">
							<DataExport collection={collection} />
						</Section>
					</div>
				}
				sideContent={<CollectionOverviewSide collection={collection} />}
			/>
		</div>
	);
};

export default CollectionData;
export const getServerSideProps = getCollectionProps;
