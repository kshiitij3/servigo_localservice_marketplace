const MessageBubble = ({
  message,
  isOwn,
}) => {
  if (message.type === "system") {
    return (
      <div className="flex justify-center my-3">
        <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
          {message.content}
        </span>
      </div>
    );
  }

  if (message.type === "quote_update") {
    return (
      <div className="flex justify-center my-4">
        <div className="w-full max-w-sm border border-teal-200 bg-gradient-to-b from-teal-50/80 to-white rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between gap-2 border-b border-teal-100 pb-2 mb-3">
            <span className="text-[11px] font-bold text-[#1a7a6e] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1a7a6e]" />
              Quote Updated
            </span>
            <span className="text-[11px] text-gray-400">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 py-1">
            {message.quoteUpdate?.previousAmount !== undefined && (
              <span className="text-base font-semibold text-gray-400 line-through">
                ₹{Number(message.quoteUpdate.previousAmount).toLocaleString("en-IN")}
              </span>
            )}

            <span className="text-gray-400 font-bold text-lg">→</span>

            <span className="text-2xl font-black text-[#1a7a6e]">
              ₹{Number(message.quoteUpdate?.newAmount ?? 0).toLocaleString("en-IN")}
            </span>
          </div>

          {message.content && (
            <p className="text-xs text-gray-600 mt-2.5 bg-teal-50/50 rounded-xl p-2.5 border border-teal-100/70 text-center font-medium">
              {message.content}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex mb-3 ${
        isOwn
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-2xs ${
          isOwn
            ? "bg-[#1a7a6e] text-white rounded-br-xs"
            : "bg-white text-gray-900 rounded-bl-xs border border-gray-100"
        }`}
      >
        {message.type === "image" &&
          message.media?.url && (
            <img
              src={message.media.url}
              alt="Shared"
              className="max-w-full rounded-xl mb-2 object-cover"
            />
          )}

        {message.content && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}

        <div
          className={`flex justify-end items-center gap-1 mt-1 ${
            isOwn
              ? "text-teal-100"
              : "text-gray-400"
          }`}
        >
          <span className="text-[10px]">
            {new Date(
              message.createdAt
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isOwn && (
            <span className="text-[10px] font-mono">
              {message.isRead ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
