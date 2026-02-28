import express from "express";
import cors from "cors";

const app = express();

app.use(cors()); // Enable CORS for all routes and origins

// Serve static files from root (do not do this in production code, but fine here)
app.use(express.static("./"));

app.listen(6969, () => console.log("Foods up."));
