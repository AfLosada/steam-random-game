import { InputForm } from "@/components/user-input";
import { title } from "@/config.shared";
import type { MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
	return [
		{ title: title() },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export const loader = async () => {
	const steamKey = process.env.STEAM_KEY || "";
	return json({ variable: steamKey });
};

const buildOnSubmitCallback = (steamKey: string) => {
	return async (username: string) => {
		let steamId = null;
		const response = await fetch(
			`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steamKey}&vanityurl=${username}`,
		);
		const {
			response: { steamid },
		} = await response.json();
		if (steamid) {
			const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamKey}&steamids=${steamid}`;
			const checkIfSteamIdResponse = await fetch(url);
			const {
				response: {
					players: [player],
				},
			} = await checkIfSteamIdResponse.json();
			if (player) {
				steamId = player.steamid;
			}
		}
		return steamId;
	};
};

export default function Index() {
	const { variable } = useLoaderData<typeof loader>();
	const callback = buildOnSubmitCallback(variable);
	return (
		<main className="container prose py-8">
			<InputForm callback={callback} />
		</main>
	);
}
