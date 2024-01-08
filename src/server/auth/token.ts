import { generateRandomString } from "lucia/utils";

import { redis } from "@/lib/redis";

export class TokenManager {
	private static readonly EXPIRES_IN = 60 * 60 * 2; // 2 hours in seconds

	// Generate Tokens
	public static async generateDeviceToken(email: string): Promise<string> {
		const token = generateRandomString(64);
		await redis.hset(`token:device:${token}`, {
			email,
			attempts: "0",
		});
		return token;
	}

	public static async generateEmailVerificationToken(
		userId: string
	): Promise<string> {
		const token = generateRandomString(64);
		await redis.set(`token:email:${token}`, userId, "EX", this.EXPIRES_IN);
		return token;
	}

	public static async generatePasswordResetToken(
		userId: string
	): Promise<string> {
		const token = generateRandomString(64);
		await redis.set(`token:password:${token}`, userId, "EX", this.EXPIRES_IN);
		return token;
	}

	// Validate Tokens
	public static async validateDeviceToken(token?: string): Promise<boolean> {
		if (token === undefined) return false;

		const id = `token:device:${token}`;
		const attempts = await redis.hget(id, "attempts");

		if (attempts === null) return false;

		const currentAttempts = parseInt(attempts) + 1;

		if (currentAttempts > 5) {
			await redis.del(id);
			return false;
		}

		await redis.hset(id, "attempts", currentAttempts.toString());

		return true;
	}

	public static async validateEmailVerificationToken(
		token: string
	): Promise<string | undefined> {
		const userId = await redis.get(`token:email:${token}`);
		if (userId === null) return undefined;
		return userId;
	}

	public static async validatePasswordResetToken(
		token: string
	): Promise<string | undefined> {
		const userId = await redis.get(`token:password:${token}`);
		if (userId === null) return undefined;
		return userId;
	}

	// Token Deletion
	public static async deleteEmailVerificationToken(
		token: string
	): Promise<void> {
		await redis.del(`token:email:${token}`);
	}

	public static async deletePasswordResetToken(token: string): Promise<void> {
		await redis.del(`token:password:${token}`);
	}
}
