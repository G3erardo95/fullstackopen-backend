const dummy = (blogs) => {
const dummyBlog = "Hi! There is no blog here! Try adding one right now!"
  
  if (blogs.length === 0) {
    return blogs.push(dummyBlog)
  };
}

module.exports = {
  dummy
}