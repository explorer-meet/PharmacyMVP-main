import { createContext, useContext } from 'react';

const ENGLISH_LABELS = {
  name: 'English',
  nav: {
    home: 'Home',
    pharmacyServices: 'Pharmacy Services',
    pharmacyStore: 'Pharmacy Store',
    reviews: 'Reviews',
    login: 'Login',
    signup: 'Sign Up',
    dashboard: 'Dashboard',
    logout: 'Logout',
    notifications: 'Notifications',
  },
  pharmacy: {
    searchPlaceholder: 'Search medicines, brands, symptoms...',
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    viewCart: 'View Cart',
    allMedicines: 'All Medicines',
    favorites: 'Favorites',
    uploadPrescription: 'Upload Prescription',
    filterBy: 'Filter By',
    brand: 'Brand',
    manufacturer: 'Manufacturer',
    composition: 'Composition',
    priceRange: 'Price Range',
    applyFilters: 'Apply Filters',
    clearFilters: 'Clear Filters',
  },
  chatbot: {
    title: 'MedBot Assistant',
    placeholder: 'Ask about medicines, orders...',
    send: 'Send',
    greeting: "Hello! I'm MedBot. How can I help you today?",
  },
  offline: {
    banner: 'You are offline. Some features may be unavailable.',
  },
  notifications: {
    title: 'Notifications Hub',
    push: 'Push Notifications',
    email: 'Email Notifications',
    sms: 'SMS Notifications',
    orderUpdates: 'Order Updates',
    prescriptionReminders: 'Prescription Reminders',
    offerAlerts: 'Offer and Discount Alerts',
    healthReminders: 'Health Reminders',
    save: 'Save Preferences',
    saved: 'Preferences saved!',
  },
  orders: {
    title: 'Your Orders',
    subtitle: 'Track your placed medicine orders and view complete order details.',
    totalOrders: 'Total Orders',
    totalSpent: 'Total Spent',
    searchPlaceholder: 'Search by order ID or store...',
    allOrders: 'All Orders',
    trackOrder: 'Track Order',
    reorder: 'Reorder',
    returnRefund: 'Return / Refund',
    viewItems: 'View Items',
    hideItems: 'Hide Items',
    customer: 'Customer',
    payment: 'Payment',
    items: 'Items',
    store: 'Store',
    orderNumber: 'Order Number',
    orderDate: 'Order Date',
    totalAmount: 'Total Amount',
    deliveryType: 'Delivery Type',
    status: 'Status',
    noOrders: 'No orders available yet.',
    noOrdersSubtext: 'Your confirmed orders will appear here.',
    noOrdersFilter: 'No orders match your filters.',
    noOrdersFilterSubtext: 'Try changing the status filter or search term.',
    orderPlaced: 'Order Placed',
    packed: 'Packed',
    outForDelivery: 'Out for Delivery',
    delivered: 'Delivered',
    readyForPickup: 'Ready for Pick up',
    reorderSuccess: 'Items added to cart! Proceeding to checkout...',
    reorderError: 'Failed to reorder. Please try again.',
    reorderConfirm: 'Add these items to your cart?',
    qty: 'Qty',
    unnamedItem: 'Unnamed Item',
    noItems: 'No items available for this order.',
    showing: 'Showing',
    of: 'of',
    orders: 'orders',
    prev: 'Prev',
    next: 'Next',
  },
};

export const SUPPORTED_LANGUAGES = [{
  code: 'en',
  name: 'English',
}];

const LanguageContext = createContext({
  language: 'en',
  t: ENGLISH_LABELS,
  changeLanguage: () => {},
  SUPPORTED_LANGUAGES,
});

export const LanguageProvider = ({ children }) => {
  return (
    <LanguageContext.Provider
      value={{
        language: 'en',
        t: ENGLISH_LABELS,
        changeLanguage: () => {},
        SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
