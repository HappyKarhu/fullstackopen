const CreateBlogForm = ({
   handleSubmit,
   handleTitleChange,
   handleAuthorChange,
   handleUrlChange,
   title,
   author,
   url
  }) => {
  return (
    <div>
      <h2>Create new Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title: <input
              type="text"
              value={title}
            onChange={handleTitleChange}
          />
        </label>
        </div>
        <div>
          <label>
            Author: <input
              type="text"
              value={author}
              onChange={handleAuthorChange}
            />
          </label>
        <div>
          <label>
            url: <input
              type="text"
              value={url}
              onChange={handleUrlChange}
            />
          </label>
        </div>
      </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateBlogForm