import { TokenManager } from "@/server/auth/token";

import { Navbar } from "../../nav-bar";
import { ResetPasswordForm } from "./reset-password-form";

const validateToken = async (token: string) => {
	let userId;

	try {
		userId = await TokenManager.validatePasswordResetToken(token);
	} catch (e) {
		throw new Error("Unknown error occured");
	}

	if (userId === undefined) {
		throw new Error("Token is either expired or invalid");
	}
};

export default async function Page({ params }: { params: { token: string } }) {
	await validateToken(params.token);
	return (
		<>
			<Navbar />
			<div className="relative flex pt-10 lg:pt-20 items-center justify-center mx-auto px-6 lg:px-0">
				<div className="flex w-full flex-col justify-center text-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col items-center space-y-2">
						<h2 className="text-2xl font-bold">Set new password</h2>
					</div>
					<p className="text-default-500">
						Please choose a new password containing a minimum of 8 characters.
					</p>
					<div className="pt-2">
						<ResetPasswordForm token={params.token} />
					</div>
				</div>
			</div>
		</>
	);
}
