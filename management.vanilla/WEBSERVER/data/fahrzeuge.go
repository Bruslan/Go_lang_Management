package data

import (
	"fmt"
	"github.com/gocql/gocql"
	"strconv"
	"strings"
	"time"
)

type Fahrzeug struct {
	Kennzeichen_in       string
	Fahrzeugnummer_in    string
	Kilometerstand_in    int
	Mitarbeiternummer_in []string
	Notiz_in             string
	Servicefallig_in     string // format must be: 'yyyy-mm-dd' at insert
	Tuvbis_in            string // format must be: 'yyyy-mm-dd' at insert
}

type FahrzeugProtokol struct {
	Kennzeichen_in       string
	Fahrzeugnummer_in    string
	Kilometerstand_in    int
	Mitarbeiternummer_in []string
	Notiz_in             string
	Servicefallig_in     string // format must be: 'yyyy-mm-dd'
	Tuvbis_in            string // format must be: 'yyyy-mm-dd'
	Erstellt             string
	Erstellt_von         string
}

func GetFahrzeuge() (fzg []Fahrzeug, err error) {
	dbs, err := db_session_management()
	defer dbs.Close()
	//iter := dbs.Query(`SELECT * FROM management_keyspace.fahrzeuge`).Iter()
	iter := dbs.Query(`SELECT * FROM management_keyspace.fahrzeuge`).Iter()

	fmt.Println(iter)
	defer iter.Close()
	fz := Fahrzeug{}
	var service, tuv time.Time
	for iter.Scan(&fz.Fahrzeugnummer_in, &fz.Kennzeichen_in, &fz.Kilometerstand_in, &fz.Mitarbeiternummer_in, &fz.Notiz_in, &service, &tuv) {
		fmt.Println(fz.Kilometerstand_in, fz.Mitarbeiternummer_in, fz.Notiz_in)
		fz.Servicefallig_in, fz.Tuvbis_in = service.Format("02-01-2006"), tuv.Format("02-01-2006")
		if fz.Servicefallig_in == "01-01-0001" { // date handling
			fz.Servicefallig_in = "-"
		}
		if fz.Tuvbis_in == "01-01-0001" { // date handling
			fz.Tuvbis_in = "-"
		}
		if fz.Notiz_in == "" { // string handling
			fz.Notiz_in = "-"
		}
		if fz.Kennzeichen_in == "" { // string handling
			fz.Kennzeichen_in = "-"
		}
		fzg = append(fzg, fz)
	}
	return
}

func GetFahrzeugeProtokol_Table() (fzg_prot []FahrzeugProtokol, err error) {
	dbs, err := db_session_management()
	defer dbs.Close()
	fzp := FahrzeugProtokol{}
	var service2, tuv2, created_at time.Time
	iter := dbs.Query(`SELECT * FROM management_keyspace.fahrzeuge_protokoll`).Iter()
	fmt.Println("Protocoll :", iter)
	defer iter.Close()
	for iter.Scan(&fzp.Fahrzeugnummer_in, &created_at, &fzp.Erstellt_von, &fzp.Kennzeichen_in, &fzp.Kilometerstand_in, &fzp.Mitarbeiternummer_in, &fzp.Notiz_in, &service2, &tuv2) {
		fmt.Println(fzp.Kilometerstand_in, fzp.Mitarbeiternummer_in, fzp.Notiz_in, "------- inside fahrzeuge protocol")

		fzp.Erstellt = created_at.Format("02-01-2006")
		fzp.Servicefallig_in, fzp.Tuvbis_in = service2.Format("02-01-2006"), tuv2.Format("02-01-2006")
		if fzp.Servicefallig_in == "01-01-0001" { // date handling
			fzp.Servicefallig_in = "-"
		}
		if fzp.Tuvbis_in == "01-01-0001" { // date handling
			fzp.Tuvbis_in = "-"
		}
		if fzp.Notiz_in == "" { // string handling
			fzp.Notiz_in = "-"
		}
		fzg_prot = append(fzg_prot, fzp)
	}
	return
}

func GetFahrzeugeProtokol(fahrzeugnummer string) (fzg_prot []FahrzeugProtokol, err error) {
	dbs, err := db_session_management()
	defer dbs.Close()
	fz_nr, _ := gocql.ParseUUID(fahrzeugnummer)
	fmt.Println(fz_nr)
	fzp := FahrzeugProtokol{}
	var service2, tuv2, created_at time.Time
	iter := dbs.Query(`SELECT * FROM management_keyspace.fahrzeuge_protokoll WHERE fahrzeugnummer_in=?`, fz_nr).Iter()
	defer iter.Close()
	for iter.Scan(&fzp.Fahrzeugnummer_in, &created_at, &fzp.Erstellt_von, &fzp.Kennzeichen_in, &fzp.Kilometerstand_in, &fzp.Mitarbeiternummer_in, &fzp.Notiz_in, &service2, &tuv2) {
		fmt.Println(fzp.Kilometerstand_in, fzp.Mitarbeiternummer_in, fzp.Notiz_in, "------- inside fahrzeuge protocol")

		fzp.Erstellt = created_at.Format("02-01-2006")
		fzp.Servicefallig_in, fzp.Tuvbis_in = service2.Format("02-01-2006"), tuv2.Format("02-01-2006")
		if fzp.Servicefallig_in == "01-01-0001" { // date handling
			fzp.Servicefallig_in = "-"
		}
		if fzp.Tuvbis_in == "01-01-0001" { // date handling
			fzp.Tuvbis_in = "-"
		}
		if fzp.Notiz_in == "" { // string handling
			fzp.Notiz_in = "-"
		}
		fzg_prot = append(fzg_prot, fzp)
	}
	return
}

func InsertFahrzeuge(fzg_data map[string]string, creator gocql.UUID) (err error) {
	dbs, err := db_session_management()
	defer dbs.Close()

	fzg_nr, err := gocql.RandomUUID()
	_, umap := convertValueFahrzeug(fzg_data)
	if applied, err := dbs.Query(`INSERT INTO management_keyspace.fahrzeuge (kennzeichen_in, fahrzeugnummer_in, kilometerstand_in, mitarbeiternummer_in, notiz_in, servicefallig_in, tuvbis_in) VALUES ( ?,?,?,?,?,?,?) IF NOT EXISTS`,
		umap["kennzeichen_in"],
		fzg_nr,
		umap["kilometerstand_in"],
		umap["mitarbeiternummer_in"],
		umap["notiz_in"],
		umap["servicefallig_in"],
		umap["tuvbis_in"]).ScanCAS(fzg_data["kennzeichen_in"], &fzg_nr, umap["kilometerstand_in"], umap["mitarbeiternummer_in"], umap["notiz_in"], umap["servicefallig_in"], umap["tuvbis_in"]); err != nil || !applied {
		return err
	} /* todo: catch if exist applied */
	err = dbs.Query(`INSERT INTO management_keyspace.fahrzeuge_protokoll (kennzeichen_in, fahrzeugnummer_in, kilometerstand_in, mitarbeiternummer_in, notiz_in, servicefallig_in, tuvbis_in, created_at, created_by) VALUES ( ?,?,?,?,?,?,?,?,?) IF NOT EXISTS`,
		umap["kennzeichen_in"],
		fzg_nr,
		umap["kilometerstand_in"],
		umap["mitarbeiternummer_in"],
		umap["notiz_in"],
		umap["servicefallig_in"],
		umap["tuvbis_in"],
		time.Now(),
		creator.String()).Exec()
	return
}

func DeleteRowFahrzeug(fahrzeugnummer string) (err error) {
	dbs, err := db_session_management()
	defer dbs.Close()
	fz_nr, _ := gocql.ParseUUID(fahrzeugnummer)
	if err = dbs.Query(`DELETE FROM management_keyspace.fahrzeuge WHERE fahrzeugnummer_in=? IF EXISTS`, fz_nr).Exec(); err != nil {
		return
	}
	err = dbs.Query(`DELETE FROM management_keyspace.fahrzeuge_protokoll WHERE fahrzeugnummer_in=?`, fz_nr).Exec()
	return
}

func UpdateRowFahrzeug(fzg_data map[string]string, creator gocql.UUID) (err error) {
	dbs, err := db_session_management()
	defer dbs.Close()
	fmt.Println(fzg_data)
	fzg_nr, umap := convertValueFahrzeug(fzg_data)
	fmt.Println(umap, fzg_nr)
	for key, data := range umap {
		if err = dbs.Query(`UPDATE management_keyspace.fahrzeuge SET `+key+`=? WHERE fahrzeugnummer_in=? IF EXISTS`, data, fzg_nr).Exec(); err != nil {
			fmt.Println(err)
			return
		}
	}
	err = dbs.Query(`INSERT INTO management_keyspace.fahrzeuge_protokoll (kennzeichen_in, fahrzeugnummer_in, kilometerstand_in, mitarbeiternummer_in, notiz_in, servicefallig_in, tuvbis_in, created_at, created_by) VALUES (?,?,?,?,?,?,?,?,?) IF NOT EXISTS`,
		umap["kennzeichen_in"],
		fzg_nr,
		umap["kilometerstand_in"],
		umap["mitarbeiternummer_in"],
		umap["notiz_in"],
		umap["servicefallig_in"],
		umap["tuvbis_in"],
		time.Now(),
		creator.String()).Exec()
	return
}

func convertValueFahrzeug(fzg_data map[string]string) (fz_nr gocql.UUID, umap map[string]interface{}) {
	fz_nr, _ = gocql.ParseUUID(fzg_data["Fahrzeugnummer"])
	umap = make(map[string]interface{})
	if fzg_data["Kilometerstand"] != "" {
		umap["kilometerstand_in"], _ = strconv.Atoi(fzg_data["Kilometerstand"])
	} else {
		umap["kilometerstand_in"] = nil
	}
	if fzg_data["Servicefallig"] != "" {
		s := strings.Split(fzg_data["Servicefallig"], "-")
		umap["servicefallig_in"] = s[2] + "-" + s[1] + "-" + s[0] /* necessary cause maps(can change size) and address not allowed to assign to pointer*/
	} else {
		umap["servicefallig_in"] = nil
	}
	if fzg_data["Tuvbis"] != "" {
		s := strings.Split(fzg_data["Tuvbis"], "-")
		umap["tuvbis_in"] = s[2] + "-" + s[1] + "-" + s[0] /* necessary cause maps(can change size) and address not allowed to assign to pointer*/
	} else {
		umap["tuvbis_in"] = nil
	}
	if fzg_data["Mitarbeiternummer"] != "" {
		umap["mitarbeiternummer_in"] = strings.Split(fzg_data["Mitarbeiternummer"], ",")
	} else {
		umap["mitarbeiternummer_in"] = nil
	}
	if fzg_data["Notiz"] != "" {
		umap["notiz_in"] = fzg_data["Notiz"]
	} else {
		umap["notiz_in"] = nil
	}
	if fzg_data["Kennzeichen"] != "" {
		umap["kennzeichen_in"] = fzg_data["Kennzeichen"]
	} else {
		umap["kennzeichen_in"] = nil
	}
	return
}
