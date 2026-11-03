import express from 'express';

const app = express();
const PORT = 4000;

app.use(express.json());

let books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', price: 350, category: 'Fiction' },
  { id: 2, title: 'Atomic Habits', author: 'James Clear', price: 499, category: 'Self-Help' },
  { id: 3, title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', price: 300, category: 'Biography' }
];

// GET all books
app.get('/books', (req, res) => {
  res.json(books);
});

// GET book by id
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

// POST add book
app.post('/books', (req, res) => {
  const { id, title, author, price, category } = req.body;
  if (id === undefined || !title || !author || price === undefined || !category) {
    return res.status(400).json({ error: 'id, title, author, price and category are required' });
  }
  if (books.some(b => b.id === Number(id))) {
    return res.status(400).json({ error: 'Book with this id already exists' });
  }
  const book = { id: Number(id), title, author, price, category };
  books.push(book);
  res.status(201).json({ message: 'Book added successfully', book });
});

// PUT update book
app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });

  const { title, author, price, category } = req.body;
  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (price !== undefined) book.price = price;
  if (category !== undefined) book.category = category;

  res.json({ message: 'Book updated successfully', book });
});

// DELETE book
app.delete('/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Book not found' });

  const [deleted] = books.splice(index, 1);
  res.json({ message: 'Book deleted successfully', book: deleted });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
