import { fetchNewsArticles, fetchNewsSources } from '../services/newsService.js'

export const getNews = async (req, res, next) => {
  try {
    const { 
      companies, 
      timeRange, 
      sources,
      domains,
      page = 1, 
      pageSize = 20 
    } = req.body
    
    const result = await fetchNewsArticles({ 
      companies, 
      timeRange, 
      sources, 
      domains,
      page, 
      pageSize 
    })
    
    res.json({
      success: true,
      data: result,
      error: null
    });
  } catch (error) {
    next(error)
  }
}

export const getSources = async (req, res, next) => {
  try {
    const sources = await fetchNewsSources();
    res.json({
      success: true,
      data: sources,
      error: null
    })
  } catch (error) {
    next(error)
  }
}