package main

import (
	"atfgundb.com/app/api"
	"atfgundb.com/app/routing"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	engine := routing.Build()

	// You may notice that this is identical to our localdev setup. 
	// As you add more endpoints, you may wish to store the endpoints in a separate list, used by both localdev and aws.
	routing.AddRoute(engine, "/guns", routing.GET, api.ListGuns)
	routing.AddRoute(engine, "/guns/add", routing.POST, api.AddGun)
	routing.AddRoute(engine, "/guns/addMaintenance", routing.POST, api.AddMaintenanceToGun)
	routing.AddRoute(engine, "/guns/addAccessory", routing.POST, api.AddAccessoryToGun)
	routing.AddRoute(engine, "/ammo", routing.GET, api.ListAmmo)
	routing.AddRoute(engine, "/ammo/add", routing.POST, api.AddAmmo)
	routing.AddRoute(engine, "/ammo/dispose", routing.GET, api.DisposeAmmo)
	routing.AddRoute(engine, "/ammo/purchase", routing.POST, api.AddAmmoPurchase)
	routing.AddRoute(engine, "/users/saveVisit", routing.POST, api.UserSaveVisit)
	routing.AddRoute(engine, "/range/addTrip", routing.POST, api.AddRangeTrip)
	routing.AddRoute(engine, "/range/getDateAndAmmoReport", routing.GET, api.GetDateAndAmmoReport)

	proxy := func(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		adapter := ginadapter.New(engine)
		return adapter.Proxy(req)
	}

	lambda.Start(proxy)
}