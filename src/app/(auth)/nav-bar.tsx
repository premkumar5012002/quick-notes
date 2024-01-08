import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
	return (
		<nav className="p-4">
			<Link href="/" className="flex items-center gap-1">
				<Image src="/logo.svg" width={30} height={30} alt="Logo" />
				<span className="text-lg font-bold">QuickNotes</span>
			</Link>
		</nav>
	);
};
