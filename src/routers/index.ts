import { Router } from 'express'
import type { Request, Response } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.status(200).send({
    message: 'Ok'
  })
})

router.get('/signin-bff', (req: Request, res: Response) => {
  res.status(500).send({
    message: 'Router not found'
  })
})

export { router }
