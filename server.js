const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./config/db");

const User = require("./models/User");
const Book = require("./models/Book");
const Transaction = require("./models/Transaction");

const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());

/* LOGIN */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Database error" });
  }
});


/* ADD BOOK */
app.post("/add-book", async (req, res) => {
  try {
    const { title, author, quantity } = req.body;

    const book = new Book({ title, author, quantity });
    await book.save();

    res.json({
      message: "Book added successfully",
      book
    });

  } catch (error) {
    res.status(500).json({ message: "Error adding book" });
  }
});


/* ISSUE BOOK */
app.post("/issue-book", async (req, res) => {
  try {
    const { user_id, book_id } = req.body;

    const book = await Book.findById(book_id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.quantity <= 0) {
      return res.status(400).json({ message: "Book not available" });
    }

    book.quantity -= 1;
    await book.save();

    const transaction = new Transaction({
      user_id,
      book_id,
      issue_date: new Date(),
      status: "issued"
    });

    await transaction.save();

    res.json({ message: "Book issued successfully" });

  } catch (error) {
    res.status(500).json({ message: "Database error" });
  }
});


/* RETURN BOOK */
app.post("/return-book", async (req, res) => {
  try {
    const { transaction_id } = req.body;

    const transaction = await Transaction.findById(transaction_id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status === "returned") {
      return res.status(400).json({ message: "Book already returned" });
    }

    const issueDate = new Date(transaction.issue_date);
    const returnDate = new Date();

    const diffDays = Math.floor(
      (returnDate - issueDate) / (1000 * 60 * 60 * 24)
    );

    let fine = 0;
    if (diffDays > 7) {
      fine = (diffDays - 7) * 10;
    }

    transaction.status = "returned";
    transaction.return_date = returnDate;
    transaction.fine = fine;

    await transaction.save();

    const book = await Book.findById(transaction.book_id);
    book.quantity += 1;
    await book.save();

    res.json({
      message: "Book returned successfully",
      fine
    });

  } catch (error) {
    res.status(500).json({ message: "Database error" });
  }
});


/* GET BOOKS */
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch {
    res.status(500).json({ message: "Database error" });
  }
});


/* ACTIVE ISSUES */
app.get("/active-issues", async (req, res) => {
  try {
    const issues = await Transaction.find({ status: "issued" })
      .populate("user_id", "name")
      .populate("book_id", "title");

    res.json(issues);

  } catch {
    res.status(500).json({ message: "Database error" });
  }
});


/* OVERDUE BOOKS */
app.get("/overdue", async (req, res) => {
  try {

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const overdue = await Transaction.find({
      status: "issued",
      issue_date: { $lt: sevenDaysAgo }
    })
      .populate("user_id", "name")
      .populate("book_id", "title");

    res.json(overdue);

  } catch {
    res.status(500).json({ message: "Database error" });
  }
});


/* USERS */
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "name email role");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Database error" });
  }
});


/* PAY FINE */
app.post("/pay-fine", async (req, res) => {
  try {
    const { transaction_id } = req.body;

    await Transaction.findByIdAndUpdate(transaction_id, { fine: 0 });

    res.json({ message: "Fine paid successfully" });

  } catch {
    res.status(500).json({ message: "Database error" });
  }
});


/* ALL TRANSACTIONS */
app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("user_id", "name")
      .populate("book_id", "title");

    res.json(transactions);

  } catch {
    res.status(500).json({ message: "Database error" });
  }
});


app.get("/", (req, res) => {
  res.send("Library Management System API Running...");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});