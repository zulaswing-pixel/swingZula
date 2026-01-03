"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StoreCustomerFromUrl() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("customerShopifyId");

    if (!id) return;

    // 1️⃣ Store in localStorage
    localStorage.setItem("customerShopifyId", id);
    console.log("Stored customerShopifyId:", id);

    // 2️⃣ Redirect to cart
    router.replace("/cart");
  }, [router]);

  return null;
}
