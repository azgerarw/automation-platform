import unittest
from fastapi.testclient import TestClient #type: ignore
from src.server import app, get_metrics

client = TestClient(app)


class TestExecutionService(unittest.TestCase):

    def test_app_exists(self):
        self.assertIsNotNone(app)

    def test_get_metrics_returns_dict(self):
        metrics = get_metrics()

        self.assertIsInstance(metrics, dict)
        self.assertIn('rss', metrics)
        self.assertIn('uptime_seconds', metrics)

    def test_service_health(self):

        response = client.get("/health")

        self.assertEqual(response.status_code, 200)

        data = response.json()
        
        self.assertEqual(data['message'], "Rule Service running")

    def test_create_rule_endpoint(self):

        rule = {"actions": [{"type": "email", "config": {"to": "test@email.com"}}, 
        {"type": "discord", "config": {"webhook": "url"}}], 
        "trigger": {"type": "payment.failed", "value": "amount"}, 
        "conditions": [{"field": "amount", "value": "100", "operator": "gt"}]}

        response = client.post("/rules/save", json={"user_id": 1, "rule": rule})
        
        self.assertEqual(response.status_code, 201)

        data = response.json()

        self.assertEqual(data['message'], "rule saved in db")


if __name__ == '__main__':
    unittest.main()