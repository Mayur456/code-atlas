<?php
namespace Shop;

class Cart {
    private array $items = [];

    public function add(string $sku, int $qty): void {
        $this->items[$sku] = ($this->items[$sku] ?? 0) + $qty;
    }

    public function count(): int {
        return array_sum($this->items);
    }
}

function makeCart(): Cart {
    $c = new Cart();
    $c->add('tea', 2);
    return $c;
}
