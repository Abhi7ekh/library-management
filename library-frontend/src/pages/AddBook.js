import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000"; // later move to .env

function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAddBook = async () => {
    if (!title || !author || quantity <= 0) {
      alert("Please fill all fields correctly");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API}/add-book`, {
        title,
        author,
        quantity: Number(quantity),
      });

      alert(response.data.message);

      setTitle("");
      setAuthor("");
      setQuantity(0);
    } catch (error) {
      console.error(error);
      alert("Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Add New Book
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleAddBook}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Book"}
        </button>
      </div>

    </div>
  </div>
);
}

export default AddBook;