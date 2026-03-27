import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { baseURL } from '../main';
import toast from 'react-hot-toast';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableslots, setSlotsAvailable] = useState([]);
  const [userData, setUserData] = useState([]);
  const [message, setMessage] = useState('');

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Automatically set today's date as selected
  useEffect(() => {
    fetchDataFromApi();
    setSelectedDate(today);
    fetchAvailableSlots(id); // Fetch available slots for today
  }, [id]);

  // Fetching data from the backend
  const fetchAvailableSlots = async (regno) => {
    try {
      const response = await axios.post(`${baseURL}/fetchslots`, { regno });
      if (response.data.success) {
        setSlotsAvailable(response.data.available);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching available slots:", error.message);
    }
  };

  // Handling confirmation page
  const handleConfirm = async (e) => {
    console.log(message);
    e.preventDefault();
    try {
      const payload = {
        regNo: id,
        name: userData?.name,
        slot: selectedSlot,
      };
      const response = await axios.post(`${baseURL}/confirmslots`, payload);

      if (response.data.success) {
        toast.success('Slots confirmed for today!');
        if (selectedDate && selectedSlot) {
          navigate(`/confirm/${id}`, {
            state: { date: selectedDate, time: selectedSlot },
          });
        }
      } else {
        toast.error('Error confirming slots for today!');
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error confirming slots:", error.message);
    }
  };

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
      console.error("Error fetching data:", error.message);
    }
  };

  // function loadScript(src) {
  //     return new Promise((resolve) => {
  //       const script = document.createElement("script");
  //       script.src = src;
  //       script.onload = () => {
  //         resolve(true);
  //       };
  //       script.onerror = () => {
  //         resolve(false);
  //       };
  //       document.body.appendChild(script);
  //     });
  //   }

  // const handlePayment = async (e) => {
  //   e.preventDefault();

  //   // Ensure the Razorpay script loads
  //   const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  //   if (!res) {
  //     alert("Razorpay SDK failed to load. Are you online?");
  //     return;
  //   }

  //   try {
  //     // Create an order in your backend
  //     const { data } = await axios.post(
  //       "https://newmodel-backend.onrender.com/api/PlusCare/Home/orderCreate",
  //       { amount: fee * 100 }
  //     );

  //     // Options for Razorpay payment
  //     const options = {
  //       key: "rzp_test_uYrPqO3bGviMYh", // Use Razorpay's test key
  //       amount: data.amount,
  //       currency: data.currency,
  //       name: "MedVision",
  //       description: "Consultation fee",
  //       order_id: data.id,
  //       handler: async (response) => {
  //         try {
  //           // Verify payment on your backend
  //           const verifyUrl =
  //             "https://newmodel-backend.onrender.com/api/PlusCare/Home/payment/paymentverify";
  //           const { data: verificationData } = await axios.post(verifyUrl, {
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_signature: response.razorpay_signature,
  //           });
  //           console.log("Payment Verified:", verificationData);

  //           // Redirect or show success
  //           alert("Payment Successful!");
  //           window.open("https://www.videosdk.live/prebuilt/demo");
  //         } catch (error) {
  //           console.error("Payment Verification Failed:", error);
  //         }
  //       },
  //       prefill: {
  //         name: "John Doe",
  //         email: "john.doe@example.com",
  //         contact: "9876543210",
  //       },
  //       theme: {
  //         color: "#3399cc",
  //       },
  //     };

  //     const rzp1 = new window.Razorpay(options);
  //     rzp1.open();

  //     // Prevent default form submission
  //     e.preventDefault();
  //   } catch (error) {
  //     console.error("Error in payment process:", error);
  //   }
  // };



  // Time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  ];

  return (
    <div className="mt-[10vh] min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Search
        </button>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Appointment Time</h2>

          {/* Date Selection */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Select Date</h3>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const formattedDate = date.toISOString().split('T')[0];
                const isToday = formattedDate === today;
                const isSelected = formattedDate === selectedDate;

                return (
                  <button
                    key={formattedDate}
                    onClick={() => isToday && setSelectedDate(formattedDate)}
                    className={`p-3 rounded-lg text-center transition-all duration-200 ${isToday
                      ? isSelected
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-blue-50 border border-gray-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    disabled={!isToday}
                  >
                    <div className="text-sm font-medium">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-lg font-semibold">{date.getDate()}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Select Time</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {timeSlots.map((time) => {
                  const isSelected = time === selectedSlot;
                  const isAvailable = availableslots.includes(time);

                  return (
                    <button
                      key={time}
                      onClick={() => isAvailable && setSelectedSlot(time)}
                      className={`p-3 rounded-lg text-center transition-all duration-200 ${isSelected
                        ? 'bg-green-600 text-white'
                        : isAvailable
                          ? 'bg-green-50 border border-green-500 hover:bg-green-100'
                          : 'border border-red-500 text-red-500 cursor-not-allowed'
                        }`}
                      disabled={!isAvailable}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <input
            type="text"
            placeholder="Enter your message to the doctor about your concern"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedSlot}
            className={`mt-4 w-full py-3 rounded-lg font-medium transition-all duration-200 ${selectedDate && selectedSlot
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}