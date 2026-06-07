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
        
        self.assertEqual(data["message"], "Notification Service running")



if __name__ == '__main__':
    unittest.main()
