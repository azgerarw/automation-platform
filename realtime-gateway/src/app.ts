import express from 'express';
import executionsRoute from './routes/executions.js';
import eventsRoute from './routes/events.js';

const app = express();

app.use(express.json());

app.use("/executions", executionsRoute);
app.use("/events", eventsRoute);

export default app;