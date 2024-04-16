import { LaptopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Link, useLoaderData } from "@remix-run/react";
import * as React from "react";
import { useHydrated } from "remix-utils/use-hydrated";

import {
	getTheme,
	setTheme as setSystemTheme,
} from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { json, LoaderFunctionArgs } from "@remix-run/node";
import SteamProfileBanner from "./steam-profile-banner";

export type Player = {
	steamid: string;
	communityvisibilitystate: number;
	profilestate: number;
	personaname: string;
	profileurl: string;
	avatar: string;
	avatarmedium: string;
	avatarfull: string;
	avatarhash: string;
	personastate: string;
	realname: string;
	primaryclanid: string;
	timecreated: number;
	personastateflags: number;
	loccountrycode: string;
	locstatecode: string;
	loccityid: number;
};

export async function loader({ params, request }: LoaderFunctionArgs) {
	const steamId = params.steamId;
	const steamKey = process.env.STEAM_KEY;
	const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamKey}&steamids=${steamId}`;
	const res = await fetch(url);
	const {
		response: { players },
	} = await res.json();
	return json(
		players.first() || {
			avatarmedium:
				"https://th.bing.com/th?id=OSK.2aeea85494562513165ee6986eceda50&w=102&h=102&c=7&o=6&oif=webp&pid=SANGAM",
			personaname: "Please login",
			personastate: "You must",
		},
	);
}

export function Header() {
	const hydrated = useHydrated();
	const [, rerender] = React.useState({});
	const setTheme = React.useCallback((theme: string) => {
		setSystemTheme(theme);
		rerender({});
	}, []);
	const theme = getTheme();

	const steamPlayer: Player = useLoaderData<typeof loader>();

	return (
		<header className="flex items-center justify-between px-4 py-2 md:py-4">
			<div className="flex items-center space-x-4">
				<Link className="flex items-center space-x-2" to="/">
					{/* <HomeIcon className="h-6 w-6" /> */}
					<SteamProfileBanner
						image={steamPlayer?.avatarmedium}
						username={steamPlayer?.personaname}
						description={steamPlayer?.personastate}
					/>
				</Link>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						className="w-10 h-10 rounded-full border"
						size="icon"
						variant="ghost"
					>
						<span className="sr-only">Theme selector</span>
						{!hydrated ? null : theme === "dark" ? (
							<MoonIcon />
						) : theme === "light" ? (
							<SunIcon />
						) : (
							<LaptopIcon />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="mt-2">
					<DropdownMenuLabel>Theme</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<button
							type="button"
							className="w-full"
							onClick={() => setTheme("light")}
							aria-selected={theme === "light"}
						>
							Light
						</button>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<button
							type="button"
							className="w-full"
							onClick={() => setTheme("dark")}
							aria-selected={theme === "dark"}
						>
							Dark
						</button>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<button
							type="button"
							className="w-full"
							onClick={() => setTheme("system")}
							aria-selected={theme === "system"}
						>
							System
						</button>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	);
}
