import { server } from './config/server'

const port = process.env.PORT || 3001

server.listen(port, () => {
  console.warn(`the server is online in port ${port}`)
})
