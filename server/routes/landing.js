import React from 'react';
import Html from 'server/Html';
import { renderToNodeStream, generateMetaComponents } from 'server/utils/ssr';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import app from 'server/server';

app.get('/', async (req, res, next) => {
	try {
		const initialData = await getInitialData(req);
		return renderToNodeStream(
			res,
			<Html
				chunkName="Landing"
				initialData={initialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: 'R1',
					description: 'Underlay Registry #1',
				})}
			/>,
		);
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});
