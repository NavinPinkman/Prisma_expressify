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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express = require("express");
const z = require("zod");
const prisma = new client_1.PrismaClient();
const app = express();
app.use(express.json());
const schema = z.object({
    username: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    firstname: z.string(),
    lastname: z.string().optional()
});
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parseResult = schema.safeParse(body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: parseResult.error.errors // Provide detailed validation errors
        });
    }
    try {
        const response = yield prisma.user.create({
            data: {
                username: req.body.username,
                password: req.body.password,
                firstname: req.body.firstname,
                lastname: req.body.lastname
            }
        });
        res.json({
            message: "user created successfully",
            response: response
        });
    }
    catch (err) {
        res.json({ message: "Invalid input" });
    }
}));
const todoSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    userId: z.number()
});
app.post('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = todoSchema.safeParse(req.body);
    if (!success) {
        res.status(400).json({
            message: "Something went wrong / Try Again Later"
        });
        return;
    }
    const response = yield prisma.todo.create({
        data: {
            title: req.body.title,
            description: req.body.description,
            userId: req.body.userId
        }
    });
    res.json({
        message: "Todo successfully created",
        response: response
    });
}));
app.get('/getTodo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    console.log("Entered GET /getTodo route");
    // Validate userId
    if (!userId) {
        return res.status(400).json({
            message: "userId is required"
        });
    }
    try {
        const response = yield prisma.todo.findMany({
            where: {
                userId: Number(userId) // Ensure userId is a number
            },
            select: {
                id: true,
                title: true,
                description: true,
                user: true
            }
        });
        // Send response with retrieved todos
        res.json(response);
    }
    catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({
            message: "Something went wrong while fetching todos"
        });
    }
}));
app.listen(3000);
