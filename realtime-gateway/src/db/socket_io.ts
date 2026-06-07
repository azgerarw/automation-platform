import { Server } from "socket.io";

let io: any = null;

export function initSocket(server: any) {
	io = new Server(server, {
		cors: {
			origin: "*",
		},
	});

	return io;
}

export function getIO() {
	if (!io) {
		throw new Error("Socket.IO not initialized");
	}

	return io;
}
