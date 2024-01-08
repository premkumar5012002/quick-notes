import "@/app/globals.css";
import "@/app/editor.css";

import { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "QuickNotes | Quickest Way to manage your notes",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
