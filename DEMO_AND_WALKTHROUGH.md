# Naik Foods E-Commerce Prototype — Interactive Demo & Feature Walkthrough

**Live Frontend Application**: [https://naikfoodsassessment.netlify.app](https://naikfoodsassessment.netlify.app)  
**Live Backend API**: [https://naik-foods-mern-e-commerce-prototype.onrender.com](https://naik-foods-mern-e-commerce-prototype.onrender.com)  
**Git Repository**: [https://github.com/SangishettyPrem/Naik-Foods-MERN-e-commerce-prototype](https://github.com/SangishettyPrem/Naik-Foods-MERN-e-commerce-prototype)  
**Company Assessment**: Bits And Volts Private Limited

---

## Interactive Feature Demonstration Guide

This guide is designed for the evaluator to test and verify every improvement on the live deployed web application.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          EVALUATION USER JOURNEY MAP                            │
│                                                                                 │
│  1. Instant Search    2. Regional Filter    3. In-Card Variants   4. Cart Meter │
│    Press '/' key   ──►  Filter by Pune   ──►  Toggle 200g/500g ──► Progress bar │
│    Type 'masala'        or Vidarbha           Live price update     to ₹999     │
│                                                                        │        │
│  7. Order Tracking    6. Express Checkout   5. PIN Code Check          │        │
│    Instant tracking ◄── 1-Page auto-city ◄──  Enter '411002'   ◄───────┘        │
│    ID generated         payment simulation    24-48 hr ETA                      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### Journey 1: In-Card Variant Selector & 1-Click Quick Add
* **Where to Test**: [Explore Store](https://naikfoodsassessment.netlify.app/store) or [Home Bestsellers](https://naikfoodsassessment.netlify.app/)
* **Steps**:
  1. Hover over any product card (e.g., *Authentic Puneri Bakarwadi* or *Authentic Vidarbha Goda Masala*).
  2. Notice the interactive weight pills below the title (`100g`, `200g`, `500g`).
  3. Click between `200g` and `500g`.
  4. **Expected Result**: The price (e.g. ₹95 vs ₹220) and discount badge instantly recalculate without page navigation.
  5. Click the green **"Add"** button. The slide-over cart drawer automatically opens with an animated confirmation badge.

---

### Journey 2: Gamified Cart Drawer & Free Delivery Progress Meter
* **Where to Test**: Click the Cart button (`₹xxx`) in the top navigation at any time.
* **Steps**:
  1. Open the cart drawer with an item value under ₹999.
  2. Observe the animated progress bar: *"Add ₹XXX more to unlock FREE Express Delivery"*.
  3. In the drawer's **"Quick Add Regional Snacks"** section, click **"+ Add"** on *Bhadang Murmura (₹75)* or *Puneri Bakarwadi (₹95)*.
  4. **Expected Result**: The subtotal and progress bar increase dynamically. Once ₹999 is reached, the banner transforms into: *"🎉 You've unlocked FREE Delivery!"*.
  5. Enter promo code **`NAIK10`** in the coupon input and click **"Apply"**.
  6. **Expected Result**: A 10% discount is calculated server-side and deducted immediately.

---

### Journey 3: Hyper-Local Indian PIN Code Delivery Checker
* **Where to Test**: Click on any product or open the Quick View modal.
* **Steps**:
  1. Scroll to the **"Delivery & Serviceability"** section.
  2. Enter **`411002`** (Pune) and click **"Check"**.
     * **Expected Result**: *"✓ Available in Pune (Shukrawar Peth / Swargate) • Estimated ETA: 24 - 48 Hours Express Delivery via Bluedart / Delhivery / Naik Logistics"*.
  3. Enter **`400001`** (Mumbai) or **`440001`** (Nagpur, Vidarbha).
     * **Expected Result**: Transit times adjust dynamically based on Indian postal zones.

---

### Journey 4: Instant Debounced Catalog Search Modal
* **Where to Test**: Press the `/` key on your keyboard from anywhere on the site, or click the search bar.
* **Steps**:
  1. Notice the instant search modal popover.
  2. Click a trending tag such as *"Goda Masala"* or *"Bakarwadi"*.
  3. Or type `"noodles"` into the search box.
  4. **Expected Result**: Results update with a 300ms debounce, highlighting matching products with photos, pack sizes, and direct add-to-cart buttons.
  5. Press `ESC` or click outside to dismiss.

---

### Journey 5: Regional Provenance Filter
* **Where to Test**: [Store Catalog](https://naikfoodsassessment.netlify.app/store) or Header Region Dropdown.
* **Steps**:
  1. Click **"Region: [All Maharashtra ▾]"** in the header.
  2. Select **"Pune Heritage"** or **"Vidarbha Spices"**.
  3. **Expected Result**: The catalog instantly filters to authentic regional specialties, displaying curated provenance descriptions.

---

### Journey 6: Frictionless 1-Page Express Checkout
* **Where to Test**: Click **"Proceed to Checkout"** inside the Cart Drawer.
* **Steps**:
  1. The 1-page checkout modal opens.
  2. Enter your 6-digit PIN code (e.g. `411002`). The City (*Pune*) and State (*Maharashtra*) auto-populate.
  3. Fill name and phone number.
  4. Select payment method: **UPI (GPay / PhonePe / Paytm)** or **Cash on Delivery (COD)**.
  5. Click **"Confirm & Place Order"**.
  6. **Expected Result**: The order is recorded in MongoDB, the cart clears, and a receipt screen appears with an official order number (`NF-2026-XXXXXX`) and live logistics tracking ID.
