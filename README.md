# News Dashboard API

A RESTful API service that provides news articles and sources using the News API. This service allows you to fetch news articles based on companies, sources, and domains with advanced filtering capabilities.

## Features

- Fetch news articles with multiple filtering options:
  - Company-specific news
  - Source-based filtering
  - Domain-based filtering
  - Time range selection
  - Pagination support
- Get list of available news sources with metadata
- CORS enabled
- Comprehensive error handling
- Rate limit handling
- Vercel deployment ready

## Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn
- News API Key (from [newsapi.org](https://newsapi.org))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd news-dash-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your News API key:
```
NEWS_API_KEY=your_api_key_here
PORT=3000 # Optional, defaults to 3000
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### 1. Get News Articles
```
POST /api/news
```

Fetches news articles based on provided parameters.

#### Request Body Parameters
```json
{
  "companies": ["Apple", "Microsoft"],  // Optional: Array of company names to search for
  "timeRange": 30,                      // Optional: Number of days to look back (default: 30)
  "sources": ["bbc-news", "cnn"],      // Optional: Array of news source IDs
  "domains": ["example.com"],          // Optional: Array of domains to filter by
  "page": 1,                           // Optional: Page number (default: 1)
  "pageSize": 20                       // Optional: Results per page (default: 20, max: 100)
}
```

#### Response Format
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "uuid",
        "title": "Article Title",
        "description": "Article Description",
        "content": "Article Content",
        "url": "Article URL",
        "source": {
          "id": "source-id",
          "name": "Source Name"
        },
        "publishedAt": "2024-01-01T00:00:00Z",
        "company": "Matched Company Name"
      }
    ],
    "metadata": {
      "totalResults": 100,
      "totalPages": 5,
      "currentPage": 1,
      "sources": ["Source1", "Source2"],
      "companies": ["Company1", "Company2"]
    }
  },
  "error": null
}
```

### 2. Get News Sources
```
GET /api/sources
```

Returns a list of available news sources.

#### Response Format
```json
{
  "success": true,
  "data": {
    "sources": [
      {
        "id": "source-id",
        "name": "Source Name",
        "description": "Source Description",
        "category": "Category",
        "language": "en",
        "country": "us"
      }
    ]
  },
  "error": null
}
```

## Environment Variables

- `NEWS_API_KEY` (required): Your News API key
- `PORT` (optional): Port number for the server (defaults to 3000)

## Tech Stack

- Node.js
- Express.js
- Axios for HTTP requests
- CORS for cross-origin resource sharing
- dotenv for environment variable management
- UUID for generating unique article IDs

## Error Handling

The API includes comprehensive error handling:
- Invalid API key detection
- Rate limiting handling (426 status code)
- Internal server error responses
- Request validation
- Maximum results limit handling (100 articles per request)

## Deployment

This API is configured for deployment on Vercel and includes the necessary `vercel.json` configuration. The configuration includes:
- Node.js build configuration
- API route handling
- Serverless function setup

## Rate Limits and Limitations

- Maximum of 100 results per search query
- Results are paginated with adjustable page size
- Time range filtering available for historical data
- English language articles only
- Sorted by publish date (newest first)

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here] 