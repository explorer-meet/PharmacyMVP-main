import { CreditCard, Wallet, Truck, QrCode } from 'lucide-react';

export const paymentMethods = [
  {
    id: 'card',
    icon: <CreditCard className="w-6 h-6" />,
    title: 'Credit/Debit Card',
    description: 'Pay securely with your card'
  },
  {
    id: 'upi',
    icon: <QrCode className="w-6 h-6" />,
    title: 'UPI',
    description: 'Pay using UPI apps'
  },
  {
    id: 'cod',
    icon: <Truck className="w-6 h-6" />,
    title: 'Cash on Delivery',
    description: 'Pay when you receive'
  },
  {
    id: 'metamask',
    icon: <Wallet className="w-6 h-6" />,
    title: 'Metamask Wallet',
    description: 'Pay with cryptocurrency'
  }
];