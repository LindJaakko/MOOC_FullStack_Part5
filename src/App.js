import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      blogService.setToken(user.token)
      setUser(user)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      /*
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      */
    }
  }

  const addBlog = (event) => {
    event.preventDefault()
    console.log(newBlog)

    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    }
    console.log(blogObject)
    blogService.create(blogObject).then((returnedBlog) => {
      console.log(returnedBlog)
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog({ title: '', author: '', url: '' })
    })
  }

  const handleBlogChange = (event) => {
    setNewBlog(event.target.value)
    const value = event.target.value
    setNewBlog({
      ...newBlog,
      [event.target.name]: value,
    })
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const blogForm = () => (
    /*
    <form onSubmit={addBlog}>
      <input value={newBlog} onChange={handleBlogChange} />
      <button type='submit'>create</button>
    </form>
    */
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          type='text'
          value={newBlog.title}
          name='title'
          onChange={handleBlogChange}
        />
      </div>
      <div>
        author:
        <input
          type='text'
          value={newBlog.author}
          name='author'
          onChange={handleBlogChange}
        />
      </div>
      <div>
        url:
        <input
          type='text'
          value={newBlog.url}
          name='url'
          onChange={handleBlogChange}
        />
      </div>
      <button type='submit'>create</button>
    </form>
  )

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  return (
    <div>
      {user === null ? (
        <div>
          <h2>log in to application</h2>
          {loginForm()}
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in <button onClick={logOut}>logout</button>
          </p>
          <h2>create new</h2>
          {blogForm()}
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
