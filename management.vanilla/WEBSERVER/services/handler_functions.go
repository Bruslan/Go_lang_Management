package services

import (
	"fmt"
	"github.com/vanilla/WEBSERVER/data"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

func GetFahrzeuge_table(writer http.ResponseWriter, request *http.Request) {

	_, err := sessionCheck(writer, request)
	if err != nil {
		warning("session check failed, get_fahrzeuge:", err)
	} else {

		fmt.Println("get wurde getriggert")
		// parse signup data
		fzge, err := data.GetFahrzeuge()
		/*fhr_prot, err := data.GetFahrzeugeProtokol(jsdata["Fahrzeugnummer"])*/
		if err != nil {
			fmt.Println("failure:", fzge)
			return_json(writer, false, "Fehler beim auslesen der Fahrzeuge")
		} else {
			fmt.Println("success:", fzge)
			return_json_data(writer, true, fzge)
		}

		/* add other get protocol */
	}
}

func GetProtocol(writer http.ResponseWriter, request *http.Request) {
	_, err := sessionCheck(writer, request)
	if err != nil {
		warning("session check failed, get_protocol:", err)
	} else {
		// parse signup data
		jsdata := body_to_json(request.Body)
		fmt.Println(jsdata)
		if jsdata["table_name"] == "fahrzeuge" {
			fhr_prot, err := data.GetFahrzeugeProtokol(jsdata["Fahrzeugnummer"])
			if err != nil {
				fmt.Println("failure:", fhr_prot)
				return_json(writer, false, "Fehler beim auslesen des Protocols")
			} else {
				fmt.Println("success:", fhr_prot)
				return_json_data(writer, true, fhr_prot)
			}
		}
		/* add other get protocol */
	}
}

func GetProtocol_table(writer http.ResponseWriter, request *http.Request) {

	_, err := sessionCheck(writer, request)
	if err != nil {
		warning("session check failed, get_fahrzeuge:", err)
	} else {

		fmt.Println("get wurde getriggert")
		// parse signup data
		fzge, err := data.GetFahrzeugeProtokol_Table()
		if err != nil {
			fmt.Println("failure:", fzge)
			return_json(writer, false, "Fehler beim auslesen der Fahrzeuge")
		} else {
			fmt.Println("success:", fzge)
			return_json_data(writer, true, fzge)
		}

		/* add other get protocol */
	}

}

// POST update table row:
func UpdateTableRow(writer http.ResponseWriter, request *http.Request) {
	sess, err := sessionCheck(writer, request)
	if err != nil {
		warning("session check failed, insert fahrzeuge:", err)
	} else {
		// parse signup data
		jsdata := body_to_json(request.Body)
		if jsdata["table_name"] == "fahrzeuge" {
			if err := data.UpdateRowFahrzeug(jsdata, sess.User_id); err != nil {
				return_json(writer, false, "Fahrzeug konnte nicht aktualisiert werden.")
				fmt.Println(err)
			} else {
				return_json(writer, true, "Fahrzeug update erfolgreich.")
			}
		}
		/* add other table update row */
	}
}

// POST: delete table row
func DeleteTableRow(writer http.ResponseWriter, request *http.Request) {
	_, err := sessionCheck(writer, request)
	if err != nil {
		warning("session check failed, insert fahrzeuge:", err)
	} else {
		// parse signup data
		jsdata := body_to_json(request.Body)
		if jsdata["table_name"] == "fahrzeuge" {
			if err := data.DeleteRowFahrzeug(jsdata["Fahrzeugnummer"]); err != nil {
				warning("Insert Fahrzeuge Error:", err)
				return_json(writer, false, "Fahrzeug konnte nicht gelöscht werden.")
			} else {
				return_json(writer, true, "Fahrzeug erfolgreich gelöscht.")
			}
		}
		/* add other table delete rows */
	}
}

// POST: insert table data
func InsertTable(writer http.ResponseWriter, request *http.Request) {
	sess, err := sessionCheck(writer, request)
	if err != nil {
		warning("session check failed, insert fahrzeuge:", err)
	} else {
		// parse signup data
		jsdata := body_to_json(request.Body)
		if jsdata["table_name"] == "fahrzeuge" {
			if err := data.InsertFahrzeuge(jsdata, sess.User_id); err != nil {
				warning("Insert Fahrzeuge Error:", err)
				return_json(writer, false, "Fahrzeug konnte nicht hinzugefügt werden.")
			} else {
				return_json(writer, true, "Fahrzeug wurde hinzugefügt.")
			}
		}
		/* add other table inserts */

	}
	/*fmt.Println(jsdata)*/
}

// GET /
func Index(writer http.ResponseWriter, request *http.Request) {
	_, err := sessionCheck(writer, request)
	if err != nil {
		generateHTML(writer, nil, "layout", "publayout", "home", "aboutus", "joinvanilla", "impressum", "terms", "privacy_policy", "faq", "software", "data", "mobile")
	} else {
		fzge, err := data.GetFahrzeuge()
		if err != nil {
			fmt.Println("ERRORRRRRR in GetFahrzeuge")
		} else {
			generateHTML(writer, fzge, "layout", "privlayout", "overview", "firma", "mitarbeiter", "auftraege", "finanzen", "vorlagen", "system", "impressum", "terms", "privacy_policy", "faq")
		}
	}
}

// POST /signup
func SignupAccount(writer http.ResponseWriter, request *http.Request) {
	// parse signup data
	jsdata := body_to_json(request.Body)

	// create user in database and check if already exists:
	user := data.User{
		Email: jsdata["email"],
		Pass:  jsdata["passw1"],
	}
	if err, stmt := user.Create(); err != nil || stmt != "" {
		return_json(writer, false, stmt)
	} else {
		// create session and answer back to javascript
		sess, err := user.CreateSession()
		if err != nil {
			info(err, "Cannot create session")
			return_json(writer, false, "Registration successful, try to login.")
		} else {
			cookie := http.Cookie{Name: "_ianzncookie", Value: sess.Session_id, HttpOnly: true}
			http.SetCookie(writer, &cookie)
			return_json(writer, true, "")
		}
	}
}

// POST /authenticate
func Authenticate(writer http.ResponseWriter, request *http.Request) {
	err := request.ParseForm()
	user, err := data.GetUserByEmail(request.PostFormValue("loginmail"))
	err = bcrypt.CompareHashAndPassword([]byte(user.Pass), []byte(request.PostFormValue("loginpw")))
	if err == nil {
		// create session
		sess := data.Session{User_id: user.User_id}
		err := sess.QuantityCheck()
		if err != nil {
			info(err, "Error on session reset")
		} else {
			sess, err = user.CreateSession()
			if err != nil {
				info(err, "Cannot create session")
			}
			cookie := http.Cookie{Name: "_ianzncookie", Value: sess.Session_id, HttpOnly: true}
			http.SetCookie(writer, &cookie)
		}
	}
	http.Redirect(writer, request, "/", 302)
}

// Get /delete_account
func DelAccount(writer http.ResponseWriter, request *http.Request) {
	cookie, err := request.Cookie("_ianzncookie")
	if err != http.ErrNoCookie {
		sess := data.Session{Session_id: cookie.Value}
		user, err := sess.User()

		// delete all user sessions and user
		if err = user.DeleteSessions(); err != nil {
			warning("Could not delete all sessions of user", err)
		}
		if err = user.Delete(); err != nil {
			warning("Could not delete User", err)
		}
	}
	http.Redirect(writer, request, "/", 302)
}

// GET /logout
func Logout(writer http.ResponseWriter, request *http.Request) {
	// check cookie uuid
	cookie, err := request.Cookie("_ianzncookie")
	if err != http.ErrNoCookie {
		info("Failed to get cookie", err)
		sess := data.Session{Session_id: cookie.Value}
		if err = sess.Delete(); err != nil {
			warning("Could not delete session", err)
		}
	}
	http.Redirect(writer, request, "/", 302)
}

/////////////////// BACKUP FUNCTIONS ///////////////////////////////

// GET /err?msg=
/*func Err(writer http.ResponseWriter, request *http.Request) {

	vals := request.URL.Query()
	//fmt.Println("Printing out request.URL.Query() values", vals)
	_, err := sessionCheck(writer, request)
	if err != nil {
		generateHTML(writer, vals.Get("msg"), "layout", "publayout", "public.navbar", "error")
	} else {
		generateHTML(writer, vals.Get("msg"), "layout", "privlayout", "private.navbar", "error")
	}
}
*/
