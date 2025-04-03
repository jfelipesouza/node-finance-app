import { Request, Response, Router } from 'express'
import { createAccount } from './create-account'

const signinRouters = Router()

signinRouters.post('/register', createAccount)
signinRouters.post('/login', (req: Request, res: Response) => {
  res.send({
    message: 'Ok'
  })
})

export { signinRouters }
