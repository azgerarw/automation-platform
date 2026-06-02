import os
from loguru import logger # type: ignore

# Ensure the logs directory exists
logs_dir = os.path.join(os.path.dirname(__file__), '..', 'logs')
os.makedirs(logs_dir, exist_ok=True)
print(f"Logs dir created: {logs_dir}")

# Remove default handler
logger.remove()

# Add console handler (keeping existing console logs)
logger.add(
    lambda msg: print(msg, end=""),
    format="{time:YYYY-MM-DD HH:mm:ss} - {level} - {message}",
    level="DEBUG",
    colorize=True
)

# Add file handler for events.log
log_file_path = os.path.join(logs_dir, 'events.log')
print(f"Log file path: {log_file_path}")
try:
    handler_id = logger.add(
        log_file_path,
        format="{time:YYYY-MM-DD HH:mm:ss} - {level} - {message} - {extra}",
        level="DEBUG",
        encoding="utf-8"
    )
    print(f"File handler added successfully: {log_file_path}, handler id: {handler_id}")
except Exception as e:
    print(f"Failed to add file handler: {e}")

