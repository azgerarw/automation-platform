from fastapi import status, APIRouter # type: ignore
from pydantic import BaseModel # type: ignore
from src.models.execution import Execution
from fastapi import HTTPException # type: ignore
import asyncio
import redis.asyncio as aioredis  # type: ignore # versión async de redis

red = aioredis.Redis(host="redis", port=6379, db=0, decode_responses=True)

router = APIRouter()

@router.get("/list/{user_id}", status_code=status.HTTP_202_ACCEPTED)
async def list_exec(user_id: int):

    try:
        print('received in execution service, user id', user_id)
        execution = Execution(user_id=user_id)
        executions = execution.list_executions()

        return {
            "message": "executions fetched",
            "status": 202,
            "executions": executions
        }
    
    except Exception:

        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/list/all", status_code=status.HTTP_202_ACCEPTED)
async def list_all_exec():

    try:
        
        execution = Execution()
        executions = execution.list_all_executions()

        return {
            "message": "executions fetched",
            "status": 202,
            "executions": executions
        }
    
    except Exception:

        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/byId/{e_id}", status_code=status.HTTP_202_ACCEPTED)
async def list_exec_by_exec_id(e_id):

    exec_id = e_id
    print('received id', exec_id)
    try:
        
        execution = Execution(execution_id=exec_id)
        execution_ = execution.list_exec_by_id()
        print('execution', execution_)
        return {
            "message": "execution fetched",
            "status": 202,
            "execution": execution_
        }
    
    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@router.get("/metrics", status_code=status.HTTP_202_ACCEPTED)
async def get_metrics():

    try:
        
        execution = Execution()
        metrics = execution.get_metrics()

        return {
            "message": "metrics fetched",
            "status": 202,
            "metrics": metrics
        }
    
    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )
    
@router.get("/queues", status_code=status.HTTP_202_ACCEPTED)
async def get_queues():

    try:
        
        execution = Execution()
        queues = await execution.get_queues()

        return {
            "message": "queues fetched",
            "status": 202,
            "queues": queues
        }
    
    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@router.get("/circuit", status_code=status.HTTP_202_ACCEPTED)
async def get_circuit():

    try:
        
        circuit = await red.hgetall('circuit')
        circuit = dict(circuit)
        print(circuit)

        if not circuit:
            return {
                "status": 402,
                "error": "circuit not found"
            }
        
        return {
            "message": "circuit fetched",
            "status": 202,
            "circuit": circuit
        }
    
    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )
