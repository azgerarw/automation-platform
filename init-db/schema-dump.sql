--
-- PostgreSQL database cluster dump
--

\restrict ewjFfYhrWgc0cxJG9ERFk1uX6kRcJRoGJAXapud7aVmjsu0e3Qc5HwbV3Hep192

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:13mSsPWKRDFwrgijZmcnIA==$9u6IPeGl+1TFDJA3AB1/XZpZUisQqIbl7Q6ntGHx8+M=:tHAIepeSA1YLbSfADWyNLejUY0uBm5BekByuvjXJmMU=';

--
-- User Configurations
--








\unrestrict ewjFfYhrWgc0cxJG9ERFk1uX6kRcJRoGJAXapud7aVmjsu0e3Qc5HwbV3Hep192

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict MYBRcthJcWRxA5lJRe8l5dJfmEYyWGdsDNfcb8Z1cb8bJelbm2N9UdL9IESIAGU

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

--
-- PostgreSQL database dump complete
--

\unrestrict MYBRcthJcWRxA5lJRe8l5dJfmEYyWGdsDNfcb8Z1cb8bJelbm2N9UdL9IESIAGU

--
-- Database "auth_db" dump
--

--
-- PostgreSQL database dump
--

\restrict cOtuWeNr3TFRP697waNsTPcNKAW87Rb67eEaUzoWkOi1aBlL20VG6O6OXpIqFxC

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

--
-- Name: auth_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE auth_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE auth_db OWNER TO postgres;

\unrestrict cOtuWeNr3TFRP697waNsTPcNKAW87Rb67eEaUzoWkOi1aBlL20VG6O6OXpIqFxC
\connect auth_db
\restrict cOtuWeNr3TFRP697waNsTPcNKAW87Rb67eEaUzoWkOi1aBlL20VG6O6OXpIqFxC

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
-- Name: api_keys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.api_keys (
    api_key_id integer NOT NULL,
    user_id integer NOT NULL,
    api_key character varying NOT NULL,
    secret character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    usage integer DEFAULT 0,
    last_used timestamp without time zone
);


ALTER TABLE public.api_keys OWNER TO postgres;

--
-- Name: api_keys_api_key_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.api_keys_api_key_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.api_keys_api_key_id_seq OWNER TO postgres;

--
-- Name: api_keys_api_key_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.api_keys_api_key_id_seq OWNED BY public.api_keys.api_key_id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.refresh_tokens (
    refresh_token_id integer NOT NULL,
    user_id integer NOT NULL,
    token uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: refresh_tokens_refresh_token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refresh_tokens_refresh_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_refresh_token_id_seq OWNER TO postgres;

--
-- Name: refresh_tokens_refresh_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refresh_tokens_refresh_token_id_seq OWNED BY public.refresh_tokens.refresh_token_id;


--
-- Name: api_keys api_key_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_keys ALTER COLUMN api_key_id SET DEFAULT nextval('public.api_keys_api_key_id_seq'::regclass);


--
-- Name: refresh_tokens refresh_token_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN refresh_token_id SET DEFAULT nextval('public.refresh_tokens_refresh_token_id_seq'::regclass);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (api_key_id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (refresh_token_id);


--
-- PostgreSQL database dump complete
--

\unrestrict cOtuWeNr3TFRP697waNsTPcNKAW87Rb67eEaUzoWkOi1aBlL20VG6O6OXpIqFxC

--
-- Database "db" dump
--

--
-- PostgreSQL database dump
--

\restrict E2AEUV55Paqb0DQK4jEkfBjEb1cAl5mE4IWKhPhH6zZdMfEr2o4tqTvI2i8r4uJ

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

--
-- Name: db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE db OWNER TO postgres;

\unrestrict E2AEUV55Paqb0DQK4jEkfBjEb1cAl5mE4IWKhPhH6zZdMfEr2o4tqTvI2i8r4uJ
\connect db
\restrict E2AEUV55Paqb0DQK4jEkfBjEb1cAl5mE4IWKhPhH6zZdMfEr2o4tqTvI2i8r4uJ

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

--
-- PostgreSQL database dump complete
--

\unrestrict E2AEUV55Paqb0DQK4jEkfBjEb1cAl5mE4IWKhPhH6zZdMfEr2o4tqTvI2i8r4uJ

--
-- Database "microservices_db" dump
--

--
-- PostgreSQL database dump
--

\restrict M6heokJS45CadMOkQVbzde2UsuAz2UEXf0H2aT6DtHjR9Z5cOenQS7cmqyPfP55

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

--
-- Name: microservices_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE microservices_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE microservices_db OWNER TO postgres;

\unrestrict M6heokJS45CadMOkQVbzde2UsuAz2UEXf0H2aT6DtHjR9Z5cOenQS7cmqyPfP55
\connect microservices_db
\restrict M6heokJS45CadMOkQVbzde2UsuAz2UEXf0H2aT6DtHjR9Z5cOenQS7cmqyPfP55

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

CREATE TABLE IF NOT EXISTS public.microservices (
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

\unrestrict M6heokJS45CadMOkQVbzde2UsuAz2UEXf0H2aT6DtHjR9Z5cOenQS7cmqyPfP55

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict MmQxKAYnpoxs1EaEBJOERpa3pHIINN7Lu1MBQXiGTdFanJBihRB5JsOdkfrq98Z

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

--
-- PostgreSQL database dump complete
--

\unrestrict MmQxKAYnpoxs1EaEBJOERpa3pHIINN7Lu1MBQXiGTdFanJBihRB5JsOdkfrq98Z

--
-- Database "rule_db" dump
--

--
-- PostgreSQL database dump
--

\restrict KyhOjOsagQSBtFeFPs41aA1oc1zrNc7h72ZrDlAi4lff7eIps45qmdbSeaQS24w

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

--
-- Name: rule_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE rule_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE rule_db OWNER TO postgres;

\unrestrict KyhOjOsagQSBtFeFPs41aA1oc1zrNc7h72ZrDlAi4lff7eIps45qmdbSeaQS24w
\connect rule_db
\restrict KyhOjOsagQSBtFeFPs41aA1oc1zrNc7h72ZrDlAi4lff7eIps45qmdbSeaQS24w

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

\unrestrict KyhOjOsagQSBtFeFPs41aA1oc1zrNc7h72ZrDlAi4lff7eIps45qmdbSeaQS24w

--
-- Database "user_db" dump
--

--
-- PostgreSQL database dump
--

\restrict 2Nsf0TZzAaX0IqT5Cm7BdaJWWIrUNaWLISN1nGOBQZG7FgXfeCFm5gT1TReVpCv

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

--
-- Name: user_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE user_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE user_db OWNER TO postgres;

\unrestrict 2Nsf0TZzAaX0IqT5Cm7BdaJWWIrUNaWLISN1nGOBQZG7FgXfeCFm5gT1TReVpCv
\connect user_db
\restrict 2Nsf0TZzAaX0IqT5Cm7BdaJWWIrUNaWLISN1nGOBQZG7FgXfeCFm5gT1TReVpCv

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
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.users (
    user_id integer NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    password character varying(255) NOT NULL,
    role character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    alerts boolean DEFAULT true NOT NULL,
    active boolean DEFAULT true NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY (ARRAY[('admin'::character varying)::text, ('user'::character varying)::text])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- PostgreSQL database dump complete
--

\unrestrict 2Nsf0TZzAaX0IqT5Cm7BdaJWWIrUNaWLISN1nGOBQZG7FgXfeCFm5gT1TReVpCv

--
-- PostgreSQL database cluster dump complete
--

