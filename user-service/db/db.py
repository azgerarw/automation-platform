import os
import psycopg # type: ignore


def get_connection():

    return psycopg.connect(os.environ["DATABASE_URL"])
