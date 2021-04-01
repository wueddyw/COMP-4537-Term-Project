const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Express')
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
