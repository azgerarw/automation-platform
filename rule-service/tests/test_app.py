import unittest
from src import server


class TestRuleService(unittest.TestCase):
    def test_app_exists(self):
        self.assertTrue(hasattr(server, 'app'))

    def test_get_metrics_returns_dict(self):
        metrics = server.get_metrics()
        self.assertIsInstance(metrics, dict)
        self.assertIn('last_request_at', metrics)
        self.assertIn('pid', metrics)


if __name__ == '__main__':
    unittest.main()
