import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { baseURL } from '../main';
import axios from 'axios';

function Tracking() {
  // Retrieve the id from the URL parameters
  const { id } = useParams();
  const [userdata, setUserData] = useState([]);
  const [status, useStatus] = useState('');

  // Example tracking data (replace this with API data based on the id)
  const [trackingStatus, setTrackingStatus] = useState({
    orderNumber: id || "ORD123456789",
    estimatedDelivery: "January 15, 2025",
    currentStatus: "",
    statuses: [
      { id: 1, status: "Booked", completed: false, time: "Pending", text: "Order Placed" },
      { id: 2, status: "shipped", completed: false, time: "Pending", text: "Order Shipped" },
      { id: 3, status: "in-transit", completed: false, time: "Pending", text: "In Transit" },
      { id: 4, status: "out-delivery", completed: false, time: "Pending", text: "Out for Delivery" },
      { id: 5, status: "delivered", completed: false, time: "Pending", text: "Delivered" }
    ]
  });
  const statusOrder = ['Booked', 'shipped', 'in-transit', 'out-delivery', 'delivered'];

  
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
        console.log(fetchedData);
        const matchedId = fetchedData.order.find(order => order.orderId === id);

        if (matchedId) {
          const currentStatus = matchedId.status;
          const updatedStatuses = trackingStatus.statuses.map((item) => ({
            ...item,
            completed: statusOrder.indexOf(item.status) <= statusOrder.indexOf(currentStatus),
            time: statusOrder.indexOf(item.status) <= statusOrder.indexOf(currentStatus)
              ? new Date().toLocaleString()
              : "TBD"
          }));
        
          setTrackingStatus(prev => ({
            ...prev,
            currentStatus: currentStatus,
            statuses: updatedStatuses
          }));
        }        
        // Extract orders from userdata
        console.log(matchedId.status);
        localStorage.setItem('userData', JSON.stringify(fetchedData));
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
  
    useEffect(() => {
      fetchDataFromApi();
    }, []);

  return (
    <div className="mt-[12vh] min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* Header */}
          <div className="border-b pb-6">
            <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
            <p className="mt-2 text-sm text-gray-600">Order Number: {trackingStatus.orderNumber}</p>
          </div>

          {/* Current Status */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Package className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <h2 className="text-sm font-medium text-blue-900">Current Status</h2>
                <p className="mt-1 text-sm text-blue-700">{trackingStatus.location}</p>
              </div>
            </div>
            {/* <p className="mt-2 text-sm text-blue-700">
              Estimated Delivery: {trackingStatus.estimatedDelivery}
            </p> */}
          </div>

          {/* Timeline */}
          <div className="mt-8">
            <div className="flow-root">
              <ul className="-mb-8">
                {trackingStatus.statuses.map((status, index) => (
                  <li key={status.id}>
                    <div className="relative pb-8">
                      {index !== trackingStatus.statuses.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                            ${status.completed ? 'bg-green-500' : 'bg-gray-300'}`}>
                            {status.status === 'Booked' && <Clock className="h-5 w-5 text-white" />}
                            {status.status === 'shipped' && <Package className="h-5 w-5 text-white" />}
                            {status.status === 'in-transit' && <Truck className="h-5 w-5 text-white" />}
                            {status.status === 'out-delivery' && <MapPin className="h-5 w-5 text-white" />}
                            {status.status === 'delivered' && <CheckCircle className="h-5 w-5 text-white" />}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5">
                          <p className="text-sm font-medium text-gray-900">{status.text}</p>
                          <p className="mt-1 text-sm text-gray-500">{status.time}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900">Shipping Updates</h3>
            <p className="mt-2 text-sm text-gray-600">
              You'll receive email updates about your package's status. 
              For additional assistance, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tracking;
