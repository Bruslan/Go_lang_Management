package data

import (
	"github.com/gocql/gocql"
	"time"
)

type Session struct {
	Session_id string
	User_id    gocql.UUID
	Email      string
	Created_at time.Time
}

// Check if session is valid in the database ***
func (sess *Session) SessValid() (b bool, user_id gocql.UUID) {
	// database session
	dbs, _ := db_session()
	defer dbs.Close()
	if err := dbs.Query(`SELECT user_id FROM user_keyspace.sessions WHERE session_id=?`, sess.Session_id).Scan(&user_id); err != nil {
		return false, user_id
	} else {
		return true, user_id
	}
}

// chekc if user has more than 5 sessions, if so: delete all his sessions
func (sess *Session) QuantityCheck() error {
	// database session
	dbs, _ := db_session()
	defer dbs.Close()

	var sessid string
	count := 0
	dbs.Query(`SELECT COUNT(*) FROM user_keyspace.session_by_user_id WHERE user_id=?`, sess.User_id).Scan(&count)
	if count > 0 {
		// delete all sessions:
		it := dbs.Query(`SELECT session_id FROM user_keyspace.session_by_user_id WHERE user_id=?`, sess.User_id).Iter()
		defer it.Close()
		for it.Scan(&sessid) {
			dbs.Query(`DELETE FROM user_keyspace.sessions WHERE session_id=? IF EXISTS`, sessid).Exec()
			dbs.Query(`DELETE FROM user_keyspace.session_by_user_id WHERE user_id=? AND session_id=? IF EXISTS`, sess.User_id, sessid).Exec()
		}
	}
	return nil
}

// deletes all sessions with session_id, and all sessions_by_userid by user_id
func (sess *Session) Delete() error {
	// database session
	dbs, _ := db_session()
	defer dbs.Close()
	var user_id gocql.UUID
	dbs.Query(`SELECT user_id FROM user_keyspace.sessions WHERE session_id=?`, sess.Session_id).Scan(&user_id)
	dbs.Query(`DELETE FROM user_keyspace.sessions WHERE session_id=? IF EXISTS`, sess.Session_id).Exec()
	dbs.Query(`DELETE FROM user_keyspace.session_by_user_id WHERE user_id=? AND session_id=? IF EXISTS`, user_id, sess.Session_id).Exec()
	return nil
}

// Get the user from the session
func (session *Session) User() (user User, err error) {
	// database session
	dbs, err := db_session()
	defer dbs.Close()
	err = dbs.Query(`SELECT user_id, email FROM user_keyspace.sessions WHERE session_id=?`, session.Session_id).Scan(
		&user.User_id,
		&user.Email)
	return
}

//////////////////////// BACKUP CODE ///////////////////////////////

/*func (sess *Session) SetInactive() (err error) {

	// database session
	dbs, err := db_session()
	if err != nil {
		return
	}
	defer dbs.Close()
	return dbs.Query(`UPDATE user_keyspace.sessions SET active=? WHERE session_id=? IF EXISTS`, false, sess.Session_id).Exec()
}*/
