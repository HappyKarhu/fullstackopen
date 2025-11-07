import { useState } from "react";
import myBlogs from "../services/blogs";

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false); //details not shown, only title&author
  const [backgroundCOlor, setBackgroundCOlor] = useState("white");
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
    background: backgroundCOlor,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
    setBackgroundCOlor(visible ? "yellow" : "#5226ccff");
  }; //true, url,likes &author is visible

  const handleLike = () => {
    updateBlog(blog);
    }
    
    
  return (
    <div className="blog" data-cy="blog" style={blogStyle}>
      <div className="blog-title-author">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>

      {visible && (
        <div>
          <div className="blog-details">
            <div>{blog.url}</div>
            <div>
              likes {blog.likes} <button onClick={handleLike}>like</button>
            </div>
            <div>{blog.author}</div>
          </div>
          {blog.user && user.username === blog.user.username && (
            <button
              onClick={() => deleteBlog(blog.id, blog.title, blog.author)}
            >
              delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;