import express from "express";
import healthRoute from "./routes/health_route";
import userRoute from "./routes/user_route";

const app = express();

app.use(express.json());
app.use("/users", userRoute);
app.use("/health", healthRoute);

export default app;
