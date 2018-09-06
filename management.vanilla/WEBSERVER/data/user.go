package data

import (
	"github.com/gocql/gocql"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type User struct {
	User_id    gocql.UUID
	Username   string
	Email      string
	Pass       string
	Created_at time.Time
}

var cluster *gocql.ClusterConfig
var cluster2 *gocql.ClusterConfig

// init cassandra configuration
func init() {
	cluster = gocql.NewCluster("management_cassandra")
	cluster.Consistency = gocql.One
	cluster.Keyspace = "user_keyspace"
	cluster2 = gocql.NewCluster("management_cassandra")
	cluster2.Consistency = gocql.One
	cluster2.Keyspace = "management_keyspace"
}

// create cassandra session
func db_session() (dbs *gocql.Session, err error) {
	dbs, err = cluster.CreateSession()
	return
}
// create cassandra session
func db_session_management() (dbs *gocql.Session, err error) {
	dbs, err = cluster2.CreateSession()
	return
}

// Create a new session for an existing user
func (user *User) CreateSession() (ses Session, err error) {
	// database session
	dbs, err := db_session()
	defer dbs.Close()
	ses = Session{Session_id: gocql.TimeUUID().String(), User_id: user.User_id, Email: user.Email, Created_at: time.Now()}
	// insert session into sessions
	dbs.Query(`INSERT INTO user_keyspace.sessions (session_id, user_id, email, created_at) VALUES (?, ?, ?, ?) IF NOT EXISTS`,
		ses.Session_id,
		ses.User_id,
		ses.Email,
		ses.Created_at).Exec()
	// insert session into session_by_User_id
	dbs.Query(`INSERT INTO user_keyspace.session_by_user_id (user_id, session_id) VALUES (?, ?) IF NOT EXISTS`,
		ses.User_id,
		ses.Session_id).Exec()
	return
}

// Create a new user, save user info into the database
func (user *User) Create() (err error, stmt string) {
	// database session
	dbs, err := db_session()
	defer dbs.Close()
	user.User_id, err = gocql.RandomUUID()
	pw, err := bcrypt.GenerateFromPassword([]byte(user.Pass), 11)

	// insert user into user_by_email table
	if applied, err := dbs.Query(`INSERT INTO user_keyspace.user_by_email (email, pass, user_id) VALUES (?, ?, ?) IF NOT EXISTS`, user.Email, string(pw), user.User_id).ScanCAS(&user.Email, &user.Pass, &user.User_id); err != nil || !applied {
		stmt = "This Email already exists, please try another one."
		return err, stmt
	} else {
		// insert user into users table
		err = dbs.Query(`INSERT INTO user_keyspace.users (user_id, email, pass, created_at) VALUES (?, ?, ?, ?) IF NOT EXISTS`,
			user.User_id,
			user.Email,
			string(pw),
			time.Now()).Exec()
	}
	return
}

// Delete user from database
func (user *User) Delete() (err error) {
	// database session
	dbs, err := db_session()
	defer dbs.Close()
	err = dbs.Query(`DELETE FROM user_keyspace.user_by_email WHERE email=? IF EXISTS`, user.Email).Exec()
	err = dbs.Query(`DELETE FROM user_keyspace.users WHERE user_id=? IF EXISTS`, user.User_id).Exec()
	return err
}

// Delete all sessions of user
func (user *User) DeleteSessions() (err error) {
	// database session
	dbs, err := db_session()
	defer dbs.Close()

	var sessid string
	// get all session uuids
	it := dbs.Query(`SELECT session_id FROM user_keyspace.session_by_user_id WHERE user_id=?`, user.User_id).Iter()
	defer it.Close()
	for it.Scan(&sessid) {
		dbs.Query(`DELETE FROM user_keyspace.sessions WHERE session_id=? IF EXISTS`, sessid).Exec()
		dbs.Query(`DELETE FROM user_keyspace.session_by_user_id WHERE user_id=? AND session_id=? IF EXISTS`, user.User_id, sessid).Exec()
	}
	return
}

// Get a single user given the email
func GetUserByEmail(emailstr string) (user User, err error) {
	// database session
	dbs, err := db_session()
	defer dbs.Close()
	err = dbs.Query(`SELECT user_id, email, pass FROM user_keyspace.user_by_email WHERE email=?`, emailstr).Scan(
		&user.User_id,
		&user.Email,
		&user.Pass)
	return
}

// Get a single user given the UUID
func GetUserByUuid(uuid string) (user User, err error) {
	// database session
	dbs, err := db_session()
	defer dbs.Close()
	// convert to database uuid type
	go_uuid, err := gocql.ParseUUID(uuid)
	err = dbs.Query(`SELECT user_id, email, name, pass FROM user_keyspace.users WHERE user_id=?`, go_uuid).Scan(
		&user.User_id,
		&user.Email,
		&user.Pass)
	return
}

//////////////////////// BACKUP CODE ///////////////////////////////

// // Get all users in the database and returns it
// func Users() (users []User, err error) {
// 	rows, err := Db.Query("SELECT id, uuid, name, email, password, created_at FROM users")
// 	if err != nil {
// 		return
// 	}
// 	for rows.Next() {
// 		user := User{}
// 		if err = rows.Scan(&user.Id, &user.Uuid, &user.Name, &user.Email, &user.Password, &user.CreatedAt); err != nil {
// 			return
// 		}
// 		users = append(users, user)
// 	}
// 	rows.Close()
// 	return
// }
