const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
const requestLogger =(req, res, next)=>{
  console.log('METHOD', req.method)
  console.log('PATH', req.path)
  console.log('BODY', req.body)
  console.log('-------------------')
  next()
}
app.use(requestLogger)
app.use(express.static('dist'))
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


const generatedID =()=>{
  const maxId = notes.length > 0
    ? Math.max(...notes.map(note=>Number(note.id)))
    : 0
  return String(maxId + 1)
}
  app.get('/api/notes', (req, res)=>{
    res.end(JSON.stringify(notes))
  })
  app.get('/api/notes/:id', (req, res)=>{
    const id = req.params.id
    const note = notes.find(note=>note.id === id)
    if(note){
      res.json(note)
    }else res.status(404).end()
  })
app.delete('/api/notes/:id', (req, res)=>{
  const id = req.params.id
  const note = notes.filter(note=>note.id !== id)
  res.status(204).end()
})
app.post('/api/notes', (req, res)=>{
  const body = req.body
  if(!body.content){
    return res.status(400).json({error:'content missing'})
  }
  const note = {
    content: body.content,
    important : body.important || false,
    id: generatedID()
  }
  notes = notes.concat(note)
  res.json(note)

})

app.use(unknownEndpoint)
const  PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`server running on port: ${PORT}`)
})