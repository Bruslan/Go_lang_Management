package main

import (
	"fmt"
	"github.com/vanilla/WEBSERVER/services"
	"golang.org/x/net/http2"
	"log"
	"net/http"
	"strings"
)

// catches HTTP requests and redirect to HTTPS:
func http_redirect(writer http.ResponseWriter, request *http.Request) {
	host := strings.Split(request.Host, ":")[0]
	addr := "https://" + host + ":" + services.Config.HttpsPort
	http.Redirect(writer, request, addr, http.StatusMovedPermanently)
}

// main HTTPS Server:
func main() {
	// redirect every http request to https
	http_addr := services.Config.Address + ":" + services.Config.HttpPort
	go http.ListenAndServe(http_addr, http.HandlerFunc(http_redirect))
	mux := http.NewServeMux()

	// serving css and js files:
	statics := http.FileServer(http.Dir(services.Config.Static))
	mux.Handle("/cssjs/", http.StripPrefix("/cssjs/", statics))

	// defined in server_routes.go
	mux.HandleFunc("/", services.Index)

	// defined in handler_functions.go
	mux.HandleFunc("/signup_account", services.SignupAccount)
	mux.HandleFunc("/authenticate", services.Authenticate)
	mux.HandleFunc("/logout", services.Logout)
	mux.HandleFunc("/delete_account", services.DelAccount)

	// handling inserts:
	mux.HandleFunc("/insert_table", services.InsertTable)
	mux.HandleFunc("/delete_table_row", services.DeleteTableRow)
	mux.HandleFunc("/update_table_row", services.UpdateTableRow)
	mux.HandleFunc("/get_protocol", services.GetProtocol)

	mux.HandleFunc("/get_fahrzeuge", services.GetFahrzeuge_table)
	mux.HandleFunc("/get_protocol_table", services.GetProtocol_table)

	server := http.Server{
		Addr:    services.Config.Address + ":" + services.Config.HttpsPort,
		Handler: mux,
	}
	fmt.Println("server listening on localhost:" + services.Config.HttpsPort)
	http2.ConfigureServer(&server, &http2.Server{})
	log.Fatal(server.ListenAndServeTLS("letsencrypt/cert.pem", "letsencrypt/key.pem"))
}
