--
-- PostgreSQL database dump
--
\connect rule_db;
\restrict KhMfSe1AioSxAbi7OQDTJzasJhMhz8Sz3gePUBj8nYbSuq7hUfLIG6K7xjMShWE

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
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.events (
    event_id integer NOT NULL,
    user_id integer NOT NULL,
    event_type character varying NOT NULL,
    payload jsonb NOT NULL,
    correlation_id uuid NOT NULL,
    status text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    execution_id uuid,
    CONSTRAINT events_status_check CHECK ((status = ANY (ARRAY['processed'::text, 'failed'::text])))
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: events_event_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_event_id_seq OWNER TO postgres;

--
-- Name: events_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_event_id_seq OWNED BY public.events.event_id;


--
-- Name: executions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.executions (
    execution_id uuid NOT NULL,
    user_id integer NOT NULL,
    payload jsonb NOT NULL,
    correlation_id uuid NOT NULL,
    finished_at timestamp without time zone,
    last_event_at timestamp without time zone DEFAULT now(),
    status text NOT NULL,
    started_at timestamp without time zone,
    queued_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT status_check CHECK ((status = ANY (ARRAY['queued'::text, 'running'::text, 'completed'::text, 'failed'::text])))
);


ALTER TABLE public.executions OWNER TO postgres;

--
-- Name: retry_policy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.retry_policy (
    id integer NOT NULL,
    attempts integer DEFAULT 5 NOT NULL,
    last_modified timestamp without time zone,
    rule_id integer NOT NULL,
    delay integer
);


ALTER TABLE public.retry_policy OWNER TO postgres;

--
-- Name: retry_policy_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.retry_policy_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.retry_policy_id_seq OWNER TO postgres;

--
-- Name: retry_policy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.retry_policy_id_seq OWNED BY public.retry_policy.id;


--
-- Name: rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.rules (
    rule_id integer NOT NULL,
    user_id integer NOT NULL,
    rule jsonb NOT NULL,
    event_type character varying NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT check_rule CHECK (((rule ? 'trigger'::text) AND (jsonb_typeof((rule -> 'trigger'::text)) = 'object'::text) AND (rule ? 'conditions'::text) AND (jsonb_typeof((rule -> 'conditions'::text)) = 'array'::text) AND (rule ? 'actions'::text) AND (jsonb_typeof((rule -> 'actions'::text)) = 'array'::text)))
);


ALTER TABLE public.rules OWNER TO postgres;

--
-- Name: rules_rule_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rules_rule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rules_rule_id_seq OWNER TO postgres;

--
-- Name: rules_rule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rules_rule_id_seq OWNED BY public.rules.rule_id;


--
-- Name: events event_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN event_id SET DEFAULT nextval('public.events_event_id_seq'::regclass);


--
-- Name: retry_policy id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.retry_policy ALTER COLUMN id SET DEFAULT nextval('public.retry_policy_id_seq'::regclass);


--
-- Name: rules rule_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rules ALTER COLUMN rule_id SET DEFAULT nextval('public.rules_rule_id_seq'::regclass);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (event_id);


--
-- Name: executions executions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.executions
    ADD CONSTRAINT executions_pkey PRIMARY KEY (execution_id);


--
-- Name: retry_policy retry_policy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.retry_policy
    ADD CONSTRAINT retry_policy_pkey PRIMARY KEY (id);


--
-- Name: rules rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rules
    ADD CONSTRAINT rules_pkey PRIMARY KEY (rule_id);


--
-- Name: events events_execution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.executions(execution_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict KhMfSe1AioSxAbi7OQDTJzasJhMhz8Sz3gePUBj8nYbSuq7hUfLIG6K7xjMShWE

