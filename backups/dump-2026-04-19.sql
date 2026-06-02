--
-- PostgreSQL database cluster dump
--

\restrict FiwvydzafLXTMJOe7AgUc5Hz7z0dspgsISnk6qX4557NLYPURYB1iVUhobl2Ges

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








\unrestrict FiwvydzafLXTMJOe7AgUc5Hz7z0dspgsISnk6qX4557NLYPURYB1iVUhobl2Ges

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

\restrict ku3MUSPd2UVDA1C9fKa3Ln0mt7cq0BP44JuHWNMimHGqB352k4NFgHHnoaN5Ulg

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

\unrestrict ku3MUSPd2UVDA1C9fKa3Ln0mt7cq0BP44JuHWNMimHGqB352k4NFgHHnoaN5Ulg

--
-- Database "auth_db" dump
--

--
-- PostgreSQL database dump
--

\restrict X9DcPOfcN8HFlo72g2bHZaNob7kP7AGIKT7CWHSPfGYaMbwz0ia2c9jkPmgWMgw

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

\unrestrict X9DcPOfcN8HFlo72g2bHZaNob7kP7AGIKT7CWHSPfGYaMbwz0ia2c9jkPmgWMgw
\connect auth_db
\restrict X9DcPOfcN8HFlo72g2bHZaNob7kP7AGIKT7CWHSPfGYaMbwz0ia2c9jkPmgWMgw

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

CREATE TABLE public.api_keys (
    api_key_id integer NOT NULL,
    user_id integer NOT NULL,
    api_key character varying NOT NULL,
    secret character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
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

CREATE TABLE public.refresh_tokens (
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
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_keys (api_key_id, user_id, api_key, secret, created_at) FROM stdin;
1	1	d789a377439a66693338f40db3ed9bce	$2b$10$6VTNq09qmIWkqqw.jLsereCnYQ1ZbEfR7v2JLBN92snaExPuANl/m	2026-04-18 10:35:17.009104
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (refresh_token_id, user_id, token, created_at) FROM stdin;
1	1	b75bd88c-c514-480c-abc3-44aa40eebaa0	2026-04-18 09:31:44.855576
2	1	ef3cb902-c050-4dda-b42d-9067338dbc0d	2026-04-18 10:34:58.802257
3	1	6d484efa-a21a-42d5-87c5-67a4c5081b43	2026-04-19 13:58:42.414069
\.


--
-- Name: api_keys_api_key_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.api_keys_api_key_id_seq', 1, true);


--
-- Name: refresh_tokens_refresh_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refresh_tokens_refresh_token_id_seq', 3, true);


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

\unrestrict X9DcPOfcN8HFlo72g2bHZaNob7kP7AGIKT7CWHSPfGYaMbwz0ia2c9jkPmgWMgw

--
-- Database "db" dump
--

--
-- PostgreSQL database dump
--

\restrict LeK9cBK8GdA66gZypXZnWJECKtoiex3j99d5VK2xm4g9E7ZkjUL1ZiauQhGEStK

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

\unrestrict LeK9cBK8GdA66gZypXZnWJECKtoiex3j99d5VK2xm4g9E7ZkjUL1ZiauQhGEStK
\connect db
\restrict LeK9cBK8GdA66gZypXZnWJECKtoiex3j99d5VK2xm4g9E7ZkjUL1ZiauQhGEStK

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

\unrestrict LeK9cBK8GdA66gZypXZnWJECKtoiex3j99d5VK2xm4g9E7ZkjUL1ZiauQhGEStK

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict KhzHeGCvWepmcdimBS03qn9xOF48pabI7y6gpefkzT6m9MsXoJ0LBfurhnq8kiW

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

\unrestrict KhzHeGCvWepmcdimBS03qn9xOF48pabI7y6gpefkzT6m9MsXoJ0LBfurhnq8kiW

--
-- Database "rule_db" dump
--

--
-- PostgreSQL database dump
--

\restrict VF3mbV5EaSKCvlLdmvSuAPBYJ4WIP17i0cH3fFWRVyGSuL6EPe0oXDRM8RSjWpK

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

\unrestrict VF3mbV5EaSKCvlLdmvSuAPBYJ4WIP17i0cH3fFWRVyGSuL6EPe0oXDRM8RSjWpK
\connect rule_db
\restrict VF3mbV5EaSKCvlLdmvSuAPBYJ4WIP17i0cH3fFWRVyGSuL6EPe0oXDRM8RSjWpK

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

CREATE TABLE public.events (
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

CREATE TABLE public.executions (
    execution_id uuid NOT NULL,
    user_id integer NOT NULL,
    payload jsonb NOT NULL,
    correlation_id uuid NOT NULL,
    status text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    finished_at timestamp without time zone,
    last_event_at timestamp without time zone DEFAULT now(),
    CONSTRAINT executions_status_check CHECK ((status = ANY (ARRAY['running'::text, 'completed'::text, 'failed'::text])))
);


ALTER TABLE public.executions OWNER TO postgres;

--
-- Name: rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rules (
    rule_id integer NOT NULL,
    user_id integer NOT NULL,
    rule jsonb NOT NULL,
    event_type character varying NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT rules_rule_check CHECK (((rule ? 'trigger'::text) AND (jsonb_typeof((rule -> 'trigger'::text)) = 'string'::text) AND (rule ? 'conditions'::text) AND (jsonb_typeof((rule -> 'conditions'::text)) = 'string'::text) AND (rule ? 'actions'::text) AND (jsonb_typeof((rule -> 'actions'::text)) = 'array'::text)))
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
-- Name: rules rule_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rules ALTER COLUMN rule_id SET DEFAULT nextval('public.rules_rule_id_seq'::regclass);


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (event_id, user_id, event_type, payload, correlation_id, status, created_at, execution_id) FROM stdin;
1	1	payment.succeeded	{"amount": 100.0}	c6f1d8fe-45b5-4eac-8994-23930ebd803d	processed	2026-04-18 13:51:10.001743	658f3cf8-b7d1-40b5-96cf-4efd7d1261f0
2	1	payment.succeeded	{"amount": 110.0}	c6f1d8fe-45b5-4eac-8994-23930ebd803d	processed	2026-04-18 13:52:19.572429	658f3cf8-b7d1-40b5-96cf-4efd7d1261f0
5	1	payment.succeeded	{"amount": 105.0}	f7580d65-e92d-442c-9874-b72bdb8128d1	processed	2026-04-18 14:27:18.912781	2f3a2e1d-7ea6-463a-9c39-f210ac9e967b
6	1	payment.succeeded	{"amount": 105.0}	f7580d65-e92d-442c-9874-b72bdb8128d1	processed	2026-04-18 14:28:20.100062	df4860ee-e274-4b2d-b4bd-c3576627ca4f
7	1	payment.succeeded	{"amount": 105.0}	f7580d65-e92d-442c-9874-b72bdb8128d1	processed	2026-04-18 14:30:48.972094	aecf77b7-6448-4f83-8e7f-adb348e0b34b
8	1	payment.succeeded	{"amount": 115.0}	cd6ca451-e6d0-47d7-b556-a47e37009d57	processed	2026-04-18 18:48:39.605363	64cdc60c-c52c-4c55-89c4-fb1db6da990a
9	1	payment.succeeded	{"amount": 102.0}	cd6ca451-e6d0-47d7-b556-a47e37009d57	processed	2026-04-18 18:50:09.751152	88c7715c-bac6-4e85-b297-66011ab73512
\.


--
-- Data for Name: executions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.executions (execution_id, user_id, payload, correlation_id, status, created_at, finished_at, last_event_at) FROM stdin;
658f3cf8-b7d1-40b5-96cf-4efd7d1261f0	1	{"amount": 100}	c6f1d8fe-45b5-4eac-8994-23930ebd803d	completed	2026-04-18 13:51:09.910713	2026-04-18 13:52:19.598517	2026-04-18 13:52:19.492495
2f3a2e1d-7ea6-463a-9c39-f210ac9e967b	1	{"amount": 105}	f7580d65-e92d-442c-9874-b72bdb8128d1	completed	2026-04-18 14:27:18.81012	2026-04-18 14:27:18.966438	2026-04-18 14:30:48.857511
df4860ee-e274-4b2d-b4bd-c3576627ca4f	1	{"amount": 105}	f7580d65-e92d-442c-9874-b72bdb8128d1	completed	2026-04-18 14:28:20.058372	2026-04-18 14:28:20.127499	2026-04-18 14:30:48.857511
aecf77b7-6448-4f83-8e7f-adb348e0b34b	1	{"amount": 105}	f7580d65-e92d-442c-9874-b72bdb8128d1	completed	2026-04-18 14:30:48.86735	2026-04-18 14:30:49.003676	2026-04-18 14:30:48.86735
64cdc60c-c52c-4c55-89c4-fb1db6da990a	1	{"amount": 115}	cd6ca451-e6d0-47d7-b556-a47e37009d57	completed	2026-04-18 18:48:39.471861	2026-04-18 18:48:39.638748	2026-04-18 18:50:09.652949
88c7715c-bac6-4e85-b297-66011ab73512	1	{"amount": 102}	cd6ca451-e6d0-47d7-b556-a47e37009d57	completed	2026-04-18 18:50:09.671138	2026-04-18 18:50:09.777064	2026-04-18 18:50:09.671138
\.


--
-- Data for Name: rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rules (rule_id, user_id, rule, event_type, active, created_at) FROM stdin;
1	1	{"actions": ["send_discord"], "trigger": "payment.succeeded", "conditions": "amount > 99"}	payment.succeeded	t	2026-04-18 10:46:36.031344
\.


--
-- Name: events_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_event_id_seq', 9, true);


--
-- Name: rules_rule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rules_rule_id_seq', 1, true);


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
-- Name: rules rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rules
    ADD CONSTRAINT rules_pkey PRIMARY KEY (rule_id);


--
-- Name: events events_execution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.executions(execution_id);


--
-- PostgreSQL database dump complete
--

\unrestrict VF3mbV5EaSKCvlLdmvSuAPBYJ4WIP17i0cH3fFWRVyGSuL6EPe0oXDRM8RSjWpK

--
-- Database "user_db" dump
--

--
-- PostgreSQL database dump
--

\restrict dYanUKUcABAqQuT2u44r1ZcVeXTiONJ2fexUltHLLCPdfBVLOr5OcDMkV8UDbhM

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

\unrestrict dYanUKUcABAqQuT2u44r1ZcVeXTiONJ2fexUltHLLCPdfBVLOr5OcDMkV8UDbhM
\connect user_db
\restrict dYanUKUcABAqQuT2u44r1ZcVeXTiONJ2fexUltHLLCPdfBVLOr5OcDMkV8UDbhM

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

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    password character varying(255) NOT NULL,
    role character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying])::text[])))
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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, email, password, role, created_at) FROM stdin;
1	user	user@test.com	$2b$12$I43Q6WLfvhBwXtleKF/Pbuqehh9LdR1.Ik6Ern5ekykL/SStkRlEK	user	2026-04-18 09:26:37.115169
\.


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, true);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- PostgreSQL database dump complete
--

\unrestrict dYanUKUcABAqQuT2u44r1ZcVeXTiONJ2fexUltHLLCPdfBVLOr5OcDMkV8UDbhM

--
-- PostgreSQL database cluster dump complete
--

