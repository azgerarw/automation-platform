import express from 'express';
const app = express();
app.use(express.json());
app.get("/health", (req, res) => {
    res.json({ service: "webhook-service", status: "ok" });
});
app.listen(5000, () => {
    console.log("Webhook Service running on port 5000");
});
