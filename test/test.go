package main

import (
	"errors"
	"fmt"

	"github.com/dgrijalva/jwt-go"
	"github.com/lestrrat/go-jwx/jwk"
)

// supposedly expires Jan 8 @ 2:30 pm CST.  Need to check again then to see if this actually parses

const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkRFUkNHRnYwNjJJZV85clYwdUtrVSJ9.eyJpc3MiOiJodHRwczovL2Rldi1ieHpoYTY2NWtmZ3owbHR6LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMDUyMjU3OTc1MDU4NjgyNDY1OCIsImF1ZCI6WyJodHRwOi8vbG9jYWxob3N0OjgwODAvIiwiaHR0cHM6Ly9kZXYtYnh6aGE2NjVrZmd6MGx0ei51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzA0NjU5MzAxLCJleHAiOjE3MDQ3NDU3MDEsImF6cCI6Imp1SzB1SHpnTmo3SDVscHNrYlB4MzRDRXpscVZZSHZGIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBhY2Nlc3M6Z2VuZXJhbCJ9.G6wrXRXR_aM5Xn9mYR57yvmHwsCLwK0-y5VtEEMGBJ0XOt8-4mqUseg3ANKYd-Q-WtMmAZKf58kATOKND6WSd3QGK-aJkrUkDhMhq88tx_FpOLXiCeFDjbhg22PE4vUyrXiF0gibpuklDEP_euIRiS37-RZQ5q9s0zicnvJ4sLD9Bbb5zbf3dam6bsEsFOv1uKcgCd2BAM1BDYkv5Ho0Zj6U5OttI6zH7AM4TRrNIwJNbfzL-GOH7q1NQBSLP4kZgtHUwNbzHbRVgcaMPLGUZvGhip4N_tII7l7Jqnalg5sblkeysl1aKyDVCslSaIgKvZfQDgBUI7hvQHH0qwuBrg"

const jwksURL = "https://dev-bxzha665kfgz0ltz.us.auth0.com/.well-known/jwks.json"

func getKey(token *jwt.Token) (interface{}, error) {

	// TODO: cache response so we don't have to make a request every time
	// we want to verify a JWT
	set, err := jwk.FetchHTTP(jwksURL)
	if err != nil {
		return nil, err
	}

	keyID, ok := token.Header["kid"].(string)
	if !ok {
		return nil, errors.New("expecting JWT header to have string kid")
	}

	if key := set.LookupKeyID(keyID); len(key) == 1 {
		return key[0].Materialize()
	}

	return nil, errors.New("unable to find key")
}

func main() {
	token, err := jwt.Parse(token, getKey)
	if err != nil {
		panic(err)
	}
	claims := token.Claims.(jwt.MapClaims)
	for key, value := range claims {
		fmt.Printf("claim: %s\t%v\n", key, value)
	}
}
