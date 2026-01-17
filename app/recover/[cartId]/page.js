  "use client";
  import { useEffect, useState } from "react";
  import { X, MapPin, CreditCard, Truck, Wallet, CheckCircle, Mail, ShieldCheck, Loader2, RefreshCw, Plus, Minus, Trash2, Calculator, ShoppingCart } from 'lucide-react';

  const SHOP_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||"swing-9926.myshopify.com"; // UPDATED: Use your actual store domain from JSON

  export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [addressFetched, setAddressFetched] = useState(false);

    // Checkout States
    const [checkoutStep, setCheckoutStep] = useState(0); // 0 = cart view, 1 = email, 2 = otp, 3 = checkout
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [orderPlaced, setOrderPlaced] = useState(false);

    // Shipping & Tax calculation states
    const [isCalculating, setIsCalculating] = useState(false);
    const [calculationData, setCalculationData] = useState(null);
    const [calculationError, setCalculationError] = useState(null);

    const onlyLetters = (val) => val.replace(/[^a-zA-Z\s]/g, "");
    const onlyNumbers = (val) => val.replace(/\D/g, "");

    const isValidEmail = (email) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

    // Function to populate address from user data
    const populateAddressFromUser = (userData) => {
      if (!userData) {
        console.log("❌ No user data provided to populateAddressFromUser");
        return;
      }

      console.log("=".repeat(50));
      console.log("🔍 CART PAGE - STARTING ADDRESS POPULATION");
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

    // Fetch user profile and default address
    useEffect(() => {
      const fetchUserProfile = async () => {
        if (!customerShopifyId) {
          console.log("❌ No customerShopifyId in localStorage");
          setIsLoggedIn(false);
          return;
        }

        console.log("🚀 CART PAGE - Fetching profile for customerShopifyId:", customerShopifyId);
        setAddressLoading(true);

        try {
          const res = await fetch("/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId: customerShopifyId }),
          });

          const data = await res.json();

          console.log("=".repeat(50));
          console.log("📦 CART PAGE - PROFILE API RESPONSE:");
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

      fetchUserProfile();
    }, [customerShopifyId]);

    // Re-populate when checkout step reaches 3
    useEffect(() => {
      if (checkoutStep === 3 && isLoggedIn && user) {
        console.log("🔄 CART PAGE - Checkout step 3 reached - Re-populating address");
        populateAddressFromUser(user);
      }
    }, [checkoutStep, isLoggedIn, user]);

    // Load cart when page loads (UPDATED: Added expired handling)
    useEffect(() => {
      async function loadCart() {
        console.log("🚀 CART PAGE - Starting cart load");
        console.log("Customer ID:", customerShopifyId);
        console.log("Cart ID from state:", cartId);

        // If no identifiers, show empty
        if (!customerShopifyId && !cartId) {
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
          console.log("🛒 CART PAGE - GET API RESPONSE:", data);
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
          } else if (data.expired) {
            console.log("❌ Cart expired, clearing");
            if (!customerShopifyId) {
              localStorage.removeItem("cartId");
              setCartId(null);
            }
            setCart(null);
          } else {
            console.log("❌ Cart API failed");
            setCart(null);
          }
        } catch (e) {
          console.error("❌ Failed to fetch cart:", e);
          setCart(null);
        } finally {
          setLoading(false);
        }
      }

      loadCart();
    }, [customerShopifyId, cartId]);

    // UPDATED: Use normalized lines for subtotal, etc.
    const lines = getLines(cart);
    const totalQuantity = cart?.totalQuantity || lines.reduce((sum, edge) => sum + edge.node.quantity, 0);
    const subtotal =
      lines.reduce(
        (sum, { node }) =>
          sum + Number(node.merchandise.price.amount) * node.quantity,
        0
      ) || 0;

    const isFreeDelivery = subtotal >= 100000;

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
      // If user is already logged in, skip OTP and go directly to checkout
      if (isLoggedIn) {
        setCheckoutStep(3);
        return;
      }

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

    // UPDATE QUANTITY API
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
          window.dispatchEvent(new Event("cart-updated"));
        } else {
          alert("Failed to update quantity: " + data.error);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to update quantity");
      }
    };

    // REMOVE ITEM
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

    const handleProceedToCheckout = () => {
      // 🔥 Generate a NEW unique sessionId every time checkout is initiated
      const sessionId = `chk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Store it so we can reference the SAME session on later events
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
          lines.map((line) => ({
            line_id: line.node.id.split("/").pop().split("?")[0],
            variant_id: line.node.merchandise.id.split("/").pop(),
            product_title: line.node.merchandise.product.title,
            variant_title:
              line.node.merchandise.title !== "Default Title"
                ? line.node.merchandise.title
                : null,
            price: Number(line.node.merchandise.price.amount),
            quantity: line.node.quantity,
            image: line.node.merchandise.product.featuredImage?.url || null,
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
        sessionId,
        event: "checkout_started",
        customer: customerInfo,
        cart: cartSnapshot,
        address: null,
        pricing: null,
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
            keepalive: true,
          }).catch(() => {
            // Silent fail – tracking is non-critical
          });
        }
      };

      // Send tracking event
      sendTracking();

      // Proceed to next checkout step
      if (isLoggedIn) {
        setCheckoutStep(3);
      } else {
        setCheckoutStep(1);
      }
    };

    const handleBackToCart = () => {
      setCheckoutStep(0);
      setCalculationData(null);
      setCalculationError(null);
    };

    const handleReloadAddress = () => {
      console.log("🔄 CART PAGE - Manual reload triggered");
      if (user) {
        populateAddressFromUser(user);
      } else {
        console.log("❌ No user data available to reload");
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

    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-indigo-700 animate-spin mx-auto mb-4" />
            <p className="text-indigo-800 font-semibold text-xl">Loading your cart...</p>
          </div>
        </div>
      );
    }

    if (isCartEmpty) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ShoppingCart size={60} className="text-indigo-700" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Looks like you haven't added any Swing Zula yet!
            </p>
            <a
              href="/collection"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Start Shopping
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-4 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-400 to-blue-800 text-white p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {checkoutStep === 0 && "Your Shopping Cart"}
                  {checkoutStep === 1 && "Email Verification"}
                  {checkoutStep === 2 && "Enter OTP"}
                  {checkoutStep === 3 && "Complete Your Order"}
                </h2>
                <p className="text-sm text-white/90">
                  {checkoutStep === 0 && `${lines.length || 0} items in your cart`}
                  {checkoutStep === 1 && "Enter your email to continue"}
                  {checkoutStep === 2 && "We've sent a verification code to your email"}
                  {checkoutStep === 3 && (isLoggedIn ? "Review and confirm your order" : "Complete your order details")}
                </p>
              </div>
            </div>

            {/* CART VIEW */}
            {checkoutStep === 0 && (
              <div className="p-6">
                {/* Free Shipping Progress */}
                <div className="relative overflow-hidden mb-6">
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 ${isFreeDelivery
                    ? 'bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10'
                    : 'bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5'
                    }`} />

                  {/* Confetti Effects */}
                  {isFreeDelivery && (
                    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                      {/* Left Bottom Confetti */}
                      <div className="absolute bottom-0 left-0">
                        {[...Array(40)].map((_, i) => (
                          <div
                            key={`left-${i}`}
                            className="absolute bottom-0 left-0 w-2.5 h-4 rounded-sm confetti-left-diagonal"
                            style={{
                              backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#fbbf24', '#34d399', '#fb923c', '#a78bfa'][i % 10],
                              animationDelay: `${Math.random() * 0.6}s`,
                              '--shoot-x': `${100 + Math.random() * 400}px`,
                              '--shoot-y': `${-80 - Math.random() * 120}px`,
                              '--final-x': `${150 + Math.random() * 600}px`,
                              '--final-y': `${100 + Math.random() * 300}px`,
                              '--rot-start': `${Math.random() * 360}deg`,
                              '--rot-end': `${360 + Math.random() * 1080}deg`,
                            }}
                          />
                        ))}
                      </div>

                      {/* Right Bottom Confetti */}
                      <div className="absolute bottom-0 right-0">
                        {[...Array(40)].map((_, i) => (
                          <div
                            key={`right-${i}`}
                            className="absolute bottom-0 right-0 w-2.5 h-4 rounded-sm confetti-right-diagonal"
                            style={{
                              backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#fbbf24', '#34d399', '#fb923c', '#a78bfa'][i % 10],
                              animationDelay: `${Math.random() * 0.6}s`,
                              '--shoot-x': `${-100 - Math.random() * 400}px`,
                              '--shoot-y': `${-80 - Math.random() * 120}px`,
                              '--final-x': `${-150 - Math.random() * 600}px`,
                              '--final-y': `${100 + Math.random() * 300}px`,
                              '--rot-start': `${Math.random() * 360}deg`,
                              '--rot-end': `${360 + Math.random() * 1080}deg`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="relative px-4 py-2.5 border-b border-gray-200">
                    <div className="space-y-2">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`relative p-1.5 rounded-lg ${isFreeDelivery
                            ? 'bg-gradient-to-br from-green-400 to-green-600'
                            : 'bg-gradient-to-br from-blue-400 to-indigo-600'
                            } shadow-lg`}>
                            <Truck size={14} className="text-white" />
                            {isFreeDelivery && (
                              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                                <span className="text-[7px] font-bold">✓</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800 leading-tight">
                              {isFreeDelivery ? 'Free Shipping!' : 'Free Shipping Available'}
                            </p>
                            <p className="text-[10px] text-gray-500 leading-tight">
                              {isFreeDelivery ? 'You saved delivery charges' : 'On orders above ₹500'}
                            </p>
                          </div>
                        </div>

                        {!isFreeDelivery && (
                          <div className="text-right">
                            <div className="px-2.5 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-md">
                              ₹{(100000 - subtotal).toFixed(0)}
                            </div>
                            <p className="text-[9px] text-gray-500 mt-0.5">more needed</p>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1 relative">
                        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <div
                            className={`relative h-full transition-all duration-700 ease-out ${isFreeDelivery
                              ? 'bg-gradient-to-r from-green-400 via-green-500 to-emerald-500'
                              : 'bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500'
                              }`}
                            style={{
                              width: `${Math.min((subtotal / 100000) * 100, 100)}%`
                            }}
                          >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine" />
                          </div>
                        </div>

                        {/* Progress labels */}
                        <div className="flex justify-between items-center px-0.5">
                          <span className="text-[9px] text-gray-500 font-medium">
                            ₹{subtotal.toFixed(0)}
                          </span>
                          <span className="text-[9px] text-gray-600 font-bold flex items-center gap-1">
                            ₹500 {isFreeDelivery && <span className="text-green-600">✓</span>}
                          </span>
                        </div>
                      </div>

                      {/* Status Message */}
                      <div className={`flex items-center justify-center gap-1 py-1 px-2 rounded-lg relative ${isFreeDelivery
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                        : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
                        }`}>
                        <span className="text-sm relative z-10">
                          {isFreeDelivery ? '🏆' : '📦'}
                        </span>
                        <p className={`text-[10px] font-semibold relative z-10 ${isFreeDelivery ? 'text-green-700' : 'text-blue-700'
                          }`}>
                          {isFreeDelivery ? (
                            <span className="animate-pulse">🎉 Free delivery unlocked! 🎉</span>
                          ) : (
                            <>Add <span className="font-bold text-indigo-600">₹{(500 - subtotal).toFixed(0)}</span> more for free delivery!</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add animations */}
                <style jsx>{`
                  @keyframes shine {
                    0% {
                      transform: translateX(-100%) skewX(-15deg);
                    }
                    100% {
                      transform: translateX(200%) skewX(-15deg);
                    }
                  }
                  .animate-shine {
                    animation: shine 3s infinite;
                  }
                  
                  @keyframes confetti-left-diagonal {
                    0% {
                      transform: translate(0, 0) rotate(var(--rot-start)) scale(0);
                      opacity: 0;
                    }
                    8% {
                      opacity: 1;
                      transform: translate(20px, -20px) rotate(var(--rot-start)) scale(1);
                    }
                    30% {
                      transform: translate(var(--shoot-x), var(--shoot-y)) rotate(calc(var(--rot-start) + 180deg)) scale(1);
                      opacity: 1;
                    }
                    100% {
                      transform: translate(var(--final-x), var(--final-y)) rotate(var(--rot-end)) scale(0.85);
                      opacity: 0;
                    }
                  }
                  
                  @keyframes confetti-right-diagonal {
                    0% {
                      transform: translate(0, 0) rotate(var(--rot-start)) scale(0);
                      opacity: 0;
                    }
                    8% {
                      opacity: 1;
                      transform: translate(-20px, -20px) rotate(var(--rot-start)) scale(1);
                    }
                    30% {
                      transform: translate(var(--shoot-x), var(--shoot-y)) rotate(calc(var(--rot-start) + 180deg)) scale(1);
                      opacity: 1;
                    }
                    100% {
                      transform: translate(var(--final-x), var(--final-y)) rotate(var(--rot-end)) scale(0.85);
                      opacity: 0;
                    }
                  }
                  
                  .confetti-left-diagonal {
                    animation: confetti-left-diagonal 4.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                  }
                  
                  .confetti-right-diagonal {
                    animation: confetti-right-diagonal 4.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                  }
                `}</style>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {lines.map(({ node }) => {
                    const product = node.merchandise.product;
                    const image =
                      node.merchandise.image?.url ||
                      product.featuredImage?.url ||
                      (product.images?.edges?.[0]?.node?.url || '');
                    return (
                      <div
                        key={node.id}
                        className="flex flex-col sm:flex-row gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-indigo-300 transition-colors"
                      >
                        {/* Product Image */}
                        <img
                          src={image}
                          alt={product.title}
                          className="w-full sm:w-24 sm:h-24 md:w-28 md:h-28 h-40 rounded-lg object-cover shadow-md flex-shrink-0"
                        />

                        {/* Product Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-base sm:text-lg mb-1 truncate">
                              {product.title}
                            </h4>
                            <p className="text-sm text-slate-500 mb-3 truncate">
                              {node.merchandise.title}
                            </p>
                          </div>

                          {/* Quantity + Price */}
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                              <button
                                onClick={() => handleUpdateQuantity(node.id, node.quantity - 1)}
                                disabled={node.quantity <= 1}
                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-10 text-center font-semibold">
                                {node.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(node.id, node.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors cursor-pointer"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            {/* Price */}
                            <span className="font-bold text-indigo-800 text-base sm:text-lg">
                              ₹{(Number(node.merchandise.price.amount) * node.quantity).toFixed(0)}
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(node.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg p-2 transition-colors self-end sm:self-start flex-shrink-0 cursor-pointer"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Cart Summary */}
                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 sm:p-5 md:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                    <span className="text-slate-700 font-medium text-sm sm:text-base">
                      Subtotal
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-slate-900">
                      ₹{subtotal.toFixed(0)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-xl transition-all active:scale-[0.98] hover:scale-[1.02] shadow-md cursor-pointer"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}

            {/* EMAIL STEP */}
            {checkoutStep === 1 && (
              <div className="p-6 md:p-8">
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Mail size={24} className="text-indigo-700" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">Email Address</h4>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-4 border-2 border-slate-200 rounded-lg text-base focus:border-indigo-600 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleBackToCart}
                      className="flex-1 px-6 py-4 border-2 border-indigo-300 rounded-lg font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      Back to Cart
                    </button>
                    <button
                      onClick={sendOTP}
                      disabled={!email}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* OTP STEP */}
            {checkoutStep === 2 && (
              <div className="p-6 md:p-8">
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <ShieldCheck size={24} className="text-indigo-700" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">Verification Code</h4>
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="w-full px-4 py-4 border-2 border-slate-200 rounded-lg text-center text-xl tracking-widest focus:border-indigo-600 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCheckoutStep(1)}
                      className="flex-1 px-6 py-4 border-2 border-indigo-300 rounded-lg font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={verifyOTP}
                      disabled={!otp}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CHECKOUT STEP */}
            {checkoutStep === 3 && (
              <div className="p-6 md:p-8">
                {orderPlaced ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <CheckCircle size={48} className="text-indigo-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-3">
                      Order Placed Successfully!
                    </h3>
                    <p className="text-slate-600 text-lg">Thank you for your purchase</p>
                  </div>
                ) : addressLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-indigo-700 animate-spin mb-4" />
                    <p className="text-slate-600 text-lg">Loading your details...</p>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto space-y-6">
                    {/* Address Section */}
                    <div className="bg-white border-2 border-indigo-200 rounded-xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <MapPin size={24} className="text-indigo-700" />
                          </div>
                          <h4 className="text-xl font-bold text-slate-900">Delivery Address</h4>
                        </div>
                      </div>

                      {isLoggedIn && addressFetched && (
                        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 mb-6">
                          <p className="text-indigo-800 font-semibold flex items-center gap-2">
                            <CheckCircle size={18} />
                            Auto-filled from your saved address
                          </p>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            placeholder="First Name"
                            value={address.firstName}
                            onChange={(e) => {
                              setAddress({ ...address, firstName: onlyLetters(e.target.value) });
                              setCalculationData(null);
                            }}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={address.lastName}
                            onChange={(e) => {
                              setAddress({ ...address, lastName: onlyLetters(e.target.value) });
                              setCalculationData(null);
                            }}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            placeholder="City"
                            value={address.city}
                            onChange={(e) => {
                              setAddress({ ...address, city: onlyLetters(e.target.value) });
                              setCalculationData(null);
                            }}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Zip Code *
                          </label>
                          <input
                            type="text"
                            placeholder="Zip Code"
                            value={address.zip}
                            maxLength={6}
                            onChange={(e) => {
                              const val = onlyNumbers(e.target.value).slice(0, 6);
                              setAddress({ ...address, zip: val });
                              setCalculationData(null);
                            }}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors"
                            required
                          />
                        </div>
                      </div>

                      {/* Calculate Button */}
                      <button
                        onClick={calculateShippingAndTax}
                        disabled={isCalculating}
                        className="cursor-pointer w-full mt-6 px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-lg font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-lg shadow-md"
                      >
                        {isCalculating ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            Calculating...
                          </>
                        ) : (
                          <>
                            <Calculator size={20} />
                            Calculate Shipping & Tax
                          </>
                        )}
                      </button>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-indigo-50/70 border-2 border-indigo-200 rounded-xl p-6 backdrop-blur-sm">
                      <h4 className="font-bold text-slate-900 text-xl mb-4 flex items-center gap-2">
                        <CheckCircle size={22} className="text-indigo-600" />
                        Order Summary
                      </h4>

                      {isCalculating && (
                        <div className="flex items-center gap-2 text-slate-600 py-4">
                          <Loader2 size={18} className="animate-spin text-indigo-600" />
                          <span>Calculating shipping & tax...</span>
                        </div>
                      )}

                      {calculationError && (
                        <div className="mt-2 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 font-medium">
                          {calculationError}
                        </div>
                      )}

                      {!isCalculating && calculationData && (
                        <div className="space-y-3 text-base">
                          <div className="flex justify-between py-2">
                            <span className="text-slate-700">Subtotal</span>
                            <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-slate-700">Tax</span>
                            <span className="font-semibold text-slate-900">₹{taxAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-slate-700">
                              Shipping ({calculationData.shipping?.title || "—"})
                              {isFreeDelivery && <span className="ml-2 text-green-600 font-semibold">(Free)</span>}
                            </span>
                            <span className="font-semibold text-slate-900">
                              {isFreeDelivery ? "₹0" : `₹${shippingAmount.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="pt-3 border-t-2 border-indigo-300 flex justify-between">
                            <span className="font-bold text-slate-900 text-lg">Total</span>
                            <span className="font-bold text-indigo-800 text-2xl">
                              ₹{totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white border-2 border-indigo-200 rounded-xl p-6 shadow-md">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <PaymentIcon size={24} className="text-indigo-700" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">Payment Method</h4>
                      </div>

                      <div className="space-y-3">
                        {[
                          { value: 'cod', label: 'Cash on Delivery', icon: Truck, color: '#4f46e5' },
                        ].map((option) => {
                          const Icon = option.icon;
                          const isSelected = paymentMethod === option.value;
                          return (
                            <label
                              key={option.value}
                              className={`flex items-center gap-3 p-5 border-2 rounded-lg cursor-pointer transition-all ${isSelected
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
                                className="w-5 h-5 cursor-pointer accent-indigo-600"
                              />
                              <Icon size={24} style={{ color: option.color }} />
                              <span className="font-semibold text-slate-900 flex-1 text-lg">
                                {option.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleBackToCart}
                        className="flex-1 px-8 py-4 border-2 border-indigo-300 rounded-lg font-bold text-indigo-700 hover:bg-indigo-50 transition-colors text-lg cursor-pointer"
                      >
                        Back to Cart
                      </button>
                      <button
                        onClick={placeOrder}
                        disabled={!calculationData}
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-lg font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-md cursor-pointer"
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
    );
  }


// 'use client';
// import { use, useEffect, useState } from 'react';
// import Image from 'next/image';
// import { Minus, Plus, Trash2, ShoppingCart, Loader2, Truck, CreditCard } from 'lucide-react';

// export default function RecoverCartPage({ params }) {
//   const { cartId: rawCartId } = use(params);
//   // Normalize cartId
//   const cartId = rawCartId?.startsWith("gid://")
//     ? rawCartId
//     : `gid://shopify/Cart/${rawCartId}`;

//   const indianStates = [
//     { name: "Andhra Pradesh", code: "AP" },
//     { name: "Arunachal Pradesh", code: "AR" },
//     { name: "Assam", code: "AS" },
//     { name: "Bihar", code: "BR" },
//     { name: "Chhattisgarh", code: "CG" },
//     { name: "Goa", code: "GA" },
//     { name: "Gujarat", code: "GJ" },
//     { name: "Haryana", code: "HR" },
//     { name: "Himachal Pradesh", code: "HP" },
//     { name: "Jharkhand", code: "JH" },
//     { name: "Karnataka", code: "KA" },
//     { name: "Kerala", code: "KL" },
//     { name: "Madhya Pradesh", code: "MP" },
//     { name: "Maharashtra", code: "MH" },
//     { name: "Manipur", code: "MN" },
//     { name: "Meghalaya", code: "ML" },
//     { name: "Mizoram", code: "MZ" },
//     { name: "Nagaland", code: "NL" },
//     { name: "Odisha", code: "OR" },
//     { name: "Punjab", code: "PB" },
//     { name: "Rajasthan", code: "RJ" },
//     { name: "Sikkim", code: "SK" },
//     { name: "Tamil Nadu", code: "TN" },
//     { name: "Telangana", code: "TG" },
//     { name: "Tripura", code: "TR" },
//     { name: "Uttar Pradesh", code: "UP" },
//     { name: "Uttarakhand", code: "UT" },
//     { name: "West Bengal", code: "WB" },
//     { name: "Delhi", code: "DL" },
//     { name: "Jammu and Kashmir", code: "JK" },
//     { name: "Ladakh", code: "LA" },
//     { name: "Puducherry", code: "PY" },
//     { name: "Chandigarh", code: "CH" },
//     { name: "Dadra and Nagar Haveli and Daman and Diu", code: "DN" },
//     { name: "Lakshadweep", code: "LD" },
//     { name: "Andaman and Nicobar Islands", code: "AN" },
//   ];

//   const [cart, setCart] = useState(null);
//   const [customerDetails, setCustomerDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updating, setUpdating] = useState({});
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Buy Now / Place Order States
//   const [showBuyNowModal, setShowBuyNowModal] = useState(false);
//   const [buyNowStep, setBuyNowStep] = useState(0); // 0=email, 2=otp, 3=address
//   const [bnEmail, setBnEmail] = useState("");
//   const [bnOtp, setBnOtp] = useState("");
//   const [bnPaymentMethod, setBnPaymentMethod] = useState("online");
//   const [bnAddress, setBnAddress] = useState({
//     firstName: "",
//     lastName: "",
//     address1: "",
//     city: "",
//     province: "",
//     provinceCode: "",
//     countryCode: "IN",
//     zip: "",
//     phone: "",
//   });
//   const [buyNowError, setBuyNowError] = useState("");
//   const [buyNowSendingOtp, setBuyNowSendingOtp] = useState(false);
//   const [buyNowVerifying, setBuyNowVerifying] = useState(false);
//   const [buyNowProcessing, setBuyNowProcessing] = useState(false);

//   const SHOP_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "swing-9926.myshopify.com";

//   /* -------------------- Recover Cart + Customer Details -------------------- */
//   useEffect(() => {
//     if (!cartId) {
//       setError('Invalid recovery link');
//       setLoading(false);
//       return;
//     }

//     const recoverCart = async () => {
//       try {
//         setLoading(true);
//         let customerShopifyId = localStorage.getItem('customerShopifyId');
//         if (!customerShopifyId) {
//           customerShopifyId = `guest_${Date.now()}`;
//           localStorage.setItem('customerShopifyId', customerShopifyId);
//         }

//         const res = await fetch('/api/cart', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             action: 'recover',
//             abandonedCartId: cartId,
//             customerShopifyId,
//           }),
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || 'Failed to recover cart');

//         const transformedCart = transformCart(data.cart);
//         setCart(transformedCart);

//         // Persist recovered cart ID to localStorage
//         if (data.cart?.id) {
//           localStorage.setItem("cartId", data.cart.id);
//         }

//         // Extract customer & shipping details if available
//         if (data.cart?.email || data.cart?.shippingAddress || data.customer) {
//           const shipping = data.cart?.shippingAddress || {};
//           const customer = data.customer || {};
//           const details = {
//             email: data.cart?.email || customer.email || "",
//             firstName: shipping.firstName || customer.firstName || "",
//             lastName: shipping.lastName || customer.lastName || "",
//             phone: shipping.phone || "",
//             address1: shipping.address1 || "",
//             city: shipping.city || "",
//             province: shipping.province || "",
//             zip: shipping.zip || "",
//           };
//           setCustomerDetails(details);
//           if (details.email) {
//             setBnEmail(details.email);
//             localStorage.setItem("customerEmail", details.email);
//           }
//         }
//       } catch (err) {
//         setError(err.message || 'Something went wrong');
//       } finally {
//         setLoading(false);
//       }
//     };

//     recoverCart();
//   }, [cartId]);

//   /* -------------------- Pre-fill Address When Modal Opens -------------------- */
//   useEffect(() => {
//     if (showBuyNowModal && customerDetails) {
//       const provinceCode = indianStates.find(s => s.name === customerDetails.province)?.code || customerDetails.province;
//       setBnAddress({
//         firstName: customerDetails.firstName || "",
//         lastName: customerDetails.lastName || "",
//         address1: customerDetails.address1 || "",
//         city: customerDetails.city || "",
//         province: customerDetails.province || "",
//         provinceCode: provinceCode,
//         countryCode: "IN",
//         zip: customerDetails.zip || "",
//         phone: customerDetails.phone || "",
//       });
//     }
//   }, [showBuyNowModal, customerDetails]);

//   /* -------------------- Transform Cart Data (FIXED FOR YOUR API RESPONSE) -------------------- */
//   const transformCart = (cartData) => {
//     let lines = [];

//     // Handle new GraphQL format: lines.edges
//     if (cartData.lines?.edges && cartData.lines.edges.length > 0) {
//       lines = cartData.lines.edges.map(edge => edge.node);
//     }
//     // Handle legacy Storefront API format: items array (this matches your current response)
//     else if (cartData.items && Array.isArray(cartData.items) && cartData.items.length > 0) {
//       lines = cartData.items.map(item => ({
//         id: item.id,
//         quantity: item.quantity || 1,
//         merchandise: {
//           id: item.variant.id,
//           title: item.variant.title,
//           price: {
//             amount: item.variant.price.amount,
//             currencyCode: item.variant.price.currencyCode || 'INR'
//           },
//           product: {
//             title: item.variant.product.title,
//             featuredImage: {
//               url: item.variant.product.featuredImage?.url || '/placeholder.jpg'
//             }
//           }
//         }
//       }));
//     }

//     const subtotal = lines.reduce((sum, line) => {
//       const price = parseFloat(line.merchandise.price.amount) || 0;
//       return sum + price * line.quantity;
//     }, 0);

//     return {
//       id: cartData.id,
//       checkoutUrl: cartData.checkoutUrl,
//       lines,
//       totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
//       total: subtotal
//     };
//   };

//   /* -------------------- Update & Remove Items -------------------- */
//   const updateQuantity = async (lineId, quantity) => {
//     if (quantity < 1) return removeItem(lineId);
//     setUpdating(prev => ({ ...prev, [lineId]: true }));
//     try {
//       const res = await fetch('/api/cart', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ action: 'updateLine', cartId: cart.id, lineId, quantity, localCartId: localStorage.getItem("cartId") }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setCart(transformCart(data.cart));
//         localStorage.setItem("cartId", data.cart.id);
//       }
//     } finally {
//       setUpdating(prev => ({ ...prev, [lineId]: false }));
//     }
//   };

//   const removeItem = async (lineId) => {
//     if (!confirm('Remove this item?')) return;
//     setUpdating(prev => ({ ...prev, [lineId]: true }));
//     try {
//       const res = await fetch('/api/cart', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ action: 'removeLine', cartId: cart.id, lineId, localCartId: localStorage.getItem("cartId") }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setCart(transformCart(data.cart));
//         localStorage.setItem("cartId", data.cart.id);
//       }
//     } finally {
//       setUpdating(prev => ({ ...prev, [lineId]: false }));
//     }
//   };

//   /* -------------------- Place Order / Buy Now Logic -------------------- */
//   const handleBuyNow = () => {
//     const customerShopifyId = localStorage.getItem('customerShopifyId');
//     const isLoggedIn = customerShopifyId && !customerShopifyId.startsWith('guest_');
//     setBnEmail(customerDetails?.email || localStorage.getItem("customerEmail") || "");
//     setBnOtp("");
//     setBuyNowError("");
//     setShowBuyNowModal(true);
//     if (isLoggedIn) {
//       setBuyNowStep(3);
//       return;
//     }
//     const storedEmail = localStorage.getItem("customerEmail") || "";
//     const hasEmail = storedEmail || customerDetails?.email;
//     const hasFullAddress = customerDetails?.firstName && customerDetails?.address1 && customerDetails?.city && customerDetails?.province && customerDetails?.zip && customerDetails?.phone;
//     setBnEmail(hasEmail ? (storedEmail || customerDetails.email) : "");
//     if (hasEmail && hasFullAddress) setBuyNowStep(3);
//     else if (hasEmail) setBuyNowStep(3);
//     else setBuyNowStep(0);
//   };

//   const sendBuyNowOtp = async () => {
//     if (!bnEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bnEmail)) {
//       setBuyNowError("Please enter a valid email");
//       return;
//     }
//     const customerShopifyId = localStorage.getItem("customerShopifyId");
//     if (!customerShopifyId) {
//       localStorage.setItem("customerEmail", bnEmail);
//       setBuyNowStep(3);
//       return;
//     }
//     setBuyNowSendingOtp(true);
//     try {
//       const res = await fetch("/api/otp/send", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: bnEmail, shop: SHOP_DOMAIN }),
//       });
//       const data = await res.json();
//       if (data.success || data.message?.includes("already verified")) {
//         setBuyNowStep(data.message?.includes("already verified") ? 3 : 2);
//       } else setBuyNowError(data.message || "Failed to send OTP");
//     } catch {
//       setBuyNowError("Network error");
//     } finally {
//       setBuyNowSendingOtp(false);
//     }
//   };

//   const verifyBuyNowOtp = async () => {
//     if (!bnOtp) return setBuyNowError("Enter OTP");
//     setBuyNowVerifying(true);
//     try {
//       const res = await fetch("/api/otp/verify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: bnEmail, otp: bnOtp, shop: SHOP_DOMAIN }),
//       });
//       const data = await res.json();
//       if (data.success) setBuyNowStep(3);
//       else setBuyNowError("Invalid OTP");
//     } catch {
//       setBuyNowError("Network error");
//     } finally {
//       setBuyNowVerifying(false);
//     }
//   };

//   const confirmBuyNowCheckout = async () => {
//     if (!bnAddress.firstName || !bnAddress.address1 || !bnAddress.city || !bnAddress.zip || !bnAddress.phone) {
//       setBuyNowError("Please fill all required fields");
//       return;
//     }
//     setBuyNowProcessing(true);
//     setBuyNowError("");
//     try {
//       const lineItems = cart.lines.map(line => ({
//         variant_id: line.merchandise.id.split("/").pop(),
//         quantity: line.quantity,
//         price: line.merchandise.price.amount,
//       }));
//       const payload = {
//         shop: SHOP_DOMAIN,
//         email: bnEmail,
//         name: `${bnAddress.firstName} ${bnAddress.lastName}`.trim(),
//         shippingAddress: { ...bnAddress, provinceCode: bnAddress.provinceCode || bnAddress.province },
//         paymentMethod: bnPaymentMethod,
//         lineItems,
//       };
//       const res = await fetch("/api/orders/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (!res.ok || !data.success) throw new Error(data.error || data.message || "Checkout failed");
//       const redirectUrl = data?.data?.checkoutUrl || data?.checkoutUrl || data?.data?.checkout_url || data?.checkout_url || data?.data?.url || data?.url || data?.data?.redirect || data?.redirectUrl || data?.data?.paymentLink || data?.paymentLink;
//       if (redirectUrl) window.location.href = redirectUrl;
//       else {
//         alert("Order placed successfully! Check your email.");
//         setShowBuyNowModal(false);
//       }
//     } catch (err) {
//       setBuyNowError(err.message || "Checkout failed");
//     } finally {
//       setBuyNowProcessing(false);
//     }
//   };

//   const resetBuyNowModal = () => {
//     setShowBuyNowModal(false);
//     setBuyNowStep(0);
//     setBnEmail("");
//     setBnOtp("");
//     setBuyNowError("");
//     setBuyNowSendingOtp(false);
//     setBuyNowVerifying(false);
//     setBuyNowProcessing(false);
//     setBnAddress({
//       firstName: "",
//       lastName: "",
//       address1: "",
//       city: "",
//       province: "",
//       provinceCode: "",
//       countryCode: "IN",
//       zip: "",
//       phone: "",
//     });
//   };

//   /* -------------------- Calculations -------------------- */
//   const subtotal = cart?.lines?.reduce((sum, line) => parseFloat(line.merchandise?.price?.amount || 0) * line.quantity, 0) || 0;
//   const taxAmount = subtotal * 0.18;
//   const isFreeDelivery = subtotal >= 100000;
//   const shippingAmount = isFreeDelivery ? 0 : 50;
//   const totalAmount = subtotal + taxAmount + shippingAmount;

//   const goToCheckout = () => cart?.checkoutUrl ? window.location.href = cart.checkoutUrl : window.location.href = '/cart';

//   /* -------------------- Loading / Error / Empty States -------------------- */
//   if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-16 h-16 animate-spin text-blue-600" /> <span className="ml-4 text-2xl">Recovering your cart…</span></div>;
//   if (error) return <div className="min-h-screen flex items-center justify-center"><div className="text-center p-8 bg-red-50 rounded-xl border border-red-200"><ShoppingCart className="w-24 h-24 text-red-400 mx-auto mb-4" /><p className="text-xl font-bold text-red-600">{error}</p><a href="/collection" className="mt-4 inline-block text-blue-600 underline">Continue Shopping →</a></div></div>;
//   if (!cart || cart.lines?.length === 0) return <div className="min-h-screen flex items-center justify-center"><div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200 max-w-md"><ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-4" /><h1 className="text-2xl font-bold">Your cart is empty</h1><a href="/collection" className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-lg">Start Shopping</a></div></div>;

//   /* ========== Main UI ========== */
//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 py-12 px-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-700 bg-clip-text text-transparent mb-4">
//               Your Recovered Cart 🛒
//             </h1>
//             <p className="text-xl text-gray-600">Great! We saved your items. Complete your purchase now.</p>
//           </div>

//           {/* Free Shipping Progress */}
//           <div className="mb-8 p-4 bg-white rounded-xl shadow border">
//             <div className="flex items-center justify-between mb-2">
//               <div className="flex items-center gap-3">
//                 <div className={`p-2 rounded-lg ${isFreeDelivery ? 'bg-green-500' : 'bg-indigo-600'}`}>
//                   <Truck className="text-white" size={20} />
//                 </div>
//                 <p className="font-bold">{isFreeDelivery ? 'Free Shipping Unlocked!' : 'Free Shipping on ₹1,00,000+'}</p>
//               </div>
//               {!isFreeDelivery && <p className="text-orange-600 font-bold">₹{(100000 - subtotal).toLocaleString('en-IN')} more</p>}
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-3">
//               <div className={`${isFreeDelivery ? 'bg-green-500' : 'bg-indigo-600'} h-3 rounded-full transition-all`} style={{ width: `${Math.min((subtotal / 100000) * 100, 100)}%` }} />
//             </div>
//           </div>

//           {/* Cart Items */}
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
//             {cart.lines.map((line) => {
//               const product = line.merchandise.product;
//               const image = product.featuredImage?.url || '/placeholder.jpg';
//               const price = parseFloat(line.merchandise.price.amount);
//               const isUpdating = updating[line.id];

//               return (
//                 <div key={line.id} className="flex gap-4 p-6 border-b last:border-b-0 hover:bg-gray-50">
//                   <Image src={image} width={80} height={80} className="w-20 h-20 rounded-xl object-cover" alt={product.title} />
//                   <div className="flex-1">
//                     <h4 className="font-semibold text-lg">{product.title}</h4>
//                     <p className="text-sm text-gray-500">{line.merchandise.title}</p>
//                     <div className="flex items-center justify-between mt-4">
//                       <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-2">
//                         <button onClick={() => updateQuantity(line.id, line.quantity - 1)} disabled={isUpdating || line.quantity <= 1} className="w-10 h-10 rounded-lg hover:bg-gray-200 disabled:opacity-50"><Minus size={18} /></button>
//                         <span className="w-12 text-center font-bold text-lg">{line.quantity}</span>
//                         <button onClick={() => updateQuantity(line.id, line.quantity + 1)} disabled={isUpdating} className="w-10 h-10 rounded-lg bg-indigo-600 text-white"><Plus size={18} /></button>
//                       </div>
//                       <span className="font-bold text-xl">₹{(price * line.quantity).toLocaleString('en-IN')}</span>
//                     </div>
//                   </div>
//                   <button onClick={() => removeItem(line.id)} disabled={isUpdating} className="p-3 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={22} /></button>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Order Summary */}
//           <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border-2 border-indigo-100 shadow-2xl">
//             <h3 className="text-2xl font-bold text-indigo-900 mb-6">Order Summary</h3>
//             <div className="space-y-4 mb-8">
//               <div className="flex justify-between text-lg"><span>Subtotal</span><span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span></div>
//               <div className="flex justify-between text-lg"><span>Tax (18%)</span><span className="font-bold">₹{taxAmount.toLocaleString('en-IN')}</span></div>
//               <div className="flex justify-between text-xl"><span>Shipping</span><span className="font-bold">{isFreeDelivery ? 'Free' : `₹${shippingAmount}`}</span></div>
//               <div className="pt-6 border-t-2 border-indigo-300 flex justify-between text-3xl font-black">
//                 <span>Total</span>
//                 <span className="bg-gradient-to-r from-indigo-600 to-blue-700 bg-clip-text text-transparent">₹{totalAmount.toLocaleString('en-IN')}</span>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4">
//               <a href="/collection" className="flex-1 text-center py-4 border-2 border-indigo-300 rounded-xl font-semibold text-indigo-700 hover:bg-indigo-50">
//                 Continue Shopping
//               </a>
//               <button onClick={goToCheckout} className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
//                 <CreditCard size={24} /> Shopify Checkout
//               </button>
//               <button onClick={handleBuyNow} className="flex-1 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg hover:shadow-xl">
//                 Place Order Now
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Place Order Modal */}
//       {showBuyNowModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={resetBuyNowModal}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-2xl font-bold">Complete Your Order</h3>
//               <button onClick={resetBuyNowModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
//             </div>
//             {buyNowError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{buyNowError}</div>}

//             {/* Step 0: Email */}
//             {buyNowStep === 0 && (
//               <div className="space-y-5">
//                 <input
//                   type="email"
//                   value={bnEmail}
//                   onChange={(e) => setBnEmail(e.target.value)}
//                   placeholder="Enter your email address*"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <button
//                   onClick={sendBuyNowOtp}
//                   disabled={buyNowSendingOtp}
//                   className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold disabled:opacity-50"
//                 >
//                   {buyNowSendingOtp ? "Sending OTP..." : "Continue"}
//                 </button>
//               </div>
//             )}

//             {/* Step 2: OTP */}
//             {buyNowStep === 2 && (
//               <div className="space-y-5">
//                 <p className="text-gray-600">We sent a 6-digit OTP to <strong>{bnEmail}</strong></p>
//                 <input
//                   value={bnOtp}
//                   onChange={(e) => setBnOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                   placeholder="Enter OTP"
//                   maxLength={6}
//                   className="w-full px-4 py-3 border text-center text-2xl tracking-widest rounded-lg"
//                 />
//                 <button
//                   onClick={verifyBuyNowOtp}
//                   disabled={buyNowVerifying}
//                   className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold disabled:opacity-50"
//                 >
//                   {buyNowVerifying ? "Verifying..." : "Verify OTP"}
//                 </button>
//               </div>
//             )}

//             {/* Step 3: Address & Payment */}
//             {buyNowStep === 3 && (
//               <div className="space-y-5">
//                 <p className="text-gray-600 text-sm">Review and complete your details:</p>
//                 <div className="grid grid-cols-2 gap-4">
//                   <input placeholder="First Name*" value={bnAddress.firstName} onChange={(e) => setBnAddress(p => ({...p, firstName: e.target.value}))} className="border px-4 py-3 rounded-lg" />
//                   <input placeholder="Last Name" value={bnAddress.lastName} onChange={(e) => setBnAddress(p => ({...p, lastName: e.target.value}))} className="border px-4 py-3 rounded-lg" />
//                 </div>
//                 <input placeholder="Address Line 1*" value={bnAddress.address1} onChange={(e) => setBnAddress(p => ({...p, address1: e.target.value}))} className="w-full border px-4 py-3 rounded-lg" />
//                 <input placeholder="City*" value={bnAddress.city} onChange={(e) => setBnAddress(p => ({...p, city: e.target.value}))} className="w-full border px-4 py-3 rounded-lg" />
//                 <select value={bnAddress.provinceCode} onChange={(e) => setBnAddress(p => ({...p, provinceCode: e.target.value}))} className="w-full border px-4 py-3 rounded-lg">
//                   <option value="">Select Province</option>
//                   {indianStates.map(state => (
//                     <option key={state.code} value={state.code}>{state.name}</option>
//                   ))}
//                 </select>
//                 <div className="grid grid-cols-2 gap-4">
//                   <input placeholder="PIN Code*" value={bnAddress.zip} onChange={(e) => setBnAddress(p => ({...p, zip: e.target.value}))} className="border px-4 py-3 rounded-lg" />
//                   <input placeholder="Phone*" value={bnAddress.phone} onChange={(e) => setBnAddress(p => ({...p, phone: e.target.value}))} className="border px-4 py-3 rounded-lg" />
//                 </div>
//                 <select value={bnPaymentMethod} onChange={(e) => setBnPaymentMethod(e.target.value)} className="w-full border px-4 py-3 rounded-lg">
//                   <option value="online">Online Payment (Recommended)</option>
//                   <option value="cod">Cash on Delivery</option>
//                 </select>
//                 <div className="flex gap-3 pt-4">
//                   <button onClick={resetBuyNowModal} className="flex-1 border border-gray-400 py-3 rounded-lg font-medium">
//                     Cancel
//                   </button>
//                   <button
//                     onClick={confirmBuyNowCheckout}
//                     disabled={buyNowProcessing}
//                     className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold disabled:opacity-50"
//                   >
//                     {buyNowProcessing ? "Processing..." : "Confirm & Pay"}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }