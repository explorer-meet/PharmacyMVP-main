import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// Components
import Navbar from '../components/Navbar';

const Layout = () => {
    const location = useLocation();

    // Define the routes where Navbar should be shown
    const showNavbarRoutes = ['/dashboard', '/searchdoctor', '/onlinepharmacy', '/login', '/signup', '/admindashboard', '/kidneyprediction', '/disease', '/heart-disease', '/lungcancerprediction', '/addmedicine', '/updatemedicine','/admintracking', '/deletemedicine',];

    return (
        <div>
            {/* Render Navbar only if the current route is in showNavbarRoutes */}
            {!showNavbarRoutes.includes(location.pathname) && <Navbar />}
            <Outlet />
        </div>
    );
};

export default Layout;
