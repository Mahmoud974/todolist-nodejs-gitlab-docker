"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 5000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Connexion à MongoDB
mongoose_1.default
    .connect("mongodb://localhost:27017/todo-app")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB connection error:", err));
// Schema de Todo
const todoSchema = new mongoose_1.default.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
});
const Todo = mongoose_1.default.model("Todo", todoSchema);
// Routes
app.get("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield Todo.find();
        res.json(todos);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}));
app.post("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = req.body;
    try {
        const newTodo = new Todo({
            text,
        });
        yield newTodo.save();
        res.status(201).json(newTodo);
    }
    catch (err) {
        res.status(400).json({ message: err });
    }
}));
app.put("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { completed } = req.body;
    try {
        const updatedTodo = yield Todo.findByIdAndUpdate(id, { completed }, { new: true });
        res.json(updatedTodo);
    }
    catch (err) {
        res.status(400).json({ message: err });
    }
}));
app.delete("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield Todo.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch (err) {
        res.status(400).json({ message: err });
    }
}));
// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
