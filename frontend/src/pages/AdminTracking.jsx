import React, {useState} from 'react';
import { Package, Truck, Box, Home, CheckCircle, Search, Filter } from 'lucide-react';

// Mock data for demonstration
const initialOrders = [
    {
        id: '#ORD-001',
        customer: 'John Doe',
        date: '2024-03-15',
        status: 'booking',
        address: '123 Main St, New York, NY 10001',
        items: '2x iPhone 15 Pro',
    },
    {
        id: '#ORD-002',
        customer: 'Jane Smith',
        date: '2024-03-14',
        status: 'in-transit',
        address: '456 Park Ave, Boston, MA 02108',
        items: '1x MacBook Air',
    },
    {
        id: '#ORD-003',
        customer: 'Mike Johnson',
        date: '2024-03-13',
        status: 'delivered',
        address: '789 Oak St, Chicago, IL 60601',
        items: '3x AirPods Pro',
    },
];

const statusOptions = [
    { value: 'booking', label: 'Booking', icon: Package },
    { value: 'shipped', label: 'Shipped', icon: Box },
    { value: 'in-transit', label: 'In Transit', icon: Truck },
    { value: 'out-delivery', label: 'Out for Delivery', icon: Home },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle },
];

// const [userdata, setUserData] = useState([]);

// const fetchDataFromApi = async () => {
//     try {
//         const token = localStorage.getItem('medVisionToken');
//         const response = await axios.get(`${baseURL}/fetchdata`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         const fetchedData = response.data.userData;
//         setUserData(fetchedData);

//         // Extract orders from userdata
//         const ordersArray = fetchedData.order || [];
//         setOrders(ordersArray);

//         localStorage.setItem('userData', JSON.stringify(fetchedData));
//     } catch (error) {
//         console.error('Error fetching data:', error.message);
//     }
// };

function AdminTracking() {
    const [orders, setOrders] = useState(initialOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleStatusUpdate = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        const colors = {
            'booking': 'bg-blue-100 text-blue-800',
            'shipped': 'bg-purple-100 text-purple-800',
            'in-transit': 'bg-yellow-100 text-yellow-800',
            'out-delivery': 'bg-orange-100 text-orange-800',
            'delivered': 'bg-green-100 text-green-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Order Tracking Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-600">Manage and update order statuses</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="text-gray-400 h-5 w-5" />
                            <select
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.address}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <select
                                                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                            >
                                                {statusOptions.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminTracking;