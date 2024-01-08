/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import("@/server/auth/lucia").Auth;
	type DatabaseUserAttributes = {
		full_name: string;
		email: string;
		is_verified: boolean;
	};
	type DatabaseSessionAttributes = {};
}
