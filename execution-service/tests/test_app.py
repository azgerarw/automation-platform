import unittest
from src import server


class TestExecutionService(unittest.TestCase):
    def test_app_exists(self):
        self.assertTrue(hasattr(server, 'app'))

    def test_get_metrics_returns_dict(self):
        metrics = server.get_metrics()
        self.assertIsInstance(metrics, dict)
        self.assertIn('rss', metrics)
        self.assertIn('uptime_seconds', metrics)


if __name__ == '__main__':
    unittest.main()
