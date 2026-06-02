import express from 'express';
const app = express();
app.use(express.json());
app.get("/health", (req, res) => {
    res.json({ service: "auth-service", status: "ok" });
});
app.listen(4000, () => {
    console.log("Auth Service running on port 4000");
});
