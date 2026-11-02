
import { useEffect, useRef, useState } from "react";
import {
    Bell,
    CheckCheck,
    Ticket,
    MessageSquare,
    UserCheck,
    X,
} from "lucide-react";

const NotificationDropdown = ({
    notifications = [],
    onMarkRead,
    onMarkAllRead,
    onNotificationClick,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case "ticket":
                return <Ticket size={17} />;

            case "message":
                return <MessageSquare size={17} />;

            case "assignment":
                return <UserCheck size={17} />;

            default:
                return <Bell size={17} />;
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            onMarkRead?.(notification._id);
        }

        onNotificationClick?.(notification);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification button */}
            <button
                type="button"
                onClick={() => setIsOpen((previous) => !previous)}
                className="relative rounded-full p-2 text-gray-600
        transition hover:bg-gray-100"
                aria-label="Notifications"
                aria-expanded={isOpen}
            >
                <Bell size={21} />

                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5
          items-center justify-center rounded-full bg-red-500
          px-1 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-12 z-50 w-[340px]
        max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl
        border border-gray-200 bg-white shadow-xl">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b p-4">
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                Notifications
                            </h3>
                            <p className="text-xs text-gray-500">
                                {unreadCount} unread notifications
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
                            aria-label="Close notifications"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Mark all read */}
                    {notifications.length > 0 && unreadCount > 0 && (
                        <div className="border-b px-4 py-2">
                            <button
                                type="button"
                                onClick={onMarkAllRead}
                                className="flex items-center gap-2 text-xs
                font-semibold text-blue-600 hover:text-blue-700"
                            >
                                <CheckCheck size={15} />
                                Mark all as read
                            </button>
                        </div>
                    )}

                    {/* Notification list */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-10 text-center">
                                <Bell className="mx-auto mb-2 text-gray-300" size={30} />
                                <p className="text-sm font-medium text-gray-700">
                                    No notifications
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    You're all caught up.
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <button
                                    type="button"
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`flex w-full gap-3 border-b p-4 text-left
                  transition hover:bg-gray-50
                  ${!notification.isRead ? "bg-blue-50/50" : ""}`}
                                >
                                    <div className="mt-1 rounded-full bg-gray-100 p-2 text-blue-600">
                                        {getIcon(notification.type)}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-800">
                                            {notification.title}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {notification.message}
                                        </p>

                                        <p className="mt-2 text-[11px] text-gray-400">
                                            {notification.time || ""}
                                        </p>
                                    </div>

                                    {!notification.isRead && (
                                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
