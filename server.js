const express = require("express");
const path = require("path");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { json } = require("body-parser");

const app = express();
const PORT = 3000;
app.use(express.json());


const dbPath = path.join(__dirname,"tasks.db");

const Tasks = require("./models/Tasks")

app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
})

let db;

const initlizeAbdDbServer = async()=>{
    try{
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        console.log("Database connected successfully");
        const tasks = new Tasks(db); // Create task instance after database connection is established
       
    
            const authenticationMiddleWare = (request,response,next)=>{
                const authorizationHeader = request.headers.authorization;
                if(!authorizationHeader){
                    response.status(401).send("Invalid JWT");
                }
                else{
                    const jwtToken = authorizationHeader.split(" ")[1];
                    jwt.verify(jwtToken,'MY_SECRET_KEY',(error,payload)=>{
                        if(error){
                            response.status(401).send("Invalid JWT Token");
                        }
                        else{
                            request.loggedUserId = payload.id;
                            next();
                        }
                    })
                }
            }

            app.post("/register",async(request,response)=>{

                try{
                    const {username,password} = request.body;
                    console.log(username,password);
                    const hashedPassword = await bcrypt.hash(password,10);
                    const userCheck = await db.get(`SELECT * FROM Users WHERE username = '${username}'`);

                    if(userCheck){
                        response.status(400).send('User Already Exists');
                    }
                    else{
                        const addData = `INSERT INTO Users(username,password) VALUES ('${username}','${hashedPassword}')`;
                        const dbResponse = await db.run(addData);
                        const userId = dbResponse.lastID;
                        response.status(201).send(`Successfully created new user with ID ${userId}`)
                    }

                }

                catch(error){
                    response.status(500).send(error.message);
                }
            })
 
            app.post("/login",async(request,response)=>{

                try{
                    const {username,password} = request.body;
                    
                    const userExists = await db.get(`SELECT * FROM Users WHERE username = '${username}'`);

                    if (!userExists) {
                        response.status(404).send("User Not Found");
                    }
                    else{
                        const orginalPassword = await bcrypt.compare(password,userExists.password);
                        if(orginalPassword){
                            const payload = {username,id:userExists.id};
                            const jwtToken = jwt.sign(payload,'MY_SECRET_KEY');
                            response.status(200).send(jwtToken);
                        }
                        else{
                            response.status(401).send("Invalid Password");
                        }
                    }
                }

                catch(error){
                    response.status(500).send(error.message);
                }
            })
        
       
            app.post("/tasks", authenticationMiddleWare,async (request,response)=>{
            const {loggedUserId} = request;
            console.log(loggedUserId);
            
            const {title,description,status,assignee_id,created_at,updated_at} = request.body
            console.log(title,description,status,assignee_id,created_at,updated_at)
                try {
                    const result = await tasks.create(title,description,status,assignee_id,created_at,updated_at);
                    response.send(result);
                } catch (error) {
                    response.status(400).send(error.message);
                }
            
            });

            app.get("/tasks", authenticationMiddleWare,async (request,response)=>{
            const {loggedUserId} = request;
            console.log(loggedUserId);
            
            try {
                const result = await tasks.read(loggedUserId);
                response.send(result);
            } catch (error) {
                response.status(400).send(error.message);
            }
           
            
            });

            app.get("/tasks/:id", authenticationMiddleWare,async (request,response)=>{
                const {loggedUserId} = request;
                const {id} = request.params
               
                
                try {
                    const result = await tasks.readSecificId(id,loggedUserId);
                    response.send(result);
                } catch (error) {
                    response.status(400).send(error.message);
                }
            });

            app.put("/tasks/:id", authenticationMiddleWare,async (request,response)=>{
                const {loggedUserId} = request;
                const {id} = request.params
               
                
                const {title,description,status,assignee_id,created_at,updated_at} = request.body


               
                    try {

                        const task = await db.get(`SELECT * FROM Tasks WHERE id = ${id} AND assignee_id = ${loggedUserId}`);

                        if (!task) {
                          response.status(403).send("You don't have permission to update this task");
                          return;
                        }
                       
                        const result = await tasks.update(title,description,status,assignee_id,created_at,updated_at,id);
                        response.send(result);
                      
                       
                    } catch (error) {
                        response.status(400).send(error.message);
                    }
                
            });

            app.delete("/tasks/:id",authenticationMiddleWare,async(request,response)=>{
                const{loggedUserId} = request
                const {id} = request.params
               
                try {
                    const task = await db.get(`SELECT * FROM Tasks WHERE id = ${id} AND assignee_id = ${loggedUserId}`);

                    if (!task) {
                      response.status(403).send("You don't have permission to delete this task");
                      return;
                    }
                    const result = await tasks.delete(id);
                    response.send(result);
                   
                   
                } catch (error) {
                    response.status(400).send(error.message);
                }

            })


    
        }
    
    
        catch(error){
            console.error(`DB error: ${error.message}`);
            process.exit(1);
        }

        }
       
initlizeAbdDbServer();

