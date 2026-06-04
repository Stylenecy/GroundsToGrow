"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { WasteListing, ListingStatus } from "@/types";
import { wasteListings as initialListings } from "@/data/wasteListings";

interface ListingsContextType {
  listings: WasteListing[];
  addListing: (listing: WasteListing) => void;
  getListingsByShop: (profileId: string) => WasteListing[];
  getOpenListings: () => WasteListing[];
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<WasteListing[]>(initialListings);

  const addListing = (newListing: WasteListing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  const getListingsByShop = (profileId: string) => {
    return listings.filter((listing) => listing.coffeeShopProfileId === profileId);
  };

  const getOpenListings = () => {
    return listings.filter((listing) => listing.status === "open");
  };

  return (
    <ListingsContext.Provider
      value={{
        listings,
        addListing,
        getListingsByShop,
        getOpenListings,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (context === undefined) {
    throw new Error("useListings must be used within a ListingsProvider");
  }
  return context;
}
