// src/services/newsService.js
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const NEWS_API_BASE_URL = 'https://newsapi.org/v2'
const MAX_RESULTS = 100 // Developer plan limit

export const fetchNewsArticles = async ({ 
  companies = [], 
  timeRange = 30, 
  sources = [], 
  domains = [],
  page = 1, 
  pageSize = 20 
}) => {
  // Validate page size and calculate total pages based on 100 result limit
  const adjustedPageSize = Math.min(pageSize, MAX_RESULTS)
  const maxPages = Math.ceil(MAX_RESULTS / adjustedPageSize)

  // If requested page exceeds our maximum possible pages, return empty results
  if (page > maxPages) {
    return {
      articles: [],
      metadata: {
        totalResults: MAX_RESULTS,
        totalPages: maxPages,
        currentPage: page,
        sources: [],
        companies: []
      }
    }
  }

  const queryParams = new URLSearchParams()
  
  // Create query for companies
  const companyQueries = companies.map(company => `"${company}"`).join(' OR ')
  queryParams.append('q', companyQueries)
  
  if (sources.length) {
    queryParams.append('sources', sources.join(','))
  }

  if (domains.length) {
    queryParams.append('domains', domains.join(','))
  }
  
  // Calculate date range
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - timeRange)
  const fromDateString = fromDate.toISOString().split('T')[0]
  
  queryParams.append('from', fromDateString)
  queryParams.append('language', 'en')
  queryParams.append('sortBy', 'publishedAt')
  queryParams.append('pageSize', adjustedPageSize.toString())
  queryParams.append('page', page.toString())

  try {
    const response = await axios.get(
      `${NEWS_API_BASE_URL}/everything?${queryParams.toString()}`,
      {
        headers: {
          'X-Api-Key': process.env.NEWS_API_KEY
        }
      }
    )

    // Always limit total results to 100
    const totalResults = Math.min(response.data.totalResults, MAX_RESULTS)
    const totalPages = Math.ceil(totalResults / adjustedPageSize)

    // Map the articles
    const articles = response.data.articles.map(article => {
      // Determine which company the article matches
      const matchedCompany = companies.find(company => 
        article.title.toLowerCase().includes(company.toLowerCase()) ||
        article.description?.toLowerCase().includes(company.toLowerCase())
      )

      return {
        id: uuidv4(),
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        source: {
          id: article.source.id,
          name: article.source.name
        },
        publishedAt: article.publishedAt,
        company: matchedCompany || null
      }
    })

    // Get unique sources and companies
    const uniqueSources = [...new Set(articles.map(article => article.source.name))]
    const uniqueCompanies = [...new Set(articles.filter(article => article.company).map(article => article.company))]

    return {
      articles,
      metadata: {
        totalResults,
        totalPages,
        currentPage: page,
        sources: uniqueSources,
        companies: uniqueCompanies
      }
    }

  } catch (error) {
    console.error('Error fetching news:', error)
    
    // Handle NewsAPI specific errors
    if (error.response?.status === 426) {
      return {
        articles: [],
        metadata: {
          totalResults: 0,
          totalPages: maxPages,
          currentPage: page,
          sources: [],
          companies: [],
          error: 'Maximum results limit reached. Please refine your search criteria.'
        }
      }
    }

    throw error
  }
}

export const fetchNewsSources = async () => {
  const response = await axios.get(
    `${NEWS_API_BASE_URL}/sources`,
    {
      headers: {
        'X-Api-Key': process.env.NEWS_API_KEY
      }
    }
  )

  return {
    sources: response.data.sources.map(source => ({
      id: source.id,
      name: source.name,
      description: source.description,
      category: source.category,
      language: source.language,
      country: source.country
    }))
  }
}