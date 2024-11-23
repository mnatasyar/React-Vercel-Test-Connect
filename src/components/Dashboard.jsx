import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { token } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await fetch(
          "https://capstone-project-442014.et.r.appspot.com/protected",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch data");
        setMessage(data.message);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProtectedData();
  }, [token]);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {message}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
