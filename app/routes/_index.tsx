import { InputForm } from "@/components/user-input";
import { title } from "@/config.shared";
import type { MetaFunction } from "@remix-run/node";

const steamKey = process.env.STEAM_KEY;

export const meta: MetaFunction = () => {
	return [
		{ title: title() },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

async function onSubmitNavigate(username: string) {
	let steamId = null;
	const response = await fetch(
		`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steamKey}&vanityurl=${username}`,
	);
	const {
		response: { steamid },
	} = await response.json();
	if (!steamid) {
		const checkIfSteamIdResponse = await fetch(
			`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamKey}&steamids=${username}`,
		);
		const {
			response: {
				players: [player],
			},
		} = await checkIfSteamIdResponse.json();
		if (player) {
			steamId = player.steamid;
		}
	}
	return steamId
}

export default function Index() {
	return (
		<main className="container prose py-8">
			<InputForm callback={onSubmitNavigate}/>
		</main>
	);
}
