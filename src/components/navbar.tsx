"use client";

import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";

export const Navbar = () => {
	return (
		<nav className="h-16 max-w-screen-2xl mx-auto flex items-center justify-between px-6">
			<Logo />
			<Options />
		</nav>
	);
};

export const Logo = () => {
	return (
		<Link href="/" className="flex items-center gap-2 h-full">
			<Image src="/logo.svg" alt="logo" width={34} height={34} />
			<h1 className="font-semibold hidden lg:block text-xl">QuickNotes</h1>
		</Link>
	);
};

export const Options = () => {
	return (
		<div className="flex items-center gap-2 md:gap-3 lg:gap-4">
			<Button size="lg" variant="outline" asChild>
				<Link href="/sign-in">Login</Link>
			</Button>
		</div>
	);
};
