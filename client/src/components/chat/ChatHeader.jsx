import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";

const ChatHeader = ({
  chat,
  currentUser,
  isConnected,
}) => {
  const navigate = useNavigate();
  const currentUserId = currentUser?._id || currentUser?.id;

  const isCustomer =
    (chat?.customer?._id || chat?.customer)?.toString() ===
    currentUserId?.toString();

  const otherUser = isCustomer
    ? chat?.professional
    : chat?.customer;

  return (
    <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => navigate("/chat")}
          className="md:hidden p-1.5 -ml-1 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition"
          aria-label="Back to conversations"
        >
          <HiArrowLeft className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
          <span className="font-semibold text-[#1a7a6e]">
            {otherUser?.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </span>
        </div>

        <div className="min-w-0">
          <h2 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
            {otherUser?.name || "User"}
          </h2>

          <p className="text-xs text-gray-500 truncate">
            {chat?.workRequest?.title ||
              "Service request"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs whitespace-nowrap">
        <span
          className={`w-2 h-2 rounded-full ${
            isConnected
              ? "bg-emerald-500"
              : "bg-rose-500"
          }`}
        />

        <span className="text-gray-500 hidden sm:inline">
          {isConnected
            ? "Connected"
            : "Disconnected"}
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
