import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { KeyboardEvent } from "react";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getBaseUrl() {
	return (
		process.env.BASE_URL ??
		process.env.NEXT_PUBLIC_VERCEL_URL ??
		"http://localhost:3000"
	);
}

export const preventDefaultOnEnterKey = (
	e: KeyboardEvent<HTMLInputElement>,
	onEnter: () => void
) => {
	if (e.key === "Enter") {
		onEnter();
		e.preventDefault();
	}
};

export function isValidUrl(url: string) {
	try {
		new URL(url);
		return true;
	} catch (e) {
		return false;
	}
}

export function getUrlFromString(str: string) {
	if (isValidUrl(str)) return str;
	try {
		if (str.includes(".") && !str.includes(" ")) {
			return new URL(`https://${str}`).toString();
		}
	} catch (e) {
		return null;
	}
}
