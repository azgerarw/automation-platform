--
-- PostgreSQL database dump
--
\connect microservices_db;
\restrict N6OxqIWmTKhEIqEnZQhIk6ZzLaIRHq9D1j286S40utAONJWS6u2nYpeDsRaVJ55

-- Dumped from database version 18.3 (Debian 18.3-1.pgdg13+1)
-- Dumped by pg_dump version 18.3 (Debian 18.3-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: microservices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.microservices (
    service_id integer NOT NULL,
    service_name character varying(100) NOT NULL,
    status character varying(20) NOT NULL,
    cpu_usage double precision DEFAULT 0,
    memory_usage_mb double precision DEFAULT 0,
    uptime_seconds bigint DEFAULT 0,
    total_requests bigint DEFAULT 0,
    error_rate double precision DEFAULT 0,
    active_connections integer DEFAULT 0,
    last_request_at timestamp without time zone,
    last_heartbeat timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    pid text,
    platform text,
    version text,
    rss double precision,
    heapused double precision,
    heaptotal double precision,
    requests_per_min double precision,
    port integer
);


ALTER TABLE public.microservices OWNER TO postgres;

--
-- Name: microservices_service_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.microservices_service_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.microservices_service_id_seq OWNER TO postgres;

--
-- Name: microservices_service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.microservices_service_id_seq OWNED BY public.microservices.service_id;


--
-- Name: microservices service_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.microservices ALTER COLUMN service_id SET DEFAULT nextval('public.microservices_service_id_seq'::regclass);


--
-- Name: microservices microservices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.microservices
    ADD CONSTRAINT microservices_pkey PRIMARY KEY (service_id);


--
-- Name: microservices microservices_service_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.microservices
    ADD CONSTRAINT microservices_service_name_key UNIQUE (service_name);


--
-- PostgreSQL database dump complete
--

\unrestrict N6OxqIWmTKhEIqEnZQhIk6ZzLaIRHq9D1j286S40utAONJWS6u2nYpeDsRaVJ55

