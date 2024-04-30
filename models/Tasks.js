class Tasks {
    constructor(db) {
        this.db = db;
    }

    async create(title,description,status,assignee_id,created_at,updated_at) {
        try {
            const insertData = `
                INSERT INTO Tasks (title, description, status,assignee_id,created_at,updated_at)
                VALUES ('${title}','${description}','${status}',${assignee_id},'${created_at}','${updated_at}')
            `;
            const dbResponse = await this.db.run(insertData);
            const entryId = dbResponse.lastID;
            return `Task with ID ${entryId} created successfully`;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async read(loggedUserId) {
        try {
            const entry = await this.db.all(`SELECT * FROM Tasks WHERE assignee_id = ${loggedUserId}`);
            if (!entry) {
                throw new Error(`Tasks not found`);
            }
            return entry;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async readSecificId(id,loggedUserId) {
        try {
            const entry = await this.db.all(`SELECT * FROM Tasks WHERE id = ${id} AND assignee_id = ${loggedUserId}`);
            if (!entry) {
                throw new Error(`Task not found for this user`);
            }
            return entry;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async update(title,description,status,assignee_id,created_at,updated_at,taskId) {
        try {
            const updateData = `
                UPDATE Tasks
                SET title = '${title}',description = '${description}',status='${status}',
                assignee_id = ${assignee_id},created_at='${created_at}',updated_at = '${updated_at}'
                WHERE id = ${taskId}
                
            `;
            await this.db.run(updateData);
            return `Task with ID ${taskId}  updated successfully`;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    
    async delete(taskId) {
        try {
            const deleteData = `
                DELETE FROM Tasks
                WHERE id = ${taskId}
                
            `;
            await this.db.run(deleteData);
            return `Task with ID ${taskId} deleted successfully`;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
}

module.exports = Tasks;