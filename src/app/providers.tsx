"use client";

import { PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";

import { TRPCReactProvider } from "@/trpc/react";

import { Toaster } from "@/components/ui/toaster";

export function Providers(props: PropsWithChildren) {
	return (
		<TRPCReactProvider>
			<ThemeProvider enableSystem attribute="class">
				{props.children}
				<Toaster />
			</ThemeProvider>
		</TRPCReactProvider>
	);
}
