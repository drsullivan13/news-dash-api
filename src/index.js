import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import newsRoutes from './routes/news.js'

if (!process.env.NEWS_API_KEY) {
    console.error('NEWS_API_KEY is not defined in environment variables');
    process.exit(1);
  }

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api', newsRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    data: null,
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});