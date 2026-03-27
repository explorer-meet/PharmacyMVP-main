import React, { useState } from 'react';
import { CreditCard, Wallet, Truck, QrCode } from 'lucide-react';
import { PaymentOption } from './PaymentOption';
import { paymentMethods } from './PaymentMethods';
import axios from 'axios';

export function PaymentModal({ isOpen, onClose }) {
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState('');
    const ethereum = window.ethereum;

    if (!isOpen) return null;

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                alert('Please install MetaMask to make payments!');
                return false;
            }

            setLoading(true);
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            setAccount(accounts[0]);
            setLoading(false);
            return true;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            setLoading(false);
            return false;
        }
    };


    const handleMetaMaskWallet = async () => {
        try {
            // First connect the wallet
            const isConnected = await connectWallet();
            if (!isConnected) return;

            // Calculate total amount in ETH (you'll need to implement your own conversion rate)
            const totalAmount = cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            // Convert INR to ETH (using a hypothetical conversion rate - you should get this from an API)
            const ETH_TO_INR_RATE = 200000; // Example rate: 1 ETH = 200,000 INR
            const amountInEth = totalAmount / ETH_TO_INR_RATE;

            // Create provider and get signer
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // Replace with your merchant wallet address
            const merchantAddress = "0x52c7d0701Fa7460552085E406CD33042EaB1eC40";

            // Create the transaction
            const tx = {
                from: account,
                to: merchantAddress,
                value: parseEther(amountInEth.toFixed(18)),
                gasLimit: 21000n
            };

            setLoading(true);

            // Send transaction
            const transaction = await signer.sendTransaction(tx);

            // Wait for transaction confirmation
            await transaction.wait();

            // After successful payment, update the backend
            const paymentData = {
                transactionHash: transaction.hash,
                amount: totalAmount,
                userId: userData._id,
                items: cartItems
            };

            await axios.post(`${baseURL}/payment-success`, paymentData);

            // Clear cart and close modal
            setCartItems([]);
            setIsModalOpen(false);
            alert('Payment successful!');
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed! Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        // Handle payment logic here
        if (selectedMethod === 'metamask') {
            await handleMetaMaskWallet();
        }
        else {
            console.log("no not paid");
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Payment Options</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    {paymentMethods.map((method) => (
                        <PaymentOption
                            key={method.id}
                            icon={method.icon}
                            title={method.title}
                            description={method.description}
                            selected={selectedMethod === method.id}
                            onClick={() => setSelectedMethod(method.id)}
                        />
                    ))}
                </div>

                <button
                    onClick={handlePayment}
                    className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Pay Now
                </button>
            </div>
        </div>
    );
}