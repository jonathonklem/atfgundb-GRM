package api

import (
	"net/http"
	"atfgundb.com/app/models"
	"atfgundb.com/app/db"
	"github.com/gin-gonic/gin"
	"log"
	"fmt"
	"strings"
    "strconv"
	"io/ioutil"
    "encoding/json"
)

type Response struct {
    AccessToken string `json:"access_token"`
    Scope       string `json:"scope"`
    ExpiresIn   int    `json:"expires_in"`
    TokenType   string `json:"token_type"`
}

type DeleteResponse struct {
	StatusCode 	int `json:"statusCode"`
}

func UserDeleteTest(c *gin.Context) {
	user_id := c.Query("user_id")
	if user_id == "" {
		c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "Invalid UserId"})
	}

	log.Println("Not actually deleting anything")
	c.JSON(http.StatusOK, models.Response{Success: true})
}

func UserDelete(c *gin.Context) {
	user_id := c.Query("user_id")
	if user_id == "" {
		c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "Invalid UserId"})
	}

	log.Println("Calling deleteuser")
	db.DeleteUser(user_id)

	// now we need to delete in auth0
	response := getToken()
	if isNumeric(user_id) {
        deleteUser("google-oauth2|"+user_id,response.AccessToken)
    } else if hasDot(user_id) {
        deleteUser("apple|"+user_id, response.AccessToken)
    } else {
        deleteUser("auth0|"+user_id, response.AccessToken)
    }

	c.JSON(http.StatusOK, models.Response{Success: true})
}

func UserSaveVisit(c *gin.Context) {
	var user models.User

	if err := c.BindJSON(&user); err != nil {
		log.Fatal("Unable to BindJSON")	
		c.JSON(http.StatusUnauthorized, models.Response{Success: false, Error: "System error"})
	}

	log.Println("Calling insertupdateuser")
	db.InsertUpdateUser(&user)
	c.JSON(http.StatusOK, models.Response{Success: true})
}

func getToken() Response {
	url := "https://dev-bxzha665kfgz0ltz.us.auth0.com/oauth/token"

	payload := strings.NewReader("grant_type=client_credentials&client_id=2hFrkeQxQBOmWiBjpiRHHAudeD1hrmJL&client_secret=2eNS6ZfF2VGGccBqU8piP7oOs8iJmQOt7NWu33TGkc7vAjlGcZlxQw4TrhXPj-uG&audience=https%3A%2F%2Fdev-bxzha665kfgz0ltz.us.auth0.com%2Fapi%2Fv2%2F")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("content-type", "application/x-www-form-urlencoded")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

    var response Response

    json.Unmarshal([]byte(body), &response)

    return response
}

func deleteUser(id string, token string) int {
  fmt.Println("Attempting to delete " + id)

  url := "https://dev-bxzha665kfgz0ltz.us.auth0.com/api/v2/users/" + id
  method := "DELETE"

  client := &http.Client {
  }
  req, err := http.NewRequest(method, url, nil)

  if err != nil {
    fmt.Println(err)
    return 400
  }
  req.Header.Add("Authorization", "Bearer " + token)

  res, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return 400
  }
  defer res.Body.Close()

  body, err := ioutil.ReadAll(res.Body)
  if err != nil {
    fmt.Println(err)
    return 400
  }

  var deleteResponse DeleteResponse

  fmt.Println("Check the body response here:");
  fmt.Println(string(body))
  json.Unmarshal([]byte(body), &deleteResponse);
  return deleteResponse.StatusCode
}

func isNumeric(s string) bool {
    _, err := strconv.ParseFloat(s, 64)
    return err == nil
}

func hasDot(s string) bool {
    return strings.Contains(s, ".")
}