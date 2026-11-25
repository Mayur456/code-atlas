import json
from collections import Counter

def load(path):
    with open(path) as f:
        return json.load(f)

def summarize(orders):
    return Counter(o["status"] for o in orders)

class Printer:
    def show(self, counts):
        for k, v in counts.items():
            print(k, v)

if __name__ == "__main__":
    Printer().show(summarize(load("orders.json")))
