
"use client";
import { useState, useEffect } from "react";
import YouMayAlsoLike from "./Suggestedproductssection";
import { X, Trash2, Plus, Minus, MapPin, CreditCard, Truck, Wallet, CheckCircle, Mail, ShieldCheck, Loader2, RefreshCw, ShoppingCart, Calculator } from "lucide-react";

const SHOP_DOMAIN =process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "swing-9926.myshopify.com"; // UPDATED: Use your actual store domain from JSON

export default function CartDrawer({
  cart: initialCart,
  isOpen,
  setIsOpen,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) {
  // Cart state
  const [cart, setCart] = useState(initialCart);
  const [loading, setLoading] = useState(true);
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  // User & Auth states
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressFetched, setAddressFetched] = useState(false);
  // Modal States
  const [checkoutStep, setCheckoutStep] = useState(0); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  // Shipping & Tax calculation states
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationData, setCalculationData] = useState(null);
  const [calculationError, setCalculationError] = useState(null);
  const [address, setAddress] = useState({
    address1: "",
    city: "",
    province: "",
    provinceCode: "",
    country: "India",
    zip: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const onlyLetters = (val) => val.replace(/[^a-zA-Z\s]/g, "");
  const onlyNumbers = (val) => val.replace(/\D/g, "");

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const customerShopifyId =
    typeof window !== "undefined"
      ? localStorage.getItem("customerShopifyId")
      : null;
  const [cartId, setCartId] = useState(
    typeof window !== "undefined" ? localStorage.getItem("cartId") : null
  );
  // Default empty address
  const defaultAddress = {
    address1: "",
    city: "",
    province: "",
    provinceCode: "",
    country: "India",
    zip: "",
    firstName: "",
    lastName: "",
    phone: "",
  };

  // Normalize cart lines for compatibility (lines.edges OR items array)
  const getLines = (cartData) => {
    if (!cartData) return [];
    if (cartData.lines?.edges) {
      return cartData.lines.edges; // New Cart API
    } else if (cartData.items) {
      // Legacy: Map to edges-like
      return cartData.items.map(item => ({
        node: {
          id: item.id,
          quantity: item.quantity,
          merchandise: {
            id: item.variant.id,
            title: item.variant.title,
            price: item.variant.price, // {amount, currencyCode}
            product: item.variant.product
          }
        }
      }));
    }
    return [];
  };

  // UPDATED: Use normalized lines for hasItems
  const hasItems = (c) => {
    const normalizedLines = getLines(c);
    return normalizedLines.length > 0;
  };

  const getRawCart = (cartData) => cartData?.raw || cartData;

  // Handle animation when drawer opens/closes
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  // Function to populate address from user data (unchanged - omitted for brevity)
  const populateAddressFromUser = (userData) => {
    if (!userData) {
      console.log("❌ No user data provided to populateAddressFromUser");
      return;
    }
    console.log("=".repeat(50));
    console.log("🔍 CART DRAWER - STARTING ADDRESS POPULATION");
    console.log("=".repeat(50));
    console.log("Full user data object:", JSON.stringify(userData, null, 2));
    let addresses = [];
    if (userData.addresses?.edges) {
      addresses = userData.addresses.edges;
      console.log("✅ Found addresses in userData.addresses.edges");
    } else if (userData.addresses?.nodes) {
      addresses = userData.addresses.nodes.map(node => ({ node }));
      console.log("✅ Found addresses in userData.addresses.nodes");
    } else if (Array.isArray(userData.addresses)) {
      addresses = userData.addresses.map(addr => ({ node: addr }));
      console.log("✅ Found addresses as direct array");
    } else if (userData.defaultAddress) {
      addresses = [{ node: userData.defaultAddress }];
      console.log("✅ Found single defaultAddress");
    }
    console.log("📍 Total addresses found:", addresses.length);
    if (addresses.length === 0) {
      console.log("⚠️ NO ADDRESSES FOUND - User may not have saved any addresses");
      return;
    }
    let selectedAddr = null;
    selectedAddr = addresses.find(edge => {
      const node = edge.node || edge;
      return node?.defaultAddress === true;
    });
    if (selectedAddr) {
      selectedAddr = selectedAddr.node || selectedAddr;
      console.log("✅ Strategy 1 Success: Found via defaultAddress flag");
    }
    if (!selectedAddr) {
      selectedAddr = addresses.find(edge => {
        const node = edge.node || edge;
        return node?.isDefault === true;
      });
      if (selectedAddr) {
        selectedAddr = selectedAddr.node || selectedAddr;
        console.log("✅ Strategy 2 Success: Found via isDefault flag");
      }
    }
    if (!selectedAddr) {
      selectedAddr = addresses.find(edge => {
        const node = edge.node || edge;
        return node?.default === true;
      });
      if (selectedAddr) {
        selectedAddr = selectedAddr.node || selectedAddr;
        console.log("✅ Strategy 3 Success: Found via default property");
      }
    }
    if (!selectedAddr) {
      selectedAddr = addresses[0]?.node || addresses[0];
      console.log("✅ Strategy 4: Using first address as fallback");
    }
    if (!selectedAddr) {
      console.log("❌ CRITICAL: No valid address found after all strategies");
      return;
    }
    console.log("📋 Selected address object:", JSON.stringify(selectedAddr, null, 2));
    const newAddress = {
      firstName: selectedAddr.firstName || selectedAddr.firstname || selectedAddr.first_name || "",
      lastName: selectedAddr.lastName || selectedAddr.lastname || selectedAddr.last_name || "",
      address1: selectedAddr.address1 || selectedAddr.address || selectedAddr.street || "",
      city: selectedAddr.city || "",
      province: selectedAddr.province || selectedAddr.provinceCode || selectedAddr.state || selectedAddr.stateCode || "",
      provinceCode: selectedAddr.provinceCode || selectedAddr.province || selectedAddr.stateCode || "",
      country: selectedAddr.country || selectedAddr.countryCode || selectedAddr.countryCodeV2 || "India",
      zip: selectedAddr.zip || selectedAddr.zipCode || selectedAddr.postalCode || selectedAddr.postal_code || "",
      phone: selectedAddr.phone || selectedAddr.phoneNumber || selectedAddr.phone_number || "",
    };
    console.log("🎯 Created new address object:", JSON.stringify(newAddress, null, 2));
    setAddress(newAddress);
    setAddressFetched(true);
    console.log("✅ ADDRESS POPULATION COMPLETE");
    console.log("=".repeat(50));
  };

  // Fetch user profile and default address (unchanged - omitted)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!customerShopifyId) {
        console.log("❌ No customerShopifyId in localStorage");
        setIsLoggedIn(false);
        return;
      }
      console.log("🚀 CART DRAWER - Fetching profile for customerShopifyId:", customerShopifyId);
      setAddressLoading(true);
      try {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: customerShopifyId }),
        });
        const data = await res.json();
        console.log("=".repeat(50));
        console.log("📦 CART DRAWER - PROFILE API RESPONSE:");
        console.log("=".repeat(50));
        console.log(JSON.stringify(data, null, 2));
        console.log("=".repeat(50));
        if (data.success && data.customer) {
          console.log("✅ Profile API call successful");
          setUser(data.customer);
          setIsLoggedIn(true);
          setEmail(data.customer.email || "");
          populateAddressFromUser(data.customer);
        } else {
          console.log("❌ Profile API call failed or no customer data");
          console.log("Response:", data);
        }
      } catch (err) {
        console.error("❌ Network error fetching profile:", err);
      } finally {
        setAddressLoading(false);
      }
    };
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen, customerShopifyId]);

  // Re-populate when checkout step reaches 3 (unchanged)
  useEffect(() => {
    if (checkoutStep === 3 && isLoggedIn && user) {
      console.log("🔄 CART DRAWER - Checkout step 3 reached - Re-populating address");
      populateAddressFromUser(user);
    }
  }, [checkoutStep, isLoggedIn, user]);

  // Load cart when drawer opens (UPDATED: Added expired handling)
  useEffect(() => {
    async function loadCart() {
      if (!isOpen) {
        setLoading(false);
        return;
      }
      console.log("🚀 CART DRAWER - Starting cart load");
      console.log("Customer ID:", customerShopifyId);
      console.log("Cart ID from state:", cartId);
      console.log("Initial Cart prop:", initialCart ? `Present (has items: ${hasItems(initialCart)})` : "Missing");

      // PRIORITY 1: Use initialCart if it has items
      if (initialCart && hasItems(initialCart)) {
        console.log("✅ Using initialCart (has items) - Skipping API");
        const rawInitialCart = getRawCart(initialCart);
        setCart(rawInitialCart);
        if (rawInitialCart?.id && !cartId) {
          setCartId(rawInitialCart.id);
          localStorage.setItem("cartId", rawInitialCart.id);
        }
        setLoading(false);
        return;
      }

      // If no identifiers and no initialCart with items, show empty
      if (!customerShopifyId && !cartId && !initialCart) {
        console.log("⚠️ No cart identifiers available, showing empty cart");
        setCart(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let body = {};
        if (customerShopifyId) {
          body.customerShopifyId = customerShopifyId;
          console.log("📤 Fetching cart for logged-in user via API");
        } else if (cartId) {
          body.cartId = cartId;
          console.log("📤 Fetching cart for guest using cartId via API");
        } else {
          setCart(null);
          setLoading(false);
          return;
        }
        const res = await fetch("/api/cart/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        console.log("=".repeat(50));
        console.log("🛒 CART DRAWER - GET API RESPONSE:", data);
        console.log("=".repeat(50));

        if (data.success && data.cart) {
          console.log("✅ Cart API call successful");
          const apiCart = getRawCart(data.cart);
          setCart(apiCart);
          setCartId(data.cart.id);
          localStorage.setItem("cartId", data.cart.id);

          // NEW: Handle expired flag for guests
          if (data.expired && !customerShopifyId) {
            console.log("🗑️ Clearing expired guest cartId");
            localStorage.removeItem("cartId");
            setCartId(null);
            setCart(null); // Treat as empty
          }

          // If API returns empty but initialCart has items, prioritize initialCart
          if (!hasItems(apiCart) && initialCart && hasItems(initialCart)) {
            console.log("🔄 API empty, falling back to initialCart with items");
            const rawInitialCart = getRawCart(initialCart);
            setCart(rawInitialCart);
          }
        } else if (data.expired) {
          console.log("❌ Cart expired, clearing");
          if (!customerShopifyId) {
            localStorage.removeItem("cartId");
            setCartId(null);
          }
          setCart(null);
        } else {
          console.log("❌ Cart API failed, falling back to initialCart");
          if (initialCart) {
            const rawInitialCart = getRawCart(initialCart);
            setCart(rawInitialCart);
            if (!cartId && rawInitialCart?.id) {
              setCartId(rawInitialCart.id);
              localStorage.setItem("cartId", rawInitialCart.id);
            }
          } else {
            setCart(null);
          }
        }
      } catch (e) {
        console.error("❌ Failed to fetch cart:", e);
        // Fallback to initialCart on error
        if (initialCart) {
          console.log("🔄 Using initialCart as fallback");
          const rawInitialCart = getRawCart(initialCart);
          setCart(rawInitialCart);
          if (!cartId && rawInitialCart?.id) {
            setCartId(rawInitialCart.id);
            localStorage.setItem("cartId", rawInitialCart.id);
          }
        } else {
          setCart(null);
        }
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, [isOpen, customerShopifyId, initialCart, cartId]); // Keep cartId dep for re-fetch if changed

  // Update cart when initialCart prop changes
  useEffect(() => {
    if (initialCart && !loading) {
      // console.log("🔄 Updating cart from prop:", initialCart ? `has items: ${hasItems(initialCart)}` : "empty");
      if (hasItems(initialCart)) {
        const rawInitialCart = getRawCart(initialCart);
        setCart(rawInitialCart);
        if (rawInitialCart?.id && !cartId) {
          setCartId(rawInitialCart.id);
          localStorage.setItem("cartId", rawInitialCart.id);
        }
      }
    }
  }, [initialCart, loading]);

  // UPDATED: Use normalized lines for subtotal, etc.
  const lines = getLines(cart);
  const totalQuantity = cart?.totalQuantity || lines.reduce((sum, edge) => sum + edge.node.quantity, 0);
  const subtotal =
    lines.reduce(
      (sum, { node }) =>
        sum + Number(node.merchandise.price.amount) * node.quantity,
      0
    ) || 0;
  const isFreeDelivery = subtotal >= 500;
  // Extract base price (remove existing 5% tax) - Adjust if no tax included

  const taxAmount = subtotal * 0.18;
  const shippingAmount = calculationData?.shipping?.price?.amount
    ? Number(calculationData.shipping.price.amount)
    : 0;
  // Final total
  const totalAmount = subtotal + taxAmount + shippingAmount;

  // Calculate shipping and tax (UPDATED: Use normalized lines)
  const calculateShippingAndTax = async () => {
    if (!address.firstName || !address.lastName || !address.address1 ||
      !address.city || !address.province || !address.zip) {
      alert("Please fill in all required address fields first");
      return;
    }
    if (lines.length === 0) {
      alert("Cart is empty");
      return;
    }
    setIsCalculating(true);
    setCalculationError(null);
    try {
      const lineItems = lines.map((line) => ({
        variant_id: line.node.merchandise.id.split("/").pop(),
        quantity: line.node.quantity,
      }));
      const res = await fetch("/api/calculate-shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          shippingAddress: {
            firstName: address.firstName,
            lastName: address.lastName,
            address1: address.address1,
            city: address.city,
            provinceCode: address.provinceCode || address.province,
            zip: address.zip,
          },
          lineItems,
        }),
      });
      const data = await res.json();
      console.log("Calculation response:", data);
      if (data.success) {
        let processedData = { ...data };
        if (subtotal >= 500 && processedData.shipping) {
          processedData.shipping.price.amount = "0.00";
          console.log("✅ Applied free shipping rule");
        }
        setCalculationData(processedData);
        setCalculationError(null);
      } else {
        setCalculationError(data.error || "Failed to calculate shipping and tax");
        setCalculationData(null);
      }
    } catch (err) {
      console.error("Calculation error:", err);
      setCalculationError("Network error. Please try again.");
      setCalculationData(null);
    } finally {
      setIsCalculating(false);
    }
  };

  // STEP 1 — SEND OTP (UPDATED: Use SHOP_DOMAIN)
  const sendOTP = async () => {
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          shop: SHOP_DOMAIN,
        }),
      });
      const data = await res.json();
      if (data.success) setCheckoutStep(2);
      else if (data.message?.includes("already verified")) setCheckoutStep(3);
      else alert(data.message || "Failed to send OTP");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // STEP 2 — VERIFY OTP
  const verifyOTP = async () => {
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          shop: SHOP_DOMAIN,
        }),
      });
      const data = await res.json();
      if (data.success) setCheckoutStep(3);
      else alert("Invalid OTP");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // Internal update quantity handler
  const handleUpdateQuantity = async (lineId, quantity) => {
    try {
      const currentCartId = cart?.id || cartId;
      if (!currentCartId) return alert("Cart ID missing");
      let body = { cartId: currentCartId, lineId, quantity };
      if (customerShopifyId) {
        body.customerShopifyId = customerShopifyId;
      }
      const res = await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        const rawUpdatedCart = getRawCart(data.cart);
        setCart(rawUpdatedCart);
        setCartId(data.cart.id);
        localStorage.setItem("cartId", data.cart.id);
        setCalculationData(null);
        if (onUpdateQuantity) {
          onUpdateQuantity(lineId, quantity);
        }
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        alert("Failed to update quantity: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update quantity");
    }
  };

  // Internal remove item handler
  const handleRemoveItem = async (lineId) => {
    try {
      const currentCartId = cart?.id || cartId;
      if (!currentCartId) {
        return alert("Cart ID missing");
      }
      let body = { cartId: currentCartId, lineId };
      if (customerShopifyId) {
        body.customerShopifyId = customerShopifyId;
      }
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        const rawUpdatedCart = getRawCart(data.cart);
        setCart(rawUpdatedCart);
        // If cart is now empty, clear cartId for guests
        if (!customerShopifyId && (!data.cart || !hasItems(data.cart))) {
          setCartId(null);
          localStorage.removeItem("cartId");
        }
        setCalculationData(null);
        if (onRemoveItem) {
          onRemoveItem(lineId);
        }
      } else {
        alert(data.error || "Failed to remove item");
      }
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  // STEP 3 — PLACE ORDER
  const placeOrder = async () => {
    if (!address.firstName || !address.lastName || !address.address1 ||
      !address.city || !address.province || !address.zip || !address.phone) {
      alert("Please fill in all address fields");
      return;
    }
    try {
      const lineItems = lines.map((line) => ({
        variant_id: line.node.merchandise.id.split("/").pop(),
        quantity: line.node.quantity,
        price: line.node.merchandise.price.amount,
      }));
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          shippingAddress: {
            ...address,
            provinceCode: address.provinceCode || address.province,
          },
          lineItems,
          paymentMethod,
        }),
      });
      const data = await res.json();
      console.log("API Response:", data);
      if (data.success && data?.order?.data?.draftOrderComplete?.draftOrder?.order?.name) {
        const orderId = data?.order?.data?.draftOrderComplete?.draftOrder?.order?.name.replace("#", "");
        // Delete cart after order
        const deleteBody = customerShopifyId ? { customerShopifyId } : { cartId: cart?.id || cartId };
        if (deleteBody.customerShopifyId || deleteBody.cartId) {
          await fetch("/api/cart/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(deleteBody),
          });
          if (!customerShopifyId) {
            localStorage.removeItem("cartId");
            setCartId(null);
          }
        }
        localStorage.setItem("recentOrderId", orderId);
        setIsOpen(false);
        setCheckoutStep(0);
        setAddress(defaultAddress);
        setAddressFetched(false);
        setCart(null);
        alert(`Order Placed Successfully!\nOrder ID: ${data?.order?.data?.draftOrderComplete?.draftOrder?.order?.name}`);
        window.location.replace(`/thank-you?order=${orderId}`);
        return;
      } else {
        alert("Order failed: " + (data.error || "Try again"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error! Please try again.");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCheckoutStep(0);
    setEmail("");
    setOtp("");
    setOrderPlaced(false);
    setCalculationData(null);
    setCalculationError(null);
    setAddress(defaultAddress);
    setAddressFetched(false);
  };

  const handleProceedToCheckout = () => {
    // 🔥 Generate a NEW unique sessionId every time checkout is initiated
    // This ensures a fresh abandoned checkout record per checkout attempt
    const sessionId = `chk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store it so we can reference the SAME session on later events
    // (e.g., when user fills address, adds payment, or completes checkout)
    if (typeof window !== "undefined") {
      localStorage.setItem("abandoned_checkout_session_id", sessionId);
    }

    const shopurl = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "hit-megascale.myshopify.com";

    // Snapshot of current cart state
    const cartSnapshot = {
      id: cart?.id || null,
      checkoutUrl: cart?.checkoutUrl || null,
      totalQuantity: cart?.totalQuantity || 0,
      subtotal: subtotal || cart?.cost?.subtotalAmount?.amount || 0,
      currency: cart?.cost?.subtotalAmount?.currencyCode || "INR",
     items:
  cart?.items?.map((item) => ({
    line_id: item.id.split("/").pop().split("?")[0],

    variant_id: item.variant.id.split("/").pop(),

    product_title: item.variant.product.title,

    variant_title:
      item.variant.title !== "Default Title"
        ? item.variant.title
        : null,

    price: Number(item.variant.price.amount),

    quantity: item.quantity,

    image: item.variant.product.featuredImage?.url || null,
  })) || [],

    };

    // Customer info only if logged in and available
    const customerInfo =
      isLoggedIn && user
        ? {
            id: customerShopifyId || user.id || null,
            email: email || user.email || null,
            firstName: address?.firstName || user.firstName || "",
            lastName: address?.lastName || user.lastName || "",
            phone: address?.phone || null,
          }
        : null;

    const trackingPayload = {
      shopurl,
      sessionId, // Fresh new ID for this checkout session
      event: "checkout_started",
      customer: customerInfo,
      cart: cartSnapshot,
      address: null, // Will be updated later if user fills shipping
      pricing: null, // Can update later with discounts, taxes, etc.
      meta: {
        url: typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        referrer: typeof document !== "undefined" ? document.referrer : "",
        timestamp: new Date().toISOString(),
        timezoneOffset: new Date().getTimezoneOffset(),
        screenResolution:
          typeof window !== "undefined"
            ? `${window.screen.width}x${window.screen.height}`
            : null,
      },
    };

    // Fire-and-forget tracking request
    const sendTracking = () => {
      const url = "/api/track/checkout";

      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(trackingPayload)], {
          type: "application/json",
        });
        navigator.sendBeacon(url, blob);
      } else {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(trackingPayload),
          keepalive: true, // Allows request to complete even if page unloads
        }).catch(() => {
          // Silent fail – tracking is non-critical
        });
      }
    };

    // Send tracking event
    sendTracking();

    // Proceed to next checkout step
    if (isLoggedIn) {
      setCheckoutStep(3); // Skip login/address if already logged in
    } else {
      setCheckoutStep(1); // Start from login/info
    }
  };

  const handleReloadAddress = () => {
    if (user) {
      populateAddressFromUser(user);
    }
  };

  const paymentIcons = {
    cod: Truck,
    online: CreditCard,
    upi: Wallet
  };
  const PaymentIcon = paymentIcons[paymentMethod];

  // Use lines.length for empty check
  const isCartEmpty = lines.length === 0;

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-50 transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-0'
          }`}
        style={{ backdropFilter: isAnimating ? 'blur(4px)' : 'none' }}
        onClick={handleClose}
      />
      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full z-[999] shadow-2xl z-50 transition-transform duration-300 ease-out ${isAnimating ? 'translate-x-0' : 'translate-x-full'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Desktop split layout */}
        <div className="flex h-full max-w-[700px] ml-auto bg-white ">
          <div className="hidden lg:block w-[40%] border-r border-gray-200 overflow-y-auto">
            <YouMayAlsoLike />
          </div>
          <div className="w-full lg:w-[60%] flex flex-col bg-white ">
            {/* Header - Dynamic based on step */}
            <div className="bg-gradient-to-r from-sky-400 to-blue-800 text-white p-6 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
              <div className="relative z-10">
                <h2 className="text-xl font-bold">
                  {checkoutStep === 0 && "Your Cart"}
                  {checkoutStep === 1 && "Email Verification"}
                  {checkoutStep === 2 && "Enter OTP"}
                  {checkoutStep === 3 && "Checkout"}
                </h2>
                <p className="text-sm text-white/90 mt-1">
                  {checkoutStep === 0 && `${lines.length || 0} items`}
                  {checkoutStep === 1 && "Enter your email to continue"}
                  {checkoutStep === 2 && "We've sent a code to your email"}
                  {checkoutStep === 3 && (isLoggedIn ? "Review and confirm your order" : "Complete your order details")}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="relative z-10 bg-white/20 hover:bg-white/30 transition-colors rounded-full p-2 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            {/* CART VIEW */}
            {checkoutStep === 0 && (
              <>
                {loading ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
                    <p className="text-blue-600 font-semibold">Loading your cart...</p>
                  </div>
                ) : isCartEmpty ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart size={40} className="text-blue-600" />
                    </div>
                    <p className="text-gray-600 text-lg font-medium">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-2">Add some delicious khakhra!</p>
                    <a
                      href="/collection"
                      className="mt-5 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400"
                    >
                      Start Shopping
                    </a>
                  </div>
                ) : (
                  <>
                    {/* Free Shipping Progress Bar */}
                    <div className="px-4 py-3 bg-indigo-50/70 border-b border-indigo-200">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-indigo-700 flex items-center gap-1 font-medium">
                            <Truck size={14} />
                            Free Shipping on orders over ₹500
                          </span>
                          <span className="text-xs font-medium text-indigo-800">
                            {isFreeDelivery
                              ? "Unlocked! 🎉"
                              : `₹${(500 - subtotal).toFixed(0)} more`
                            }
                          </span>
                        </div>
                        <div className="relative w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${isFreeDelivery ? 'bg-indigo-600' : 'bg-indigo-500'
                              }`}
                            style={{
                              width: `${Math.min((subtotal / 500) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-2">
                      {lines.map(({ node }) => {
                        const product = node.merchandise.product;
                        const image =
                          product.featuredImage?.url ||
                          (product.images?.edges?.[0]?.node?.url || ''); // Fallback
                        return (
                          <div key={node.id} className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0">
                            <img
                              src={image}
                              className="w-20 h-20 rounded-lg object-cover shadow-sm"
                              alt={product.title}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">{product.title}</h4>
                              <p className="text-sm text-gray-500 truncate">
                                {node.merchandise.title}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(node.id, node.quantity - 1)
                                    }
                                    disabled={node.quantity <= 1}
                                    className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="w-8 text-center font-medium">{node.quantity}</span>
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(node.id, node.quantity + 1)
                                    }
                                    className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-colors cursor-pointer"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                                <span className="font-bold text-blue-600">
                                  ₹{(Number(node.merchandise.price.amount) * node.quantity).toFixed(0)}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(node.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-2 transition-colors self-start cursor-pointer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <div className="lg:hidden">
                      <YouMayAlsoLike />
                    </div>
                    <div className="border-t border-indigo-200 p-4 space-y-3 bg-indigo-50/50">
                      <div className="flex justify-between items-center">
                        <span className="text-indigo-700 font-medium">Subtotal</span>
                        <span className="text-lg font-bold text-indigo-900">₹{subtotal.toFixed(0)}</span>
                      </div>
                      <button
                        onClick={handleProceedToCheckout}
                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all transform hover:scale-[1.02] shadow-lg cursor-pointer"
                      >
                        Proceed to Checkout
                      </button>
                      <button
                        onClick={() => (window.location.href = "/cart")}
                        className="text-sm text-indigo-700 hover:text-indigo-900 hover:underline flex items-center gap-2 justify-center w-full mt-2 cursor-pointer"
                      >
                        View Cart →
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
            {/* EMAIL STEP */}
            {checkoutStep === 1 && (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Mail size={20} className="text-indigo-700" />
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900">Email Address</h4>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCheckoutStep(0)}
                      className="flex-1 px-6 py-3 border-2 border-indigo-300 rounded-lg font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={sendOTP}
                      disabled={!email}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* OTP STEP */}
            {checkoutStep === 2 && (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <ShieldCheck size={20} className="text-indigo-700" />
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900">Verification Code</h4>
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors text-center text-lg tracking-widest"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCheckoutStep(1)}
                      className="flex-1 px-6 py-3 border-2 border-indigo-300 rounded-lg font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={verifyOTP}
                      disabled={!otp}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* CHECKOUT STEP */}
            {checkoutStep === 3 && (
              <div className="flex-1 overflow-y-auto p-6">
                {orderPlaced ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Order Placed Successfully!
                    </h3>
                    <p className="text-gray-600">Thank you for your purchase</p>
                  </div>
                ) : addressLoading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-[#7d4b0e] animate-spin mb-2" />
                    <p className="text-gray-600">Loading your details...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Address Section */}
                    <div className="bg-white border-2 border-indigo-200 rounded-xl p-6 shadow-md">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <MapPin size={20} className="text-indigo-700" />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-900">Delivery Address</h4>
                      </div>

                      {isLoggedIn && addressFetched && (
                        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-3 mb-4 text-sm">
                          <p className="text-indigo-800 font-medium flex items-center gap-2">
                            <CheckCircle size={16} />
                            Auto-filled from your saved address
                          </p>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              First Name *
                            </label>
                            <input
                              type="text"
                              placeholder="First Name"
                              value={address.firstName}
                              onChange={(e) => {
                                setAddress({ ...address, firstName: onlyLetters(e.target.value), });
                                setCalculationData(null);
                              }}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-sm focus:border-indigo-600 focus:outline-none transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              placeholder="Last Name"
                              value={address.lastName}
                              onChange={(e) => {
                                setAddress({ ...address, lastName: onlyLetters(e.target.value), });
                                setCalculationData(null);
                              }}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-sm focus:border-indigo-600 focus:outline-none transition-colors"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Address *
                          </label>
                          <input
                            type="text"
                            placeholder="Street Address"
                            value={address.address1}
                            onChange={(e) => {
                              setAddress({ ...address, address1: e.target.value });
                              setCalculationData(null);
                            }}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-sm focus:border-indigo-600 focus:outline-none transition-colors"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              City *
                            </label>
                            <input
                              type="text"
                              placeholder="City"
                              value={address.city}
                              onChange={(e) => {
                                setAddress({ ...address, city: onlyLetters(e.target.value), });
                                setCalculationData(null);
                              }}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-sm focus:border-indigo-600 focus:outline-none transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              State/Province *
                            </label>
                            <input
                              type="text"
                              placeholder="Province"
                              value={address.province}
                              onChange={(e) => {
                                const val = onlyLetters(e.target.value);
                                setAddress({
                                  ...address,
                                  province: val,
                                  provinceCode: val
                                });
                                setCalculationData(null);
                              }}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-sm focus:border-indigo-600 focus:outline-none transition-colors"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Country *
                            </label>
                            <input
                              type="text"
                              placeholder="Country"
                              value={address.country}
                              onChange={(e) => {
                                setAddress({ ...address, country: e.target.value });
                                setCalculationData(null);
                              }}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-sm focus:border-indigo-600 focus:outline-none transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Zip Code *
                            </label>
                            <input
                              type="text"
                              placeholder="Zip Code"
                              value={address.zip}
                              onChange={(e) => {
                                const val = onlyNumbers(e.target.value).slice(0, 6);
                                setAddress({ ...address, zip: val });
                                setCalculationData(null);
                              }}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-sm focus:border-indigo-600 focus:outline-none transition-colors"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="Phone Number"
                            value={address.phone}
                            onChange={(e) => {
                              const val = onlyNumbers(e.target.value).slice(0, 10);
                              setAddress({ ...address, phone: val });
                            }}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-sm focus:border-indigo-600 focus:outline-none transition-colors"
                            required
                          />
                        </div>
                      </div>

                      {/* Calculate Button */}
                      <button
                        onClick={calculateShippingAndTax}
                        disabled={isCalculating}
                        className="cursor-pointer  w-full mt-4 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-base"
                      >
                        {isCalculating ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Calculating...
                          </>
                        ) : (
                          <>
                            <Calculator size={18} />
                            Calculate Shipping & Tax
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-indigo-50/70 border-2 border-indigo-200 rounded-lg p-4 mt-4 backdrop-blur-sm">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <CheckCircle size={18} className="text-indigo-600" />
                        Order Summary
                      </h4>
                      {/* Loading state */}
                      {isCalculating && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Loader2 size={16} className="animate-spin text-indigo-600" />
                          Calculating shipping & tax...
                        </div>
                      )}
                      {/* Error state */}
                      {calculationError && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                          {calculationError}
                        </div>
                      )}
                      {/* Summary */}
                      {!isCalculating && calculationData && (
                        <div className="space-y-2 text-sm mt-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Subtotal</span>
                            <span className="font-medium text-slate-900">₹{subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Tax</span>
                            <span className="font-medium text-slate-900">₹{taxAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">
                              Shipping ({calculationData.shipping?.title || "—"}) {isFreeDelivery ? "(Free)" : ""}
                            </span>
                            <span className="font-medium text-slate-900">
                              {isFreeDelivery ? "₹0" : `₹${shippingAmount.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="pt-2 border-t-2 border-indigo-300 flex justify-between">
                            <span className="font-bold text-slate-900">Total</span>
                            <span className="font-bold text-indigo-800 text-lg">
                              ₹{totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Payment Method Section */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <PaymentIcon size={20} className="text-indigo-700" />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-900">Payment Method</h4>
                      </div>
                      <div className="space-y-2">
                        {[
                          { value: 'cod', label: 'Cash on Delivery', icon: Truck, color: '#4f46e5' }, // indigo-600
                        ].map((option) => {
                          const Icon = option.icon;
                          const isSelected = paymentMethod === option.value;
                          return (
                            <label
                              key={option.value}
                              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                                ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                                : 'border-slate-200 hover:border-indigo-300'
                                }`}
                            >
                              <input
                                type="radio"
                                name="payment"
                                value={option.value}
                                checked={isSelected}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-4 h-4 cursor-pointer accent-indigo-600"
                              />
                              <Icon size={20} style={{ color: option.color }} />
                              <span className="font-medium text-slate-900 flex-1">
                                {option.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleClose}
                        className="flex-1 px-6 py-3 border-2 border-indigo-300 rounded-lg font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer "
                      >
                        Cancel
                      </button>
                      <button
                        onClick={placeOrder}
                        disabled={!calculationData}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer "
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}