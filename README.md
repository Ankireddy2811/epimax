# Task Management Backend

This is a simple Express.js-based backend for task management. It allows users to register, log in, and manage tasks with CRUD operations (Create, Read, Update, Delete). The project demonstrates user authentication with JSON Web Tokens (JWT), secure password hashing with `bcrypt`, and basic database operations with SQLite.

## Features
- User registration and login with JWT-based authentication.
- CRUD operations for task management.
- SQLite database with `Users` and `Tasks` tables.
- Secure password handling with `bcrypt`.

## Prerequisites
To set up and run this project, ensure you have the following installed:
- **Node.js**: Version 14 or higher.
- **npm**: Node Package Manager.

## Installation
1. **Clone the Repository**:

   git clone "https://github.com/Ankireddy2811/epimax"
   cd myapp

  **** test all the APIS at app.http file


## API 

** POST /tasks - Create a new task.
** GET /tasks - Retrieve all tasks assigned to the logged-in user.
** GET /tasks/:id - Retrieve a specific task by ID.
** PUT /tasks/:id - Update a specific task by ID.
** DELETE /tasks/:id - Delete a specific task by ID.



