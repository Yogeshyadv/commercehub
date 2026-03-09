import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    let newSocket;

    if (isAuthenticated && user) {
      // Connect to backend
      const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      newSocket = io(SOCKET_URL);

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        
        // Join user's personal room for direct notifications
        newSocket.emit('join_room', user._id);
        
        // Join tenant's room for business events (if user is part of tenant)
        if (user.tenant) {
            const tenantId = typeof user.tenant === 'object' ? user.tenant._id : user.tenant;
            newSocket.emit('join_room', tenantId);
        }
      });

      newSocket.on('new_order', (data) => {
        // Play notification sound
        // const audio = new Audio('/notification.mp3');
        // audio.play().catch(e => console.log('Audio play failed', e));

        toast((t) => (
          <div className="flex items-center gap-3" onClick={() => toast.dismiss(t.id)}>
             <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-xl">📦</div>
             <div>
               <p className="font-bold text-gray-900">New Order Received</p>
               <p className="text-sm text-gray-500">Order from {data.customer} for ₹{data.amount}</p>
             </div>
          </div>
        ), { duration: 5000, position: 'top-right' });
      });

      newSocket.on('notification', (data) => {
          if (data.type !== 'NEW_ORDER') { // Avoid duplicate for new order if handled separately
            toast.success(data.message, { icon: '🔔' });
          }
      });

      setSocket(newSocket);
    }

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
