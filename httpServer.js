import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3001;

const books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', price: 350 },
  { id: 2, title: 'Atomic Habits', author: 'James Clear', price: 499 },
  { id: 3, title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', price: 300 }
];

const sendJSON = (res, status, data) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;

  // "/" - welcome message (HTML)
  if (pathname === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Welcome to the Library Management System</h1>');

  // "/books" - list books (JSON)
  } else if (pathname === '/books' && method === 'GET') {
    sendJSON(res, 200, books);

  // "/about" - app info
  } else if (pathname === '/about' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Library Book Management App built with the Node.js HTTP module.');

  // "/home" - serve HTML using FS
  } else if (pathname === '/home' && method === 'GET') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading file');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });

  // POST "/add-book"
  } else if (pathname === '/add-book' && method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const { id, title, author, price } = JSON.parse(body);
        if (id === undefined || !title || !author || price === undefined) {
          return sendJSON(res, 400, { error: 'id, title, author and price are required' });
        }
        const newBook = { id, title, author, price };
        books.push(newBook);
        sendJSON(res, 201, { message: 'Book added successfully', book: newBook });
      } catch {
        sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });

  // Invalid route
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Route Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});