from fastapi import status, APIRouter, HTTPException # type: ignore
from pydantic import BaseModel # type: ignore
from db.db import get_connection
from src.models.rule import Rule
import ast
import operator

router = APIRouter()

class Trigger(BaseModel):
    type: str
    value: str

class Condition(BaseModel):
    field: str
    operator: str
    value: str

class Action(BaseModel):
    type: str
    config: dict

class RuleModel(BaseModel):
    trigger: Trigger
    conditions: list[Condition]
    actions: list[Action]

class SaveRuleBody(BaseModel):
    user_id: int
    rule: RuleModel

class UpdateRuleBody(BaseModel):
    rule_id: int
    rule: RuleModel

class StateRuleBody(BaseModel):    
    rule_id: float
    state: bool

class RetryPolicyBody(BaseModel):
    rule_id: int
    limit: int

class GlobalRetryBody(BaseModel):
    attempts: int
    delay: int

@router.post("/save", status_code=status.HTTP_201_CREATED)
async def save_rule(rule_body: SaveRuleBody):


    print("RULE RECEIVED:", rule_body.rule)

    ALLOWED_NODES = (
        ast.Expression, ast.Compare, ast.BinOp, ast.BoolOp,
        ast.Name, ast.Load, ast.Subscript, ast.Constant, ast.List, ast.Tuple,
        ast.Gt, ast.Lt, ast.Eq, ast.NotEq, ast.Is, ast.IsNot
    )

    OPERATOR_MAP = {
        "gt": ">",
        "lt": "<",
        "eq": "=="
    }

    try:
        
        for condition in rule_body.rule.conditions:
            field = condition.field
            operator = condition.operator
            value = condition.value

            op_symbol = OPERATOR_MAP.get(operator)
            expr = f"{field} {op_symbol} {repr(value)}"
            tree = ast.parse(expr, mode='eval')

            if not op_symbol:
                raise ValueError(f"Invalid operator: {operator}")
            
            for node in ast.walk(tree):
                if not isinstance(node, (ALLOWED_NODES)):
                    raise ValueError(f"Invalid node in conditions: {type(node).__name__}")

        
        rule = Rule(
            user_id=rule_body.user_id,
            rule=rule_body.rule.dict(), 
            event_type=rule_body.rule.trigger.type
        )
        rule.create()

        return {
            "message": "rule saved in db",
            "status": 201
        }
    
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.patch("/update", status_code=status.HTTP_201_CREATED)
async def update_rule(rule_body: UpdateRuleBody):

    print("RULE RECEIVED:", rule_body.rule)

    ALLOWED_NODES = (
        ast.Expression, ast.Compare, ast.BinOp, ast.BoolOp,
        ast.Name, ast.Load, ast.Subscript, ast.Constant, ast.List, ast.Tuple,
        ast.Gt, ast.Lt, ast.Eq, ast.NotEq, ast.Is, ast.IsNot
    )

    OPERATOR_MAP = {
        "gt": ">",
        "lt": "<",
        "eq": "=="
    }

    try:
        
        for condition in rule_body.rule.conditions:
            field = condition.field
            operator = condition.operator
            value = condition.value

            op_symbol = OPERATOR_MAP.get(operator)
            expr = f"{field} {op_symbol} {repr(value)}"
            tree = ast.parse(expr, mode='eval')

            if not op_symbol:
                raise ValueError(f"Invalid operator: {operator}")
            
            for node in ast.walk(tree):
                if not isinstance(node, (ALLOWED_NODES)):
                    raise ValueError(f"Invalid node in conditions: {type(node).__name__}")

        
        rule = Rule(
            rule_id=rule_body.rule_id,
            rule=rule_body.rule.dict()
        )
        rule.update()

        return {
            "message": "rule updated",
            "status": 201
        }
    
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@router.patch("/change-state", status_code=status.HTTP_201_CREATED)
async def change_state_rule(rule_body: StateRuleBody):

    try:
        
        rule = Rule(rule_id=rule_body.rule_id)
        rule.toggle_state(state=rule_body.state)

        return {
            "message": "rule updated",
            "status": 201
        }
    
    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/list/{user_id}", status_code=status.HTTP_202_ACCEPTED)
async def list_rules(user_id: int):

    try:
        
        rule = Rule(user_id=user_id)
        rules = rule.list_rules()

        return {
            "message": "rules fetched",
            "status": 202,
            "rules": rules
        }
    
    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/delete/{rule_id}", status_code=status.HTTP_200_OK)
async def delete_rule(rule_id: int):

    try:
        
        rule = Rule(rule_id=rule_id)
        rule.delete()

        return {
            "message": "rule deleted",
            "status": 200
        }
    
    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.patch("/retryPolicy", status_code=status.HTTP_200_OK)
async def update_retry_policy(retry_policy_body: RetryPolicyBody):

    try:
        
        rule = Rule(rule_id=retry_policy_body.rule_id)
        rule.update_retry_policy(limit=retry_policy_body.limit)

        return {
            "message": "retry policy updated",
            "status": 200
        }
    
    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@router.patch("/globalRetry", status_code=status.HTTP_200_OK)
async def update_global_retry(global_retry_body: GlobalRetryBody):

    try:
        
        rule = Rule()
        rule.update_global_retry(limit=global_retry_body.attempts, delay=global_retry_body.delay)

        return {
            "message": "retry policy updated",
            "status": 200
        }
    
    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )