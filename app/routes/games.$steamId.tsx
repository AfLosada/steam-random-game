import SteamCard from "@/components/steam-image";
import { json } from "@remix-run/node"; // or cloudflare/deno
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

export type Game = {
	appid: number;
	name: string;
	playtime_forever: number;
	img_icon_url: string;
	has_community_visible_stats: boolean;
	content_descriptorids: string[];
	rtime_last_played: number;
};

export type Response = {
	response: {
		game_count: number;
		games: Game[];
	};
};

export async function loader({ params, request }: LoaderFunctionArgs) {
	const steamId = params.steamId;
	const steamKey = process.env.STEAM_KEY;
	const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamKey}&steamid=${steamId}&format=json&include_appinfo=true`;
	const res = await fetch(url);
	const {
		response: { games },
	} = await res.json();
	return json(games);
}

export default function Products() {
	const games: Game[] = useLoaderData<typeof loader>();
	games.sort((a, b) => a.playtime_forever - b.playtime_forever)
	return (
		<Suspense>
			<main className="grid grid-flow-row gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{games.map((game) => {
					const iconUrl = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
					return (
						<div
							key={game.appid}
							className="mx-auto grid max-w-[20rem] auto-rows-max auto-columns-max"
						>
							<SteamCard
								name={game.name}
								lastPlayed={game.rtime_last_played}
								img={iconUrl}
								playtime={game.playtime_forever}
							/>
						</div>
					);
				})}
			</main>
		</Suspense>
	);
}
