import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Bell, Home, User, Users, LogOut } from "lucide-react";

const Navbar = () => {
  const { data: authUser, isLoading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: notifications, isLoading: isNotificationsLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axiosInstance.get("/notifications"),
    enabled: !!authUser,
    staleTime: 30000, // Consider data fresh for 30 seconds
    cacheTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  const { data: connectionRequests, isLoading: isConnectionsLoading } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: () => axiosInstance.get("/connections/requests"),
    enabled: !!authUser,
    staleTime: 30000,
    cacheTime: 5 * 60 * 1000,
  });

  const { mutate: logout, isLoading: isLoggingOut } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/login");
    },
  });

  const unreadNotificationsCount = notifications?.data?.filter(
    (notif) => !notif.read
  ).length || 0;
  const unreadConnectionRequestsCount = connectionRequests?.data?.length || 0;

  if (isAuthLoading) {
    return (
      <nav className="bg-secondary shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-secondary shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img
                src="/small-logo.png"
                alt="LinkedIn"
                className="h-8 rounded"
              />
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            {authUser ? (
              <>
                <Link
                  to="/"
                  className="text-neutral flex flex-col items-center hover:text-primary transition-colors"
                >
                  <Home size={20} />
                  <span className="text-xs hidden md:block">Home</span>
                </Link>
                <Link
                  to="/network"
                  className="text-neutral flex flex-col items-center relative hover:text-primary transition-colors"
                >
                  <Users size={20} />
                  <span className="text-xs hidden md:block">Network</span>
                  {!isConnectionsLoading && unreadConnectionRequestsCount > 0 && (
                    <span className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs rounded-full size-3 md:size-4 flex items-center justify-center">
                      {unreadConnectionRequestsCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/notifications"
                  className="text-neutral flex flex-col items-center relative hover:text-primary transition-colors"
                >
                  <Bell size={20} />
                  <span className="text-xs hidden md:block">Notifications</span>
                  {!isNotificationsLoading && unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs rounded-full size-3 md:size-4 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Link>
                <Link
                  to={`/profile/${authUser.username}`}
                  className="text-neutral flex flex-col items-center hover:text-primary transition-colors"
                >
                  <User size={20} />
                  <span className="text-xs hidden md:block">Me</span>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                  disabled={isLoggingOut}
                  className="flex items-center space-x-1 text-sm text-neutral hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut size={20} />
                  <span className="hidden md:inline">
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="btn btn-ghost hover:bg-primary/10 transition-colors"
                >
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  className="btn btn-primary hover:bg-primary/90 transition-colors"
                >
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
