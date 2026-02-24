import { useEffect, useState } from "react";
import API from "../services/api";

function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await API.get("/books");
      setBooks(response.data);
    } catch (error) {
      alert("Error fetching books");
    } finally {
      setLoading(false);
    }
  };
  if (loading)
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-600 text-lg">Loading books...</p>
    </div>
  );

return (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-6xl mx-auto">

      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        All Books
      </h2>

      {books.length === 0 ? (
        <p className="text-gray-500">No books available</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Author</th>
                <th className="p-3">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{book.id}</td>
                  <td className="p-3 font-medium">{book.title}</td>
                  <td className="p-3">{book.author}</td>
                  <td
                    className={`p-3 font-semibold ${
                      book.quantity === 0
                        ? "text-red-600"
                        : book.quantity < 3
                        ? "text-orange-500"
                        : "text-green-600"
                    }`}
                  >
                    {book.quantity === 0
                      ? "Out of Stock"
                      : book.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  </div>
);
}

export default ViewBooks;