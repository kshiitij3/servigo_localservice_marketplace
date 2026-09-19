const ConversationItem = ({
  chat,
  currentUser,
  active = false,
  onClick,
}) => {
  const currentUserId = currentUser?._id || currentUser?.id;
  const isCustomer =
    (chat.customer?._id || chat.customer)?.toString() === currentUserId?.toString();

  const otherUser = isCustomer
    ? chat.professional
    : chat.customer;

  const lastMessage = chat.lastMessage;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 border-b border-gray-100 transition hover:bg-gray-50 cursor-pointer ${
        active ? "bg-teal-50/70 border-l-4 border-l-[#1a7a6e]" : "bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
          <span className="text-[#1a7a6e] font-semibold">
            {otherUser?.name?.charAt(0)?.toUpperCase() ||
              "U"}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {otherUser?.name || "User"}
            </h3>

            {chat.lastMessageAt && (
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(
                  chat.lastMessageAt
                ).toLocaleDateString()}
              </span>
            )}
          </div>

          <p className="text-xs text-[#1a7a6e] font-medium mt-1 truncate">
            {chat.workRequest?.title ||
              "Service request"}
          </p>

          <p className="text-sm text-gray-500 mt-1 truncate">
            {lastMessage?.content ||
              (lastMessage?.type === "quote_update"
                ? `Quote updated to ₹${lastMessage.quoteUpdate?.newAmount}`
                : "No messages yet")}
          </p>
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
