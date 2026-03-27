import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../main';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [userdata, setUserData] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchDataFromApi = async () => {
    try {
      const token = localStorage.getItem('medVisionToken');
      const response = await axios.get(`${baseURL}/fetchdata`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedData = response.data.userData;
      setUserData(fetchedData);

      // Extract orders from userdata
      const ordersArray = fetchedData.order || [];
      setOrders(ordersArray);

      localStorage.setItem('userData', JSON.stringify(fetchedData));
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleDropdown = (orderId) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const handletracking = (id) => {
    navigate(`/tracking/${id}`);
  };

  // Filter orders where status is "booked"
  const filteredOrders = orders.filter((order) => order.status === 'Booked');

  return (
    <div className="mt-[10vh] min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-extrabold text-gray-600 mb-6">Your Orders</h1>
      {filteredOrders.length > 0 ? (
        <ul className="space-y-4">
          {filteredOrders.map((order, index) => (
            <li
              key={index}
              className="p-6 bg-white rounded-lg shadow-lg border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">
                    <span className="text-gray-600">Order ID:</span> {order.orderId || 'N/A'}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Customer Name:</span>{' '}
                    {userdata.name || 'N/A'}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Payment mode:</span> {order.payment || 'N/A'}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Amount:</span> Rs {order.totalPrice || 0}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow"
                    onClick={() => handletracking(order.orderId)}
                  >
                    Track Order
                  </button>
                  <button
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md shadow"
                    onClick={() => toggleDropdown(order.orderId)}
                  >
                    {expandedOrder === order.orderId ? 'Hide Items' : 'View Items'}
                  </button>
                </div>
              </div>
              {expandedOrder === order.orderId && (
                <div className="mt-4 bg-gray-50 p-4 rounded border">
                  <h3 className="font-semibold text-gray-700">Order Items:</h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    {order.items?.length > 0 ? (
                      order.items.map((item, idx) => (
                        <li key={idx} className="py-1">
                          {item.name || 'Unnamed Item'} - Rs {item.price || 0} Quantity: {(item.quantity)}
                        </li>
                      ))
                    ) : (
                      <li>No items available for this order.</li>
                    )}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">No orders available.</p>
      )}
    </div>
  );
};

export default App;
