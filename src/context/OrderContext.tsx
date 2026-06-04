"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { CartItem } from "./CartContext";

export interface Order {
  orderId: string;
  items: CartItem[];
  totalAmount: number;
  date: string;
  status: "Diproses" | "Selesai" | "Dibatalkan";
}

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[], totalAmount: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (items: CartItem[], totalAmount: number) => {
    const newOrder: Order = {
      orderId: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
      items,
      totalAmount,
      date: new Date().toISOString(),
      status: "Diproses",
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
