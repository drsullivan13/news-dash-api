import { Router } from 'express'
import { getNews, getSources } from '../controllers/newsController.js'

const router = Router()

router.get('/sources', getSources)
router.post('/news', getNews)

export default router