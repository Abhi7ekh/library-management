import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");

  useEffect(() => {
    if (!storedUser) {
      navigate("/");
    }
  }, [storedUser, navigate]);

  if (!storedUser) return null;

  const user = JSON.parse(storedUser);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

 return (
  <div className="min-h-screen bg-gray-100 p-10">
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
      
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Welcome, {user.name}
      </h2>

      <p className="text-gray-500 mb-6">
        Role: <span className="font-semibold capitalize">{user.role}</span>
      </p>

      <div className="grid gap-4">
        {user.role === "admin" && (
          <>
            <Link className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" to="/add-book">Add Book</Link>
            <Link className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" to="/view-books">View Books</Link>
            <Link className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" to="/reports">Reports</Link>
            <Link className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" to="/issue-book">Issue Book</Link>
            <Link className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" to="/return-book">Return Book</Link>
          </>
        )}

        {user.role === "user" && (
          <>
            <Link className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition" to="/view-books">View Books</Link>
            <Link className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition" to="/issue-book">Issue Book</Link>
            <Link className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition" to="/return-book">Return Book</Link>
          </>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  </div>
);
}

export default Dashboard;