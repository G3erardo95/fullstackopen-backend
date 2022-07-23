const dummy = (blogs) => {
const dummyBlog = "Hi! There is no blog here! Try adding one right now!"
  
  if (blogs.length === 0) {
    return blogs.push(dummyBlog)
  };
};

const totalLikes = (blogs) => {
  const getSumByKey = (arr, key) => {
    return arr.reduce((accumulator, current) => accumulator + Number(current[key]), 0)}

    return blogs.length === 0
    ? 0
    : getSumByKey(blogs, 'likes')
  }

const favoriteBlog = (blogs) => {

  return blogs.length === 0
  ? [{}]
  : blogs.reduce((accumulator, currentValue, index) => {
    if (index == 0) {
      return currentValue;
    }
    return accumulator.likes > currentValue.likes ? accumulator : currentValue;
  });
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}