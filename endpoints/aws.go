package main

import (
	"atfgundb.com/app/api"
	"atfgundb.com/app/routing"
	"atfgundb.com/app/db"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	engine := routing.Build()

	// prime our mongo connection
	_ = db.GetClient()
	defer db.KillClient()

	// You may notice that this is identical to our localdev setup.
	// As you add more endpoints, you may wish to store the endpoints in a separate list, used by both localdev and aws.
	routing.AddRoute(engine, "/guns", routing.GET, api.ListGuns)
	routing.AddRoute(engine, "/guns/add", routing.POST, api.AddGun)
	routing.AddRoute(engine, "/guns/addMaintenance", routing.POST, api.AddMaintenanceToGun)
	routing.AddRoute(engine, "/guns/addAccessory", routing.POST, api.AddAccessoryToGun)
	routing.AddRoute(engine, "/guns/remove", routing.GET, api.RemoveGun)
	routing.AddRoute(engine, "/guns/edit", routing.POST, api.EditGun)
	routing.AddRoute(engine, "/ammo", routing.GET, api.ListAmmo)
	routing.AddRoute(engine, "/ammo/add", routing.POST, api.AddAmmo)
	routing.AddRoute(engine, "/ammo/dispose", routing.GET, api.DisposeAmmo)
	routing.AddRoute(engine, "/ammo/remove", routing.GET, api.RemoveAmmo)
	routing.AddRoute(engine, "/ammo/purchase", routing.POST, api.AddAmmoPurchase)
	routing.AddRoute(engine, "/ammo/edit", routing.POST, api.EditAmmo)
	routing.AddRoute(engine, "/users/saveVisit", routing.POST, api.UserSaveVisit)
	routing.AddRoute(engine, "/range/addTrip", routing.POST, api.AddRangeTrip)
	routing.AddRoute(engine, "/users/delete", routing.GET, api.UserDelete)
	routing.AddRoute(engine, "/range/getDateAndAmmoReport", routing.GET, api.GetDateAndAmmoReport)
	routing.AddRoute(engine, "/range/getRangeTrips", routing.GET, api.GetRangeTrips)

	proxy := func(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		adapter := ginadapter.New(engine)
		return adapter.Proxy(req)
	}

	lambda.Start(proxy)
}
