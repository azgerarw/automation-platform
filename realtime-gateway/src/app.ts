import express from "express";
import eventsRoute from "./routes/events.js";
import executionsRoute from "./routes/executions.js";

const app = express();

app.use(express.json());

app.use("/executions", executionsRoute);
app.use("/events", eventsRoute);

export default app;
