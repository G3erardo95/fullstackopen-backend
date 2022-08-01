const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    response.json(blogs)
  });

blogsRouter.get('/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id)
      if (blogs) {
        response.json(blogs)
      } else {
        response.status(404).end()
      }
  });

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch(exception) {
    next(exception)
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndRemove(request.params.id)
  try {
    response.status(204).end()
  } catch(error) {
    next(error)
  }
  });

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const changedBlog = await blog.save()
    response.status(200).json(changedBlog)
  } catch(exception) {
    next(exception)
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      response.json(blog)
    .catch(error => next(error))
});

module.exports = blogsRouter