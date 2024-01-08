import { ReloadIcon } from "@radix-ui/react-icons";

import { Button, ButtonProps } from "@/components/ui/button";

export function ButtonLoading({ variant, className }: ButtonProps) {
	return (
		<Button disabled variant={variant} className={className}>
			<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
			Please wait
		</Button>
	);
}
