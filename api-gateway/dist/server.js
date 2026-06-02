import express from 'express';
const app = express();
app.use(express.json());
app.get("/health", (req, res) => {
    res.json({ service: "api-gateway-service", status: "ok" });
});
app.listen(3000, () => {
    console.log("Api-gateway Service running on port 3000");
});
