import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { IconSun, IconMoon, IconLogout, IconChevronDown, IconSettings } from "@tabler/icons-react";

import { api } from "@/trpc/react";

import { Button } from "../ui/button";
import { ButtonLoading } from "../loading-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const Logo: FC<{ onClose?: () => void }> = ({ onClose }) => {
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
		onClose?.();
		logoutMutation.mutate();
	};

	return (
		<div className="p-2">
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="ghost" className="w-full justify-between gap-4">
						<div className="flex items-center gap-1.5">
							<Image alt="Logo" width={28} height={28} src="/logo.svg" />
							<span className="text-lg font-semibold text-foreground">QuickNotes</span>
						</div>
						<IconChevronDown size={18} />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="p-1">
					<Button variant="ghost" className="w-full justify-start" onClick={onThemeChange}>
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
						<Link href="/settings" onClick={onClose}>
							<IconSettings size={18} className="mr-2" /> Settings
						</Link>
					</Button>

					{logoutMutation.isLoading ? (
						<ButtonLoading variant="ghost" className="w-full justify-start" />
					) : (
						<Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
							<IconLogout size={18} className="mr-2" /> Logout
						</Button>
					)}
				</PopoverContent>
			</Popover>
		</div>
	);
};
