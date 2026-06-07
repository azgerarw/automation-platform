import { createClient } from "redis";

const client = createClient({
	url: "redis://redis:6379",
	socket: {
		reconnectStrategy: (retries) => {
			console.log(`Redis reconnect attempt ${retries}`);
			return Math.min(retries * 100, 3000);
		},
	},
});

export default client;
