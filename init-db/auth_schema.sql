--
-- PostgreSQL database dump
--

\restrict YBSzKiCcCBc3sY3l4MAkLATiCOc4dQSNOxlBWmwAn4rlaADENJHHT6eD1v2qC9T

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
-- Name: api_keys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_keys (
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

\unrestrict YBSzKiCcCBc3sY3l4MAkLATiCOc4dQSNOxlBWmwAn4rlaADENJHHT6eD1v2qC9T

