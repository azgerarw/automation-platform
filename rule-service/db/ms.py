import os
import psycopg # type: ignore


def get_connection():

    return psycopg.connect(os.environ["MS_DB_URL"])