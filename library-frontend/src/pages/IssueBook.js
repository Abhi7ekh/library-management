import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function IssueBook() {
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleIssue = async () => {
    if (!userId || !bookId) {
      alert("Please enter both User ID and Book ID");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API}/issue-book`, {
        user_id: Number(userId),
        book_id: Number(bookId),
      });

      alert(response.data.message);
      setUserId("");
      setBookId("");
    } catch (error) {
      alert(error.response?.data?.message || "Error issuing book");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Issue Book
      </h2>

      <div className="space-y-4">
        <input
          type="number"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="number"
          placeholder="Book ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={handleIssue}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Issuing..." : "Issue Book"}
        </button>
      </div>

    </div>
  </div>
);
}

export default IssueBook;