import React from 'react';

const Navbar = () => {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">ExpenseTracker</div>
      <ul className="flex space-x-6 text-gray-700 font-medium">
        <li><a href="/dashboard" className="hover:text-blue-500">Dashboard</a></li>
        <li><a href="/budgets" className="hover:text-blue-500">Budgets</a></li>
        <li><a href="/expenses" className="hover:text-blue-500">Expenses</a></li>
        <li><a href="/savings" className="hover:text-blue-500">Savings</a></li>
        <li><a href="/profile" className="hover:text-blue-500">Profile</a></li>
      </ul>
    </header>
  );
};

export default Navbar;
