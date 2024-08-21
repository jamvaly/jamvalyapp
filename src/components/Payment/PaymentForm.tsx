import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@nextui-org/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { ref, push, set } from 'firebase/database';
import { db, auth } from '../../config/firebaseConfig';
import { Input } from '@nextui-org/input';
import { toast, Toaster } from 'sonner';

const generateTicketId = () => `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

interface Room {
  title: string;
  price: string;
  // Add other properties as needed
}

interface PaymentFormProps {
  room: Room;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ room }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ticketInfo, setTicketInfo] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const saveUserInfo = async (userId: string) => {
    const userInfoRef = ref(db, `users/${userId}/userInfo`);
    await set(userInfoRef, { name, phone });
    console.log('User info saved successfully');
  };

  const saveTicketInfo = async (userId: string, transaction: any) => {
    const ticketId = generateTicketId();
    const ticketsRef = ref(db, `users/${userId}/tickets`);
    const newTicketRef = push(ticketsRef);
    
    let amount = 0;
    if (typeof transaction.amount === 'number') {
      amount = transaction.amount / 100; // Convert kobo to Naira
    } else if (typeof transaction.amount === 'string') {
      amount = parseFloat(transaction.amount) / 100;
    }

    if (isNaN(amount)) {
      console.error('Invalid amount:', transaction.amount);
      amount = 0;
    }

    const ticketInfo = {
      ticketId,
      name,
      phone,
      email: auth.currentUser?.email,
      amount: amount,
      currency: 'NGN',
      transactionId: transaction.reference,
      createdAt: new Date().toISOString(),
      roomTitle: room.title,
      roomPrice: room.price,
    };

    await set(newTicketRef, ticketInfo);
    console.log('Ticket saved successfully:', ticketId);
    return ticketInfo;
  };

  const handleSuccessfulPayment = async (transaction: any) => {
    console.log('Entering handleSuccessfulPayment', transaction);
    const user = auth.currentUser;
    if (!user) {
      console.error('User not found');
      toast.error('Error: User not found. Please ensure you are logged in.');
      return;
    }

    try {
      await saveUserInfo(user.uid);
      const newTicketInfo = await saveTicketInfo(user.uid, transaction);
      setTicketInfo(newTicketInfo);
      toast.success('Payment successful! Your ticket is ready.');
      onOpen(); // Open the modal
    } catch (error) {
      console.error('Error saving user info or ticket to Firebase:', error);
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(`Payment successful, but there was an error saving your information: ${errorMessage}. Please contact support.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error('Please enter both name and phone number.');
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      toast.error('You need to be logged in to make a payment.');
      return;
    }

    setIsLoading(true);

    const amount = parseFloat(room.price.replace(',', '')) * 100; // Convert to kobo

    const paystack = (window as any).PaystackPop;
    const handler = paystack.setup({
      key: 'pk_test_1f2fdd28f004407cafdf618d910ebdef76a2629a', // Replace with your Paystack public key
      email: auth.currentUser?.email || 'user@example.com',
      amount: amount,
      currency: 'NGN',
      firstname: name.split(' ')[0],
      lastname: name.split(' ').slice(1).join(' '),
      phone: phone,
      ref: `REF-${Date.now()}`,
      onClose: () => {
        console.log('Transaction was closed');
        setIsLoading(false);
        toast.info('Transaction was closed');
      },
      callback: (response: any) => {
        console.log('Payment successful, transaction details:', response);
        handleSuccessfulPayment(response);
      }
    });

    handler.openIframe();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Ticket information copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast.error('Failed to copy ticket information. Please try again.');
    });
  };

  return (
    <>
      <Toaster position="top-center" richColors closeButton />
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-bold">{room.title}</h2>
        <p className="text-lg">Price: ₦{room.price}</p>
        <Input
          ref={nameRef}
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant='bordered'
        />
        <Input
          ref={phoneRef}
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          variant='bordered'
        />
        <Button onClick={handlePayment} disabled={isLoading} color='primary'>
          {isLoading ? 'Processing...' : `Pay ₦${room.price}`}
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Your Ticket</ModalHeader>
          <ModalBody>
            {ticketInfo && (
              <div>
                <p>Ticket ID: {ticketInfo.ticketId}</p>
                <p>Name: {ticketInfo.name}</p>
                <p>Phone: {ticketInfo.phone}</p>
                <p>Room: {ticketInfo.roomTitle}</p>
                <p>Price: ₦{ticketInfo.roomPrice}</p>
                <p>Transaction ID: {ticketInfo.transactionId}</p>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-4">
              You can always find your ticket on the Order page if you need it later.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={() => copyToClipboard(JSON.stringify(ticketInfo, null, 2))}>
              Copy Ticket Info
            </Button>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PaymentForm;