import { json } from "@remix-run/node"; // or cloudflare/deno
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

export type Game = {
	appid: number;
	name: string;
	playtime_forever: number;
	img_icon_url: string;
	has_community_visible_stats: boolean;
	content_descriptorids: string[];
};

export type Response = {
	response: {
		game_count: number;
		games: Game[];
	};
};

export async function loader({
  params
}: LoaderFunctionArgs) {
  const steamId = params.steamId
	const steamKey = process.env.STEAM_KEY;
	const res = await fetch(
		`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamKey}&steamid=${steamId}&format=json&include_appinfo=true`,
	);
	return json(await res.json());
}

export default function Products() {
	const games: Game[] = useLoaderData<typeof loader>();
	return (
		<div>
			<h1>Games</h1>
			{games.map((game) => (
				<div key={game.appid}>{game.name}</div>
			))}
		</div>
	);
}
