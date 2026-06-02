FROM python:3.12-slim

WORKDIR /app

# Instalar Poetry
RUN pip install --no-cache-dir poetry

# Copiar archivos de proyecto
COPY pyproject.toml poetry.lock ./

# Instalar dependencias
RUN poetry config virtualenvs.create false \
    && poetry install --no-root --no-interaction --no-ansi

# Copiar código
COPY . .

EXPOSE 9000

CMD ["uvicorn", "src.server:app","--host", "0.0.0.0", "--port", "9000", "--reload"]