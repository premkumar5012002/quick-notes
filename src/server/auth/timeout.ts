import { redis } from "@/lib/redis";

export class TimeoutManager {
	public static async manageLoginTimeout(email: string): Promise<boolean> {
		const id = `timeout:login:${email}`;

		const attempts = await redis.incr(id);

		if (attempts === 1) {
			await redis.expire(id, 300);
		}

		return attempts > 4;
	}

	public static async manageEmailVerificationTimeout(
		userId: string
	): Promise<boolean> {
		const id = `timeout:email:${userId}`;

		const attempts = await redis.incr(id);

		if (attempts === 1) {
			await redis.expire(id, 120);
		}

		return attempts > 1;
	}

	public static async managePasswordResetTimeout(
		email: string
	): Promise<boolean> {
		const id = `timeout:password:${email}`;

		const attempts = await redis.incr(id);

		if (attempts === 1) {
			await redis.expire(id, 120);
		}

		return attempts > 1;
	}
}
