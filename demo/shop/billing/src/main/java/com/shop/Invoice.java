package com.shop;

import java.util.List;

public class Invoice {
    private final List<Double> lines;

    public Invoice(List<Double> lines) {
        this.lines = lines;
    }

    public double total() {
        double sum = 0;
        for (double l : lines) {
            sum += withTax(l);
        }
        return sum;
    }

    private double withTax(double amount) {
        if (amount > 100) {
            return amount * 1.2;
        }
        return amount * 1.1;
    }

    public static void main(String[] args) {
        Invoice inv = new Invoice(List.of(10.0, 200.0));
        System.out.println(inv.total());
    }
}
