import React, { ReactNode, FormEvent } from "react";
import classNames from "classnames";

import styles from "./Form.module.scss";

type Props = {
	className?: string;
	onSubmit?: (evt: FormEvent<EventTarget>) => any;
	children: ReactNode;
};

const Form: React.FC<Props> = function ({ className = "", onSubmit = () => {}, children }) {
	return (
		<form onSubmit={onSubmit} className={classNames(styles.form, className)}>
			{children}
		</form>
	);
};

export default Form;
