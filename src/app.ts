import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3003;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware JSON
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

const mongodbURI = process.env.MONGODB_URI;
if (!mongodbURI) {
  console.error("MONGODB_URI is not defined in .env file");
  process.exit(1);
}

mongoose
  .connect(mongodbURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Schema de Todo
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

// Routes
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.post("/todos", async (req: Request, res: Response) => {
  const { text } = req.body;
  try {
    const newTodo = new Todo({
      text,
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

app.put("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Todo.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
