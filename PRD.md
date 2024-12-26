# Product Requirements Document: Expensify

## Objective

Develop a web application for users to track their income and expenses, visualize financial data, and handle multi-currency support with real-time exchange rates.

---

## 1. Functional Requirements

### 1.1 Core Features

1. **Transaction Management**

   - Users can add income and expense entries, specifying:
     - Amount
     - Category (static list: Food, Transportation, Bills, General)
     - Date
   - Support for editing and deleting transactions.

2. **Currency Conversion**

   - Allow input of amounts in various currencies.
   - Convert non-base currency entries to the base currency using live exchange rates from APIs (e.g., ExchangeRate-API or Fastforex.io).

3. **Filtering**

   - Enable filtering of transactions by:
     - Date range
     - Category

4. **Data Display**

   - Display a list of transactions, showing:
     - Amount
     - Category
     - Date
   - Provide a summary showing:
     - Total income
     - Total expenses
     - Net balance

5. **Reports**
   - Visualize expenses by category using:
     - Bar chart
     - Pie chart

### 1.2 Data Export

- Allow users to export financial data as a CSV file.

---

## 2. Technical Requirements

### 2.1 Framework & Libraries

- Use Vue.js as the primary framework.
- Include additional libraries as needed for:
  - Charting
  - State management
  - Currency conversion API integration

### 2.2 State Management

- Implement state management via:
  - A library like Vuex or Pinia
  - A custom-built solution, if preferred

### 2.3 Data Persistence

- Store user data locally using:
  - LocalStorage
  - IndexedDB

### 2.4 API Integration

- Integrate with a currency conversion API (e.g., ExchangeRate-API or Fastforex.io).

### 2.5 Code Quality

- Adhere to clean coding principles.
- Ensure modularity and reusability.

### 2.6 Automated Testing

- Include automated tests for:
  - Core functionality
  - Edge cases (e.g., invalid inputs, large datasets)

### 2.7 Visual Design

- Create a user-friendly and aesthetically pleasing interface.

---

## 3. Non-Functional Requirements

1. **Performance**

   - Ensure smooth rendering of charts and lists, even with large datasets.
   - Optimize API calls for live exchange rates.

2. **Accessibility**
   - Follow accessibility guidelines for a wide user base.

---
