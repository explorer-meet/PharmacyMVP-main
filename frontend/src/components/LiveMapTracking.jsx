import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

//Predefined static center as of now 
const center = {
  lat: 22.67,  
  lng: 88.37,
};

const LiveMap = ({ deliveryLocation }) => {
  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap mapContainerStyle={containerStyle} center={deliveryLocation || center} zoom={14}>
        
        {/* Delivery Boy Marker */}
        {deliveryLocation && <Marker position={deliveryLocation} />}

      </GoogleMap>
    </LoadScript>
  );
};

export default LiveMap;