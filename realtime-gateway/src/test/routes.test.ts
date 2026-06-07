import { describe, expect, it } from "vitest";

describe("User API", () => {
	it("POST /health - health check", async () => {
		const res = await fetch("http://localhost:4500/health", {
			method: "GET",
		});

		const data = await res.json();
		expect(res.status).toBe(200);
		expect(data.message).toEqual("ok");
		expect(data.service).toEqual("realtime-gateway");
	});
});
