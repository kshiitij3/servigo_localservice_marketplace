const TypingIndicator = ({
  visible,
  userName,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="px-4 py-2 bg-gray-50/80 border-t border-gray-100">
      <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-gray-500">
        <span className="flex gap-1 items-center">
          <span className="w-1.5 h-1.5 bg-[#1a7a6e] rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 bg-[#1a7a6e] rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 bg-[#1a7a6e] rounded-full animate-bounce" />
        </span>
        <span>{userName || "User"} is typing...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
