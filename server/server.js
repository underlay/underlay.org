import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import enforce from 'express-sslify';
import noSlash from 'no-slash';
import { HTTPStatusError } from 'server/utils/errors';

require('server/utils/serverModuleOverwrite');

/* ---------------------- */
/* Initialize express app */
/* ---------------------- */
const app = express();
export default app;

if (process.env.NODE_ENV === 'production') {
	app.use(enforce.HTTPS({ trustProtoHeader: true }));
}
app.use(noSlash());
app.use(compression());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

/* ------------ */
/* Handle Error */
/* ------------ */
app.use((err, req, res, next) => {
	const errStatus = err instanceof HTTPStatusError ? err.status : 500;
	if (!res.headersSent) {
		res.status(errStatus);
	}
	console.error(`Error!  ${err}`);
	next();
});

/* ---------------- */
/* Server Endpoints */
/* ---------------- */
app.use('/dist', [cors(), express.static('dist')]);
app.use('/static', express.static('static'));
app.use('/favicon.png', express.static('static/favicon.png'));
app.use('/favicon.ico', express.static('static/favicon.png'));
app.use('/robots.txt', express.static('static/robots.txt'));

/* ------------- */
/* Import Routes */
/* ------------- */
require('./routes');

/* ------------ */
/* Start Server */
/* ------------ */
const port = process.env.PORT || 9876;
export const startServer = () => {
	return app.listen(port, (err) => {
		if (err) {
			console.error(err);
		}
		console.info('----\n==> 🌎  API is running on port %s', port);
		console.info('==> 💻  Send requests to http://localhost:%s', port);
	});
};
