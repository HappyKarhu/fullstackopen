import axios from "axios";
const baseUrl = "http://localhost:3001/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data.map(blog => ({
    ...blog,
    id: blog._id,
    user: blog.user
      ? { ...blog.user, id: blog.user._id }
      : null
    
  }));
};

const getById = async (id) => {
  if (!id || id === 'undefined') {
    throw new Error('invalid id');
  }
  const response = await axios.get(`${baseUrl}/${id}`);
  const blog = response.data;
  return {
    ...blog,
    id: blog.id ?? blog._id,
    user: blog.user
      ? { ...blog.user, id: blog.user._id }
      : null
  };
};

const createBlog = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const updateBlog = async (id, updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  if (!id || id === 'undefined') {
    throw new Error('invalid id');
  }
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config);
  const blog = response.data;
  return {
    ...blog,
    id: blog._id,
    user: blog.user
      ? { ...blog.user, id: blog.user._id }
      : null
  };

};

const deleteBlog = async (Id) => {
  const config = {
    headers: { Authorization: token },
  };
  if (!Id || Id === 'undefined') {
    throw new Error('invalid id');
  }
  const response = await axios.delete(`${baseUrl}/${Id}`, config);
  return response.data;
};

//comments:
const getComments = async (id) => {
  if (!id || id === 'undefined') {
    throw new Error('invalid id');
  }
  const response = await axios.get(`${baseUrl}/${id}/comments`);
  return response.data;
};
const addComment = async (id, content) => {
  if (!id || id === 'undefined') {
    throw new Error('invalid id');
  }
  const response = await axios.post(`${baseUrl}/${id}/comments`, { content });
  return response.data;
};

export default { getAll, getById, setToken, createBlog, updateBlog, deleteBlog, getComments, addComment }