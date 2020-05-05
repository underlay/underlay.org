import React from 'react';
import Html from 'server/Html';
import { renderToNodeStream, generateMetaComponents } from 'server/utils/ssr';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import app from 'server/server';

app.get('/*', async (req, res, next) => {
	try {
		res.status(404);
		const initialData = await getInitialData(req);
		return renderToNodeStream(
			res,
			<Html
				chunkName="NoMatch"
				initialData={initialData}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: `Not Found · R1`,
				})}
			/>,
		);
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});
