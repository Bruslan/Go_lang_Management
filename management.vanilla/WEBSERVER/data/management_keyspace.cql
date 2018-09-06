DROP KEYSPACE IF EXISTS management_keyspace;

CREATE KEYSPACE IF NOT EXISTS management_keyspace WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

CREATE TABLE IF NOT EXISTS management_keyspace.fahrzeuge (
	fahrzeugnummer_in uuid,
	kennzeichen_in text,
	kilometerstand_in int,
	mitarbeiternummer_in set<text>,
	notiz_in text,
	servicefallig_in date,
	tuvbis_in date,
	PRIMARY KEY ((fahrzeugnummer_in))
);

CREATE TABLE IF NOT EXISTS management_keyspace.fahrzeuge_protokoll (
	fahrzeugnummer_in uuid,
	kennzeichen_in text,
	mitarbeiternummer_in set<text>,
	tuvbis_in date,
	servicefallig_in date,
	kilometerstand_in int,
	notiz_in text,
	created_at timestamp,
	created_by text,
	PRIMARY KEY ((fahrzeugnummer_in), created_at)
) WITH CLUSTERING ORDER BY (created_at DESC);

CREATE TABLE IF NOT EXISTS management_keyspace.mitarbeiter (
	nr uuid,
	status text,
	beschaeftigungsart text,
	arbeits_std_pro_tag int,
	beschaeftigt_von date,
	beschaeftigt_bis date,
	urlaubstage int,
	anrede text,
	vorname text,
	name text,
	adresszusatz text,
	strasse text,
	plz int,
	ort text,
	email text,
	telefon int,
	geboren_am date,
	notiz text,
	bank_iban int,
	bankleitzahl text,
	konto_nr int,
	bank_name text,
	PRIMARY KEY ((nr))
);

CREATE TABLE IF NOT EXISTS management_keyspace.mitarbeiter_protokoll (
	nr uuid,
	status text,
	beschaeftigungsart text,
	arbeits_std_pro_tag int,
	beschaeftigt_von date,
	beschaeftigt_bis date,
	urlaubstage int,
	anrede text,
	vorname text,
	name text,
	adresszusatz text,
	strasse text,
	plz int,
	ort text,
	email text,
	telefon int,
	geboren_am date,
	notiz text,
	bank_iban int,
	bankleitzahl text,
	konto_nr int,
	bank_name text,
	created_at timestamp,
	created_by uuid,
	PRIMARY KEY ((nr), created_at)
) WITH CLUSTERING ORDER BY (created_at DESC);

CREATE TABLE IF NOT EXISTS management_keyspace.auftraggeber (
	object_id uuid,
	api text,
	type text,
	data text,
	created_at timestamp,
	PRIMARY KEY ((object_id))
);

CREATE TABLE IF NOT EXISTS management_keyspace.objekte (
	result_id uuid,
	api text,
	type text,
	data text,
	created_at timestamp,
	PRIMARY KEY ((result_id))
);

CREATE TABLE IF NOT EXISTS management_keyspace.leistungen (
	result_id uuid,
	api text,
	type text,
	data text,
	created_at timestamp,
	PRIMARY KEY ((result_id))
);

CREATE TABLE IF NOT EXISTS management_keyspace.aushang (
	result_id uuid,
	api text,
	type text,
	data text,
	created_at timestamp,
	PRIMARY KEY ((result_id))
);

CREATE TABLE IF NOT EXISTS management_keyspace.firma (
	result_id uuid,
	api text,
	type text,
	data text,
	created_at timestamp,
	PRIMARY KEY ((result_id))
);

CREATE TABLE IF NOT EXISTS management_keyspace.jahr_rechnungen (
	result_id uuid,
	api text,
	type text,
	data text,
	created_at timestamp,
	PRIMARY KEY ((result_id))
);

CREATE TABLE IF NOT EXISTS management_keyspace.gerate (
	result_id uuid,
	api text,
	type text,
	data text,
	created_at timestamp,
	PRIMARY KEY ((result_id))
);

CREATE TABLE IF NOT EXISTS management_keyspace.rechnung_angebot_termine (
	result_id uuid,
	api text,
	type text,
	data text,
	created_at timestamp,
	PRIMARY KEY ((result_id))
);

CREATE TABLE IF NOT EXISTS management_keyspace.mitarbeiter_stunden (
	result_id uuid,
	api text,
	type text,
	data text,
	created_at timestamp,
	PRIMARY KEY ((result_id))
);

CREATE TABLE IF NOT EXISTS management_keyspace.zahler_stunde (
	result_id uuid,
	api text,
	type text,
	data text,
	created_at timestamp,
	PRIMARY KEY ((result_id))
);

CREATE TABLE IF NOT EXISTS management_keyspace.zahlung (
	result_id uuid,
	api text,
	type text,
	data text,
	created_at timestamp,
	PRIMARY KEY ((result_id))
);

