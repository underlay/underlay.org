import { resolve } from 'path';

export class HTTPStatusError extends Error {
	constructor(status, sourceError) {
		super(`HTTP Error ${status}${sourceError ? ': ' + sourceError.message : ''}`);
		this.status = status;
	}

	inRange(codeRange) {
		return this.status >= codeRange && this.status <= codeRange + 99;
	}
}

export class ForbiddenError extends HTTPStatusError {
	constructor(sourceError) {
		super(403, sourceError);
	}
}

export class NotFoundError extends HTTPStatusError {
	constructor(sourceError) {
		super(404, sourceError);
	}
}

export const handleErrors = (req, res, next) => {
	return (err) => {
		if (err instanceof HTTPStatusError) {
			if (err.inRange(400)) {
				return next();
			}
		}

		if (
			err.message === 'Page Not Found' ||
			err.message === 'Package Not Found' ||
			err.message === 'User Not Found' ||
			err.message === 'Namespace Not Found'
		) {
			return next();
		}
		console.error('Err', err);
		return res.status(500).sendFile(resolve(__dirname, '../errorPages/error.html'));
	};
};
