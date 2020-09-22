const express = require("express");
const cors = require("cors");
const {v4:uuid} = require("uuid")


const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

function searchID(request, response, next){
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id == id);

  if(projectIndex < 0){
    return response.status(400).json({error: "ID not found"})
  }

  request.projectIndex = projectIndex

  return next()
}

app.use('/repositories/:id', searchID);

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const NewProject = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(NewProject)

  return response.json(NewProject)

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {title, url, techs} = request.body;
  projectIndex = request.projectIndex

  projectLikes = repositories[projectIndex].likes

  const updateProject = {
    id,
    title,
    url, 
    techs,
    likes: projectLikes
  } 

  repositories[projectIndex] = updateProject

  return response.json(updateProject)

});

app.delete("/repositories/:id", (request, response) => {
  projectIndex = request.projectIndex
  repositories.splice(projectIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  projectIndex = request.projectIndex
  repositories[projectIndex].likes++

  return response.json(repositories[projectIndex])
});

module.exports = app;
