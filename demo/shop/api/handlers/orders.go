package handlers

import "net/http"

type Order struct {
	ID    int
	Total float64
}

func ListOrders(w http.ResponseWriter, r *http.Request) {
	orders := loadOrders()
	for _, o := range orders {
		w.Write([]byte(formatOrder(o)))
	}
}

func loadOrders() []Order {
	return []Order{{1, 9.5}, {2, 20}}
}

func formatOrder(o Order) string {
	if o.Total > 10 {
		return "big"
	}
	return "small"
}
