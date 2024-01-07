package main // Important: Packages with endpoints must be named 'main'
import (
	"log"

	"atfgundb.com/app/api"
	"atfgundb.com/app/routing"
)

func main() {
	engine := routing.Build()
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

	if err := engine.Run(); err != nil {
		log.Printf("Error starting gin %v", err)
	}

	log.Printf("Application exiting.")
}
