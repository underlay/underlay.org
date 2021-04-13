import { Session } from "next-auth";

export interface PageData {
	session: Session | null;
}
