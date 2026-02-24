import { useEffect, useState } from "react";
import API from "../services/api";

function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [activeIssues, setActiveIssues] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const [transactionsRes, activeRes, overdueRes] =
        await Promise.all([
          API.get("/transactions"),
          API.get("/active-issues"),
          API.get("/overdue"),
        ]);

      setTransactions(transactionsRes.data);
      setActiveIssues(activeRes.data);
      setOverdueBooks(overdueRes.data);
    } catch (err) {
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading reports...</div>;
  }

  if (error) {
    return <div style={{ padding: "40px", color: "red" }}>{error}</div>;
  }

  return (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-7xl mx-auto">

      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Reports Dashboard
      </h2>

      {/* ================= All Transactions ================= */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">All Transactions</h3>

        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Book</th>
                  <th className="p-3">Issue Date</th>
                  <th className="p-3">Return Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Fine</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{t.id}</td>
                    <td className="p-3">{t.user_name}</td>
                    <td className="p-3">{t.book_title}</td>
                    <td className="p-3">{formatDate(t.issue_date)}</td>
                    <td className="p-3">{formatDate(t.return_date)}</td>
                    <td
                      className={`p-3 font-semibold ${
                        t.status === "returned"
                          ? "text-green-600"
                          : "text-orange-500"
                      }`}
                    >
                      {t.status}
                    </td>
                    <td
                      className={`p-3 font-semibold ${
                        t.fine > 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      ₹{t.fine}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= Active Issues ================= */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Active Issues</h3>

        {activeIssues.length === 0 ? (
          <p className="text-gray-500">No active issues.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Book</th>
                  <th className="p-3">Issue Date</th>
                </tr>
              </thead>
              <tbody>
                {activeIssues.map((a) => (
                  <tr key={a.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{a.id}</td>
                    <td className="p-3">{a.user_name}</td>
                    <td className="p-3">{a.book_title}</td>
                    <td className="p-3">{formatDate(a.issue_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= Overdue Books ================= */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-red-600">
          Overdue Books (More than 7 Days)
        </h3>

        {overdueBooks.length === 0 ? (
          <p className="text-gray-500">No overdue books.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Book</th>
                  <th className="p-3">Issue Date</th>
                </tr>
              </thead>
              <tbody>
                {overdueBooks.map((o) => (
                  <tr key={o.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{o.id}</td>
                    <td className="p-3">{o.user_name}</td>
                    <td className="p-3">{o.book_title}</td>
                    <td className="p-3 text-red-600 font-semibold">
                      {formatDate(o.issue_date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  </div>
);
}

export default Reports;