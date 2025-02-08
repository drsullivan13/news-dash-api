// src/services/newsService.js
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const NEWS_API_BASE_URL = 'https://newsapi.org/v2'

export const fetchNewsArticles = async ({ 
  companies = [], 
  timeRange = 30, 
  sources = [], 
  domains = [],
  page = 1, 
  pageSize = 20 
}) => {
  const queryParams = new URLSearchParams();
  
  // Create query for companies
  const companyQueries = companies.map(company => `"${company}"`).join(' OR ')
  queryParams.append('q', companyQueries)
  
  // Create query for sources
  if (sources.length) {
    queryParams.append('sources', sources.join(','));
  }

  if (domains.length) {
    queryParams.append('domains', domains.join(','));
  }
  
  // Calculate date range
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - timeRange)
  const fromDateString = fromDate.toISOString().split('T')[0]
  
  queryParams.append('from', fromDateString)
  queryParams.append('page', page.toString())
  queryParams.append('pageSize', pageSize.toString())
  queryParams.append('language', 'en')
  queryParams.append('sortBy', 'publishedAt')
  
// console.log(`QUERY PARAMS: ${queryParams.toString}`)

const response = await axios.get(
    `${NEWS_API_BASE_URL}/everything?${queryParams.toString()}`,
    {
    headers: {
        'X-Api-Key': process.env.NEWS_API_KEY
    }
    }
)

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

  // Get unique sources and companies from the results
  const uniqueSources = [...new Set(articles.map(article => article.source.name))]
  const uniqueCompanies = [...new Set(articles.filter(article => article.company).map(article => article.company))]

  return {
    articles,
    metadata: {
      totalResults: response.data.totalResults,
      sources: uniqueSources,
      companies: uniqueCompanies
    }
  }
}

export const fetchNewsSources = async () => {
  const response = await axios.get(
    `${NEWS_API_BASE_URL}/top-headlines/sources`,
    {
      headers: {
        'X-Api-Key': process.env.NEWS_API_KEY
      }
    }
  );

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
