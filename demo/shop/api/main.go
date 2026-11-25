package main

import (
	"fmt"
	"net/http"
	"shop/api/handlers"
)

func main() {
	http.HandleFunc("/orders", handlers.ListOrders)
	fmt.Println(startMessage(8080))
	http.ListenAndServe(":8080", nil)
}

func startMessage(port int) string {
	return fmt.Sprintf("listening on %d", port)
}
