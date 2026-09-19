import { useEffect, useRef, useState } from "react";
import { HiPaperAirplane } from "react-icons/hi2";

const MessageInput = ({
  onSend,
  onTypingStart,
  onTypingStop,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (!value.trim()) {
      onTypingStop?.();
      return;
    }

    onTypingStart?.();

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop?.();
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const content = message.trim();
    if (!content || disabled) {
      return;
    }

    onSend(content);
    setMessage("");

    clearTimeout(typingTimeoutRef.current);
    onTypingStop?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef.current);
      onTypingStop?.();
    };
  }, [onTypingStop]);

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white p-3 sm:p-4"
    >
      <div className="max-w-4xl mx-auto flex items-end gap-3">
        <textarea
          rows={1}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={
            disabled
              ? "Connecting to chat server..."
              : "Type a message to negotiate or discuss..."
          }
          className="flex-1 resize-none px-4 py-2.5 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a7a6e]/30 focus:border-[#1a7a6e] text-sm leading-6 disabled:bg-gray-100 transition"
        />

        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-semibold text-sm transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          <span>Send</span>
          <HiPaperAirplane className="w-4 h-4 -rotate-45" />
        </button>
      </div>

      <p className="max-w-4xl mx-auto mt-2 text-[11px] text-gray-400">
        Press <span className="font-semibold text-gray-500">Enter</span> to send · <span className="font-semibold text-gray-500">Shift + Enter</span> for new line
      </p>
    </form>
  );
};

export default MessageInput;
