package data

import (
	"github.com/gocql/gocql"
)

type Mitarbeiter struct {
	Nr                  gocql.UUID
	Status              string
	Beschaeftigungsart  string
	Arbeits_std_pro_tag int
	Beschaeftigt_von    string
	Beschaeftigt_bis    string
	Urlaubstage         int
	Anrede              string
	Vorname             string
	Name                string
	Adresszusatz        string
	Strasse             string
	Plz                 int
	Ort                 string
	Email               string
	Telefon             int
	Geboren_am          string
	Notiz               string
	Bank_iban           int
	Bankleitzahl        string
	Konto_nr            int
	Bank_name           string
}

func GetMitarbeiterNames() (names []string, err error) {
	dbs, err := db_session_management()
	defer dbs.Close()
	var name string
	iter := dbs.Query(`SELECT name FROM management_keyspace.mitarbeiter`).Iter()
	defer iter.Close()
	for iter.Scan(&name) {
		names = append(names)
	}
	return
}
