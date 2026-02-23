const db = require("./config/db");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(query, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            message: "Login successful",
            user: results[0]
        });
    });
});


app.post("/add-book", (req, res) => {
    const { title, author, quantity } = req.body;

    const query = "INSERT INTO books (title, author, quantity) VALUES (?, ?, ?)";

    db.query(query, [title, author, quantity], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error adding book" });
        }

        res.json({
            message: "Book added successfully",
            bookId: result.insertId
        });
    });
});

app.post("/issue-book", (req, res) => {
    const { user_id, book_id } = req.body;

    // Step 1: Check book availability
    db.query("SELECT quantity FROM books WHERE id = ?", [book_id], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (results[0].quantity <= 0) {
            return res.status(400).json({ message: "Book not available" });
        }

        // Step 2: Reduce quantity
        db.query("UPDATE books SET quantity = quantity - 1 WHERE id = ?", [book_id]);

        // Step 3: Insert transaction
        const issueDate = new Date();

        db.query(
            "INSERT INTO transactions (user_id, book_id, issue_date) VALUES (?, ?, ?)",
            [user_id, book_id, issueDate],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Error issuing book" });

                res.json({ message: "Book issued successfully" });
            }
        );
    });
});

app.post("/return-book", (req, res) => {
    const { transaction_id } = req.body;

    // Step 1: Get transaction details
    db.query("SELECT * FROM transactions WHERE id = ?", [transaction_id], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const transaction = results[0];

        if (transaction.status === "returned") {
            return res.status(400).json({ message: "Book already returned" });
        }

        const issueDate = new Date(transaction.issue_date);
        const returnDate = new Date();
        const diffTime = returnDate - issueDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let fine = 0;
        if (diffDays > 7) {
            fine = (diffDays - 7) * 10;
        }

        // Step 2: Update transaction
        db.query(
            "UPDATE transactions SET status = 'returned', return_date = ?, fine = ? WHERE id = ?",
            [returnDate, fine, transaction_id]
        );

        // Step 3: Increase book quantity
        db.query(
            "UPDATE books SET quantity = quantity + 1 WHERE id = ?",
            [transaction.book_id]
        );

        res.json({
            message: "Book returned successfully",
            fine: fine
        });
    });
});


app.get("/books", (req, res) => {
    const query = "SELECT * FROM books";

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
});

app.get("/active-issues", (req, res) => {
    const query = `
        SELECT t.id, u.name AS user_name, b.title AS book_title, t.issue_date
        FROM transactions t
        JOIN users u ON t.user_id = u.id
        JOIN books b ON t.book_id = b.id
        WHERE t.status = 'issued'
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
});


app.get("/overdue", (req, res) => {
    const query = `
        SELECT t.id, u.name AS user_name, b.title AS book_title, t.issue_date
        FROM transactions t
        JOIN users u ON t.user_id = u.id
        JOIN books b ON t.book_id = b.id
        WHERE t.status = 'issued'
        AND DATEDIFF(CURDATE(), t.issue_date) > 7
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
});

app.get("/users", (req, res) => {
    const query = "SELECT id, name, email, role FROM users";

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
});

app.post("/pay-fine", (req, res) => {
    const { transaction_id } = req.body;

    const query = "UPDATE transactions SET fine = 0 WHERE id = ?";

    db.query(query, [transaction_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        res.json({ message: "Fine paid successfully" });
    });
});


app.get("/transactions", (req, res) => {
    const query = `
        SELECT t.id, u.name AS user_name, b.title AS book_title,
               t.issue_date, t.return_date, t.status, t.fine
        FROM transactions t
        JOIN users u ON t.user_id = u.id
        JOIN books b ON t.book_id = b.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
});



app.get("/", (req, res) => {
    res.send("Library Management System API Running...");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});