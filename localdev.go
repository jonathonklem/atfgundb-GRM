package main // Important: Packages with endpoints must be named 'main'
import (
	"log"

	"atfgundb.com/app/api"
	"atfgundb.com/app/routing"
)

func main() {
	engine := routing.Build()
	routing.AddRoute(engine, "/guns", routing.GET, api.ListGuns)
	routing.AddRoute(engine, "/ammo", routing.GET, api.ListAmmo)
	routing.AddRoute(engine, "/users/saveVisit", routing.POST, api.UserSaveVisit)

	if err := engine.Run(); err != nil {
		log.Printf("Error starting gin %v", err)
	}

	log.Printf("Application exiting.")
}
