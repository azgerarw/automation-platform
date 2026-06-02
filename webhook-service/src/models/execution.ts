import { UUID } from "node:crypto";
import pool from "../db/psql_db.js";

class Execution {
    user_id: number | undefined;
    payload: object | undefined;
    correlation_id: string | undefined;
    execution_id: string | undefined;
    status: string | undefined;
    created_at: Date | undefined;
    last_event_at: Date | undefined;
    finished_at: Date | undefined;
    
    constructor(user_id?: number, payload?: object, correlation_id?: string, status?: string, execution_id?: string) {
        this.user_id = user_id;
        this.payload = payload;
        this.correlation_id = correlation_id;
        this.status = status;
        this.execution_id = execution_id;
        this.created_at = undefined;
        this.last_event_at = undefined;
        this.finished_at = undefined;
    }

    async create(this: Execution) {

    try {
            const activeExecution = await pool.query(`
                INSERT INTO executions (
                    execution_id,
                    user_id,
                    correlation_id,
                    status,
                    payload,
                    created_at
                ) VALUES ($1, $2, $3, $4, $5, NOW())
            `, [
                this.execution_id,
                this.user_id,
                this.correlation_id,
                this.status,
                this.payload
            ]);

            return activeExecution;
        } catch (error) {
            console.error("Error creating execution:", error);
            throw error;
        }
    }

    async updateLastEvent(this: Execution, correlation_id: string) {

        try {
            await pool.query(`
                UPDATE executions
                SET last_event_at = NOW()
                WHERE correlation_id = $1
            `, [correlation_id]);
        } catch (error) {
            console.error("Error updating last event timestamp:", error);
            throw error;
        }
    }

    async activeExecution(this: Execution, user_id: number) {
        try {
            const activeExecution = await pool.query(`
                SELECT correlation_id
                FROM executions
                WHERE user_id = $1
                AND created_at > NOW() - INTERVAL '30 minutes'
                ORDER BY created_at DESC
                LIMIT 1
            `, [user_id]);
            return activeExecution
        } catch (error) {
                console.error("Error updating last event timestamp:", error);
                throw error;
        }
    }
}


export default Execution;