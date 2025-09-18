const dummy = (blogs) => 1

const totalLikes = (blogs) =>
  blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((favorite, blog) => (blog.likes > (favorite.likes || 0)) ? blog : favorite, {})
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
