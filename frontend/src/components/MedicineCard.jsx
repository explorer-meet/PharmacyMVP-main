import React, { useState, useEffect } from 'react';
import { Pill, Package, ShoppingCart } from 'lucide-react';
import CartButton from './CartButton';
import axios from 'axios';
import { baseURL } from '../main';

const MedicineCard = ({ id, name, manufacturer, dosage, price, stock, type, onAddToCart }) => {

  const [showadded, setShowAdded] = useState(false);
  const [addcart, setAddCart] = useState(false);
  const [userData, setUserData] = useState([]);

  const handleaddtocart = async () => {
    try {
      const response = await axios.post(`${baseURL}/updateorderedmedicines`, {
        name,
        price,
        id: userData?._id,
      });
      console.log(response);
  
      if (response.status === 200) {
        console.log(`${name} added to cart with ${id} quantity price is ${price}`);
        setShowAdded(true);

        setTimeout(() => {
          setShowAdded(false);
        }, 1000);
  
        // Fetch updated userData
        const token = localStorage.getItem('medVisionToken');
        const updatedResponse = await axios.get(`${baseURL}/fetchdata`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const updatedUserData = updatedResponse.data.userData;
  
        // Update state to trigger re-render
        setUserData(updatedUserData);
  
        // Update localStorage for persistence
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
      }
    } catch (error) {
      console.error("Error adding to cart:", error.message);
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


  useEffect(() => {
    fetchDataFromApi();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow w-full">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Pill className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
        </div>
        <p className="text-sm text-gray-600">{manufacturer}</p>
        <div className="flex items-center gap-2 mt-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{dosage} • {type}</span>
        </div> 
        <div className="flex items-center justify-between mt-4">
          <div className="text-lg font-bold text-blue-600">Rs {price}/-</div>
          <div className={`text-sm ${stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {stock > 0 ? `In Stock (${stock} left)` : 'Out of Stock'}
          </div>
        </div>
        <div>
          <button
            onClick={userData?._id ? handleaddtocart : undefined}
            disabled={!userData?._id || stock === 0}
            className={`mt-3 w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium
      transform transition-all duration-200
      ${userData?._id && stock > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 hover:scale-[1.02]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            {showadded ? (
              <div className="flex items-center gap-2 text-green-500">
                <span>Added to Cart!</span>
              </div>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {userData?._id ? "Add to Cart" : "Log in to Add to Cart"}
              </>
            )}
          </button>

          {userData?._id && addcart && (
            <CartButton id={id} name={name} price={price} />
          )}
        </div>

        {addcart && <CartButton id={id} name={name} price={price} />}
      </div>
    </div>
  );
};

export default MedicineCard;