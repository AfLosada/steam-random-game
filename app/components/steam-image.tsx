import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function SteamCard(props: {
	name: string;
	img: string;
	playtime: number;
  lastPlayed: number;
}) {
	return (
		<Card className="overflow-hidden">
			<CardHeader>
				<CardTitle>{props.name}</CardTitle>
				<CardDescription>
        {`${props.playtime} minutes\n`}
        {`${new Date(props.lastPlayed)}`}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-2">
					<img
						alt="Steam Game"
						className="aspect-square w-full rounded-md object-cover"
						src={props.img}
					/>
					{/* <div className="grid grid-cols-3 gap-2">
						<button type="button">
							<img
								alt="aaa"
								className="aspect-square w-full rounded-md object-cover"
								height="84"
								src="/placeholder.svg"
								width="84"
							/>
						</button>
						<button type="button">
							<img
								alt="bbb"
								className="aspect-square w-full rounded-md object-cover"
								height="84"
								src="/placeholder.svg"
								width="84"
							/>
						</button>
						<button
							type="button"
							className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
						>
							<span className="sr-only">Upload</span>
						</button>
					</div> */}
				</div>
			</CardContent>
		</Card>
	);
}
