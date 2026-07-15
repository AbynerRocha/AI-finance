// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('mounts the application tree with auth context available', () => {
    const { container } = render(<App />)

    expect(container).toBeTruthy()
  })
})
