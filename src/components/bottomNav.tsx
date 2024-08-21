import React, { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartIcon, FoodIcon, HomeIcon } from './icons';

interface NavItemProps {
  itemName: string;
  selected: boolean;
  onClick: (itemName: string) => void;
  children: React.ReactNode;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ itemName, selected, onClick, children, badge }) => {
  return (
    <div
      className={`w-26 h-9 my-auto p-3 px-1 flex justify-center items-center ${
        selected ? 'border-blue-500 border-b-2 text-blue-500' : 'text-gray-500'
      } drop-shadow-sm cursor-pointer transition-transform duration-100 relative`}
      onClick={() => onClick(itemName)}
    >
      {badge !== undefined && badge > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge > 99 ? '99+' : badge}
        </div>
      )}
      {children}
    </div>
  );
};

// Create a context for unread tickets
const UnreadTicketsContext = createContext<{
  unreadTickets: number;
  setUnreadTickets: React.Dispatch<React.SetStateAction<number>>;
  fetchUnreadTickets: () => Promise<void>;
}>({
  unreadTickets: 0,
  setUnreadTickets: () => {},
  fetchUnreadTickets: async () => {},
});

// Custom hook to use the unread tickets context
const useUnreadTickets = () => useContext(UnreadTicketsContext);

// Unread tickets provider component
export const UnreadTicketsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unreadTickets, setUnreadTickets] = useState(0);

  const fetchUnreadTickets = async () => {
    // Replace this with actual API call to fetch unread tickets
    const response = await fetch('/api/unread-tickets');
    const data = await response.json();
    setUnreadTickets(data.count);
  };

  useEffect(() => {
    fetchUnreadTickets();
    const interval = setInterval(fetchUnreadTickets, 60000); // Fetch every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <UnreadTicketsContext.Provider value={{ unreadTickets, setUnreadTickets, fetchUnreadTickets }}>
      {children}
    </UnreadTicketsContext.Provider>
  );
};

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState('Home');
  const { unreadTickets, setUnreadTickets, fetchUnreadTickets } = useUnreadTickets();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setSelectedItem('Home');
    else if (path === '/foods') setSelectedItem('Food');
    else if (path === '/order') {
      setSelectedItem('Order');
      setUnreadTickets(0);
      fetchUnreadTickets(); // Refresh unread tickets when navigating to Order page
    }
  }, [location, setUnreadTickets, fetchUnreadTickets]);

  const handleItemClick = (itemName: string) => {
    setSelectedItem(itemName);
    
    let path = '/';
    switch (itemName) {
      case 'Food':
        path = '/foods';
        break;
      case 'Order':
        path = '/order';
        setUnreadTickets(0);
        fetchUnreadTickets();
        break;
      case 'Home':
      default:
        path = '/';
        break;
    }
    navigate(path);
  };

  return (
    <div className="flex w-full justify-between px-5 items-center backdrop-blur-sm bg-background/90 fixed bottom-0 left-0 h-11 z-0">
      <NavItem
        itemName="Home"
        selected={selectedItem === 'Home'}
        onClick={handleItemClick}
      >
        <HomeIcon />
        <span className="ml-1 font-OpenSans">Home</span>
      </NavItem>
      <NavItem
        itemName="Food"
        selected={selectedItem === 'Food'}
        onClick={handleItemClick}
      >
        <FoodIcon />
        <span className="ml-1 font-OpenSans">Foods</span>
      </NavItem>
      <NavItem
        itemName="Order"
        selected={selectedItem === 'Order'}
        onClick={handleItemClick}
        badge={unreadTickets}
      >
        <CartIcon />
        <span className="ml-1 font-OpenSans">Orders</span>
      </NavItem>
    </div>
  );
}