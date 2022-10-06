import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
//import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'TestTitle',
    author: 'TestAuthor',
    url: 'www.Test.fi',
    user: {
      username: 'TestUser',
      ref: 'User',
    },
    likes: 10,
  }
  const username = 'TestUser'
  const mockHandler = jest.fn()
  render(
    <Blog
      blog={blog}
      username={username}
      onLike={mockHandler}
      onRemove={mockHandler}
    />
  )

  const element = screen.getByText('TestTitle', { exact: false })

  expect(element).toBeDefined()
})
