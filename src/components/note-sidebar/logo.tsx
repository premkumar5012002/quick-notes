import {
	IconSun,
	IconMoon,
	IconLogout,
	IconCaretUpDown,
	IconChevronDown,
	IconSettings,
} from "@tabler/icons-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import Link from "next/link";
import { ButtonLoading } from "../loading-button";

export const Logo = () => {
	const router = useRouter();

	const { theme, setTheme } = useTheme();

	const logoutMutation = api.user.logout.useMutation({
		onError: (e) => {},
		onSuccess: async () => {
			router.replace(`/sign-in`);
		},
	});

	const onThemeChange = () => {
		if (theme === "light") {
			setTheme("dark");
		} else {
			setTheme("light");
		}
	};

	const onLogout = () => {
		logoutMutation.mutate();
	};

	return (
		<div className="p-2">
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="ghost" className="w-full justify-between gap-4">
						<div className="flex items-center gap-1.5">
							<Image alt="Logo" width={28} height={28} src="/logo.svg" />
							<span className="text-lg font-semibold text-foreground">
								QuickNotes
							</span>
						</div>
						<IconChevronDown size={18} />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="p-1">
					<Button
						variant="ghost"
						className="w-full justify-start"
						onClick={onThemeChange}
					>
						{theme === "dark" ? (
							<>
								<IconSun size={18} className="mr-2" /> Light mode
							</>
						) : (
							<>
								<IconMoon size={18} className="mr-2" /> Dark mode
							</>
						)}
					</Button>

					<Button variant="ghost" className="w-full justify-start" asChild>
						<Link href="/settings">
							<IconSettings size={18} className="mr-2" /> Settings
						</Link>
					</Button>

					{logoutMutation.isLoading ? (
						<ButtonLoading variant="ghost" className="w-full justify-start" />
					) : (
						<Button
							variant="ghost"
							className="w-full justify-start"
							onClick={onLogout}
						>
							<IconLogout size={18} className="mr-2" /> Logout
						</Button>
					)}
				</PopoverContent>
			</Popover>
		</div>
	);
};
