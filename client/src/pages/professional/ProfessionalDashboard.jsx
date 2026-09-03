import useAuth from "../../hooks/useAuth";

const ProfessionalDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold">
        Professional Dashboard
      </h1>

      <p className="mt-2">
        Welcome, {user?.name}
      </p>

      <button
        onClick={logout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfessionalDashboard;
