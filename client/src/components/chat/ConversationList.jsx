import { useMemo, useState } from "react";
import ConversationItem from "./ConversationItem";

const ConversationList = ({
  chats = [],
  currentUser,
  activeChatId,
  onSelect,
  loading,
}) => {
  const [search, setSearch] = useState("");
  const currentUserId = currentUser?._id || currentUser?.id;

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return chats;
    }

    return chats.filter((chat) => {
      const isCustomer =
        (chat.customer?._id || chat.customer)?.toString() === currentUserId?.toString();

      const otherUser = isCustomer
        ? chat.professional
        : chat.customer;

      return (
        otherUser?.name
          ?.toLowerCase()
          .includes(query) ||
        chat.workRequest?.title
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [chats, search, currentUserId]);

  return (
    <aside className="w-full md:w-96 border-r border-gray-200 bg-white flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          Messages
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Chat with customers and professionals
        </p>

        <input
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full mt-4 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a7a6e]/30 focus:border-[#1a7a6e] text-sm transition"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center text-sm text-gray-500">
            <div className="inline-block w-6 h-6 border-2 border-[#1a7a6e] border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading conversations...</p>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 text-sm">
              {search ? "No matching conversations found." : "No conversations yet."}
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <ConversationItem
              key={chat._id}
              chat={chat}
              currentUser={currentUser}
              active={
                chat._id === activeChatId
              }
              onClick={() =>
                onSelect(chat)
              }
            />
          ))
        )}
      </div>
    </aside>
  );
};

export default ConversationList;
