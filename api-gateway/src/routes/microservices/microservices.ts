import express, { Router } from 'express';
import authMiddleware from '../../config/authMiddleware.js';
import { Request, Response } from "express";
import pool from '../../db/db.js';

const router = express.Router();

type dbType = {
    name: string,
    size: string
}

router.get("/", authMiddleware, async (req,res) => {

    try{

        const services = await pool.query("SELECT * FROM microservices")

        const rows = services.rows

        if (rows.length == 0 || !rows){
            return res.status(404).json({
                error: 'no services found'
            })
        }

        return res.status(202).json({
            service: 'api-gateway',
            services: rows
        })

    }catch(e){
        return res.status(500).json({
            error: e
        })
    }
})

router.get("/circuit", authMiddleware, async (req,res) => {
    try{
        const response = await fetch("http://execution-service:5500/executions/circuit")

        if(!response.ok){
            return res.status(500).json({
                error: 'server error'
            })
        }
        const data = await response.json()

        return res.status(202).json({
            service: 'api-gateway',
            executionServiceResponse: data
        })
    }catch(e){
        return res.status(500).json({
            error: String(e)
        })
    }
})

router.get("/dbConnections", authMiddleware, async (req,res) => {
    const started = Date.now();
    let dbs = [
        {
            name: "PostgreSQL",
            type: "postgres",
            databases: [] as dbType[],
            state: "",
            latency_ms: 0
        }
    ]
    try{
        
        const dbInfo = await pool.query('SELECT datname, pg_size_pretty(pg_database_size(datname)) as size FROM pg_database WHERE datistemplate = false')

        const latency = Date.now() - started;

        dbs[0].state = 'online';
        dbs[0].latency_ms = latency;
        
        dbInfo.rows.forEach(db => {
            dbs[0].databases?.push({
                name: db.datname,
                size: db.size
            })
        });

        return res.status(202).json({
            service: 'api-gateway',
            dbs: dbs
        })
    }catch(e){
        return res.status(500).json({
            error: String(e)
        })
    }
})

export default router;