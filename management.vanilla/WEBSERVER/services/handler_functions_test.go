package services

import (
	"crypto/tls"
	"golang.org/x/net/http2"
	//"io/ioutil"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

func TestRedirect(t *testing.T) {
	mux := http.NewServeMux()
	mux.HandleFunc("/", Redirect)

	writer := httptest.NewRecorder()
	request, _ := http.NewRequest("GET", "http://0.0.0.0/", nil)
	mux.ServeHTTP(writer, request)

	host := strings.Split(request.Host, ":")[0]
	if host != "0.0.0.0" {
		t.Errorf("Wrong Host Adress filtered: %v", host)
	}

	resp := writer.Result()
	if resp.Header["Location"][0] != "https://0.0.0.0:8901" {
		t.Errorf("Redirect goes to: %v", resp.Header["Location"])
	}
}

func TestIndex(t *testing.T) {

	mux := http.NewServeMux()
	mux.HandleFunc("/", Index)

	server := http.Server{
		Addr:    "0.0.0.0:8901",
		Handler: mux,
	}
	http2.ConfigureServer(&server, &http2.Server{})
	go server.ListenAndServeTLS("../letsencrypt/cert.pem", "../letsencrypt/key.pem")
	defer server.Close()
	time.Sleep(100 * time.Millisecond)

	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}
	resp, _ := client.Get("https://0.0.0.0:8901/")

	if resp.StatusCode != 200 {
		t.Errorf("Actual https status code= %d", resp.StatusCode)
	}

	//body, _ := ioutil.ReadAll(resp.Body)
	//fmt.Println(string(body))
}
