import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { getMyChats } from "../../services/chat.service";

import ConversationList from "../../components/chat/ConversationList";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";

const Conversations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchChats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyChats();
        const data = response?.data?.data || response?.data || [];
        if (mounted) {
          setChats(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch chats:", err);
        if (mounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load conversations"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchChats();
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  const isCustomer = user?.role === "customer";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isCustomer ? <CustomerNavbar /> : <ProfessionalNavbar />}

      <main className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto border-x border-gray-200 bg-white shadow-xs">
        <ConversationList
          chats={chats}
          currentUser={user}
          loading={loading}
          onSelect={(chat) => navigate(`/chat/${chat._id}`)}
        />

        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50/70 p-6">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-3xl bg-teal-100/80 text-[#1a7a6e] flex items-center justify-center mx-auto text-2xl shadow-xs">
              💬
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-5">
              Your Messages
            </h2>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Select a conversation to start chatting, negotiate quotes, and coordinate service details.
            </p>

            {error && (
              <p className="mt-4 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                {error}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Conversations;
