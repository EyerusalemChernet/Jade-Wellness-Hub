import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api.js";
import { FaBell, FaTimes, FaCheck, FaExclamationTriangle, FaInfo, FaCalendarAlt, FaUserMd, FaPills } from "react-icons/fa";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/notifications");
        return res.data;
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        return [];
      }
    },
    refetchInterval: 30000,
    retry: 1,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId) => {
      const res = await api.patch(`/api/notifications/${notificationId}/read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleMarkAsRead = (notificationId) => {
    markAsReadMutation.mutate(notificationId);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_appointment": return <FaCalendarAlt className="text-blue-700" />;
      case "appointment_accepted": return <FaCheck className="text-green-600" />;
      case "appointment_rejected": return <FaExclamationTriangle className="text-red-600" />;
      case "medicine": return <FaPills className="text-purple-600" />;
      case "blood_request": return <FaExclamationTriangle className="text-red-600" />;
      case "system_alert": return <FaInfo className="text-yellow-500" />;
      default: return <FaInfo className="text-gray-800" />;
    }
  };

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-700">
                Loading notifications...
              </div>
            ) : error ? (
              <div className="p-4 text-center text-gray-700">
                Failed to load notifications
              </div>
            ) : notifications && notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <div 
                    key={notif._id} 
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50' : ''}`}
                    onClick={() => !notif.read && handleMarkAsRead(notif._id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </p>
                        {!notif.read && (
                          <div className="mt-1">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FaBell className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-700">No notifications yet</p>
                <p className="text-sm text-gray-600 mt-1">
                  You'll see important updates here
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;