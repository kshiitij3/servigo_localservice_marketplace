import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({
  messages = [],
  currentUser,
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 bg-gray-50/60">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="h-full min-h-[300px] flex items-center justify-center text-center">
            <div className="p-8 bg-white border border-gray-200/70 rounded-2xl max-w-sm mx-auto shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center mx-auto text-xl mb-3">
                💬
              </div>
              <h3 className="font-bold text-gray-800 text-base">
                Start the conversation
              </h3>

              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Discuss the job specifications and negotiate the quote directly with the other party here.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const senderId =
              message.sender?._id ||
              message.sender;

            const currentUserId =
              currentUser?._id ||
              currentUser?.id;

            return (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={
                  senderId?.toString() ===
                  currentUserId?.toString()
                }
              />
            );
          })
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default MessageList;
