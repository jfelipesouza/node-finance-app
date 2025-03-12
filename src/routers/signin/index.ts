import { Router } from 'express'
import { createAccount } from './create-account'

const signinRouters = Router()

signinRouters.post('/register', createAccount)

export { signinRouters }
