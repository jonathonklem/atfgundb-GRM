package main // Important: Packages with endpoints must be named 'main'
import (
	"log"

	"atfgundb.com/app/api"
	"atfgundb.com/app/db"
	"atfgundb.com/app/routing"
)

func main() {
	engine := routing.Build()

	// prime our mongo connection
	db.GetClient()
	defer func() {
		log.Printf("Killing mongo client")
		db.KillClient()
	}()

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
	routing.AddRoute(engine, "/users/delete", routing.GET, api.UserDeleteTest)
	routing.AddRoute(engine, "/range/addTrip", routing.POST, api.AddRangeTrip)
	routing.AddRoute(engine, "/range/getDateAndAmmoReport", routing.GET, api.GetDateAndAmmoReport)
	routing.AddRoute(engine, "/range/getRangeTrips", routing.GET, api.GetRangeTrips)
	routing.AddRoute(engine, "/range/getAmmoReport", routing.GET, api.GetAmmoReport)
	routing.AddRoute(engine, "/range/getGunReport", routing.GET, api.GetGunReport)

	if err := engine.Run(); err != nil {
		log.Printf("Error starting gin %v", err)
	}

	log.Printf("Application exiting.")
}
