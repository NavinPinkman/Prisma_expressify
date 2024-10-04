import { PrismaClient } from "@prisma/client";
import { number } from "zod";
const express = require("express")
const z = require("zod")

const prisma = new PrismaClient()
const app = express()
app.use(express.json())
const schema = z.object({
    username: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    firstname: z.string(),
    lastname: z.string().optional()
});

app.post('/signup',async (req:any,res:any)=>{
    const body = req.body
    const parseResult = schema.safeParse(body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: parseResult.error.errors // Provide detailed validation errors
        });
    }
    try{
        const response = await prisma.user.create({
            data :{
                username : req.body.username,
                password : req.body.password,
                firstname: req.body.firstname,
                lastname : req.body.lastname
            }
        })
        res.json({
            message : "user created successfully",
            response : response
        })
    }catch(err){
         res.json({message : "Invalid input"})
    }
    
})

const todoSchema = z.object({
    title : z.string(),
    description : z.string().optional(),
    userId : z.number()
})

app.post('/todos',async(req:any,res:any)=>{
    const { success } = todoSchema.safeParse(req.body);
    if(!success){
        res.status(400).json({
            message : "Something went wrong / Try Again Later"
        })
        return;
    }
    const response = await prisma.todo.create({
        data :{
            title : req.body.title,
            description : req.body.description,
            userId : req.body.userId
        }
    })
    res.json({
        message : "Todo successfully created",
        response : response
    })
})

app.get('/getTodo',async (req:any,res:any)=>{
    const body = req.query.userId
    console.log("entered")
    if(!body){
        res.status(400).json({
            message : "userid is required"
        })
    }
    const response  = await prisma.todo.findMany({
        where : {
            userId : body
        },
        select :{
            id : true,
            title : true,
            description : true,
            user : true
        }
    })
})

app.listen(3000);

