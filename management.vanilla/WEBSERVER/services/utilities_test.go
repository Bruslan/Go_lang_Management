package services

import (
	"fmt"
	"testing"
	"time"
)

func TestCheck_age(t *testing.T) {

	m1, err := time.Parse("January", "March")
	if err != nil {
		fmt.Println("error parsing first month")
	}
	m2, err := time.Parse("January", "May")
	if err != nil {
		fmt.Println("error parsing second month")
	}

	bday := time.Date(2002, m1.Month(), 20, 0, 0, 0, 0, time.UTC)
	bday2 := time.Date(2001, m2.Month(), 19, 0, 0, 0, 0, time.UTC)

	if !check_age(bday2) {
		t.Error("user to young")
	}
	if !check_age(bday) {
		t.Error("user to young")
	}
}

func TestCheck_pw(t *testing.T) {

	// must trigger else
	if check_pw("aaa") {
		t.Error("pw to short not caught")
	} else {
		fmt.Println("pw to short detected")
	}
	if check_pw("aaaaaaaaaaaaaaaaaaaaa") {
		t.Error("pw to short not caught")
	} else {
		fmt.Println("pw to long detected")
	}
	if check_pw("sadaedaQSdaa") {
		t.Error("pw doesn't contain number not caught")
	} else {
		fmt.Println("pw doesn't contain number detected")
	}
	if check_pw("321231QDEEQAX") {
		t.Error("pw doesn't contain small letter not caught")
	} else {
		fmt.Println("pw doesn't small letter number detected")
	}
	if check_pw("refsefwfcw2131") {
		t.Error("pw doesn't conatin Cap Letter not caught")
	} else {
		fmt.Println("pw doesn't contain Cap Letter detected")
	}

	// must go into if
	if check_pw("jansen332AHA !H") {
		fmt.Println("Valid Password:", "jansen332AHA !H")
	}

}
