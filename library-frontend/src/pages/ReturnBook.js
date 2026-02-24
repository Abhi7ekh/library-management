import { useState } from "react";
import API from "../services/api";

function ReturnBook() {
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReturn = async () => {
    if (!transactionId) {
      alert("Please enter transaction ID");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/return-book", {
        transaction_id: Number(transactionId),
      });

      alert(`Book returned successfully. Fine: ₹${response.data.fine}`);
      setTransactionId("");
    } catch (error) {
      alert(error.response?.data?.message || "Error returning book");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Return Book
      </h2>

      <div className="space-y-4">
        <input
          type="number"
          placeholder="Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <button
          onClick={handleReturn}
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Return Book"}
        </button>
      </div>

    </div>
  </div>
);
}

export default ReturnBook;