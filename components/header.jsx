"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ShoppingBag,
  User,
  LogOut,
  Package,
  UserCircle,
} from "lucide-react";

export default function Header({ cart, openCart }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
const itemCount = React.useMemo(() => {
  if (cart?.totalQuantity !== undefined && cart?.totalQuantity !== null) {
    return cart.totalQuantity;
  }
  if (cart?.items && Array.isArray(cart.items)) {
    return cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }
  return 0;
}, [cart]);
  const headerRef = useRef(null);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/collection", label: "Collection" },
    { href: "/gallery", label: "Gallery" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  // Check if logged in
  useEffect(() => {
     const checkLogin = () => {
    const id = localStorage.getItem("customerShopifyId");
    setIsLoggedIn(!!id);
  };

    checkLogin();

  // Listen login event
  window.addEventListener("user-logged-in", checkLogin);
  window.addEventListener("user-logged-out", checkLogin);

  return () => {
    window.removeEventListener("user-logged-in", checkLogin);
    window.removeEventListener("user-logged-out", checkLogin);
  };
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleNavClick = useCallback(
    (href) => {
      router.push(href);
      closeMobileMenu();
    },
    [router, closeMobileMenu]
  );

  // Close dropdowns on outside click / ESC (improved from Khakhra)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleUserMenu = () => setIsUserMenuOpen((prev) => !prev);

 const handleLogout = () => {
    localStorage.removeItem("customerShopifyId");
    localStorage.removeItem("cartId");
    localStorage.removeItem("guestCartId");
    window.dispatchEvent(new Event("user-logged-out"));
    setIsLoggedIn(false);
    router.push("/");
    router.refresh();
    setIsUserMenuOpen(false);
  };

  // Check if current route matches
  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5"
          : "bg-white/95 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">

          {/* Logo - Responsive sizing */}
          <Link href="/" className="flex items-center z-10">
            <img
              src="/logo_swing.webp"
              alt="Brand Logo"
              className="h-9 w-auto object-contain xs:h-10 sm:h-12 md:h-14"
            />
          </Link>

          {/* Desktop/Tablet Menu - Visible from md (768px) upwards */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 lg:px-4 py-2 transition-all duration-200 group ${
                  isActive(link.href)
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <span className="relative z-10 text-sm lg:text-base">{link.label}</span>
                <span
                  className={`absolute inset-0 bg-blue-50 rounded-lg transition-transform ${
                    isActive(link.href) ? "scale-100" : "scale-0 group-hover:scale-100"
                  }`}
                />
              </Link>
            ))}

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300 mx-4"></div>

            {/* Cart Icon */}
            <button
              onClick={openCart}
              className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Menu or Login */}
            {isLoggedIn ? (
              <div className="relative ml-2">
                <button
                  onClick={toggleUserMenu}
                  className="p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-all flex items-center justify-center cursor-pointer"
                  aria-label="User Menu"
                >
                  <User className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>

                {/* User Dropdown - Mobile & Desktop */}
                {isUserMenuOpen && (
                  <div className="absolute top-full mt-4 right-0 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <div className="py-3">
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-6 py-3.5 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <UserCircle size={20} className="mr-4 text-blue-600" />
                        <span className="font-medium">My Profile</span>
                      </Link>
                      <Link
                        href="/order-history"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-6 py-3.5 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <Package size={20} className="mr-4 text-blue-600" />
                        <span className="font-medium">Order History</span>
                      </Link>
                      <div className="h-px bg-gray-200 mx-6 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-6 py-3.5 text-red-600 hover:bg-red-50 transition-colors font-medium text-left cursor-pointer"
                      >
                        <LogOut size={20} className="mr-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 lg:px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all text-sm lg:text-base font-medium ml-2 shadow-sm cursor-pointer"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Icons - Only visible on <md */}
          <div className="flex items-center space-x-3 md:hidden">
            {/* Cart Icon */}
            <button
              onClick={openCart}
              className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Improved responsive behavior */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-xl">
          <div className="mx-auto px-4 sm:px-6 py-5 max-w-7xl space-y-1">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive(link.href)
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-gray-200 my-4"></div>

            {/* User Section in Mobile Menu */}
            {isLoggedIn ? (
              <div className="space-y-1">
                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  <UserCircle size={20} className="mr-3 text-blue-600" />
                  <span className="font-medium">My Profile</span>
                </Link>
                <Link
                  href="/order-history"
                  onClick={closeMobileMenu}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Package size={20} className="mr-3 text-blue-600" />
                  <span className="font-medium">Order History</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium cursor-pointer"
                >
                  <LogOut size={20} className="mr-3" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                onClick={closeMobileMenu}
                className="block w-full px-6 py-3.5 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-500 transition-all shadow-md cursor-pointer"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}