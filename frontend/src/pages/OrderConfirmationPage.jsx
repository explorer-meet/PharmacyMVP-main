import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { baseURL } from '../main';
import axios from 'axios';

export function OrderConfirmationPage() {
  const [userdata, setUserData] = useState([]);

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
      localStorage.setItem('userData', JSON.stringify(fetchedData));
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);


  // if (!orderDetails) return null;

  return (
    <div className="mt-[10vh] min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Thank You for Your Order!
            </h1>
            <p className="text-gray-600">
              Your order has been successfully placed.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <Package className="w-5 h-5" />
              <span>Order #{userdata?.order?.[userdata.order.length - 1]?.orderId}</span>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>A confirmation email has been sent to:</p>
              <p className="font-medium">{userdata.email}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                We'll notify you when your order ships.
              </p>
              <Link
                to="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}