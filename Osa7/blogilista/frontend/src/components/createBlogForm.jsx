import { useState } from "react";

const CreateBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>Create new Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title:{" "}
            <input
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="title"
            />
          </label>
        </div>
        <div>
          <label>
            Author:{" "}
            <input
              name="author"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="author"
            />
          </label>
        </div>
        <div>
          <label>
            url:{" "}
            <input
              name="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="url"
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default CreateBlogForm;
