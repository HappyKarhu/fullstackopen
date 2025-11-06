const _ = require("lodash");
const dummy = (blogs) => 1;

const totalLikes = (blogs) =>
  blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  return blogs.reduce(
    (favorite, blog) => (blog.likes > (favorite.likes || 0) ? blog : favorite),
    {},
  );
};

//4.6*: Helper Functions and Unit Tests, step 4 - Lodash-most blogs
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const counts = _.countBy(blogs, "author"); // Count how many blogs each author has
  const authorMax = _.maxBy(Object.keys(counts), (author) => counts[author]); // Find the author with the max counts
  return {
    author: authorMax,
    blogs: counts[authorMax],
  };
};
//4.7 most likes
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const groupedByAuthor = _.groupBy(blogs, "author");
  const likesAuthorMax = _.map(groupedByAuthor, (authorBlogs, author) => ({
    author: author,
    likes: _.sumBy(authorBlogs, "likes"),
  }));

  return _.maxBy(likesAuthorMax, "likes");
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
