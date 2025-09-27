import { useState, useEffect } from 'react'

const API_BASE_URL = 'http://localhost:8000/api/v1'

function APITest() {
  const [portfolioData, setPortfolioData] = useState(null)
  const [blogData, setBlogData] = useState(null)
  const [contactData, setContactData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch portfolio data
        const portfolioResponse = await fetch(`${API_BASE_URL}/portfolio/`)
        const portfolio = await portfolioResponse.json()
        setPortfolioData(portfolio)

        // Fetch blog data
        const blogResponse = await fetch(`${API_BASE_URL}/blog/`)
        const blog = await blogResponse.json()
        setBlogData(blog)

        // Fetch contact data
        const contactResponse = await fetch(`${API_BASE_URL}/contact/`)
        const contact = await contactResponse.json()
        setContactData(contact)

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading API data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          API Integration Test
        </h1>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          {/* Portfolio Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Portfolio API
            </h2>
            {portfolioData && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Message:</strong> {portfolioData.message}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Skills Count:</strong> {portfolioData.skills_count}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Projects Count:</strong> {portfolioData.projects_count}
                </p>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Available Endpoints:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {Object.entries(portfolioData.endpoints || {}).map(([key, value]) => (
                      <li key={key} className="truncate">
                        <span className="font-medium">{key}:</span> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Blog Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Blog API
            </h2>
            {blogData && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Message:</strong> {blogData.message}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Posts Count:</strong> {blogData.posts_count}
                </p>
                {blogData.recent_posts && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Recent Posts:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {blogData.recent_posts.slice(0, 3).map((post, index) => (
                        <li key={index} className="truncate">
                          {post.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Available Endpoints:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {Object.entries(blogData.endpoints || {}).map(([key, value]) => (
                      <li key={key} className="truncate">
                        <span className="font-medium">{key}:</span> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
              Contact API
            </h2>
            {contactData && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Message:</strong> {contactData.message}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Messages Count:</strong> {contactData.messages_count}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Newsletter Subscribers:</strong> {contactData.newsletter_subscribers}
                </p>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Available Endpoints:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {Object.entries(contactData.endpoints || {}).map(([key, value]) => (
                      <li key={key} className="truncate">
                        <span className="font-medium">{key}:</span> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Test Additional Endpoints */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Quick API Endpoint Tests
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button 
              onClick={() => window.open(`${API_BASE_URL}/portfolio/skills/`, '_blank')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              View Skills
            </button>
            <button 
              onClick={() => window.open(`${API_BASE_URL}/portfolio/projects/`, '_blank')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              View Projects  
            </button>
            <button 
              onClick={() => window.open(`${API_BASE_URL}/blog/posts/`, '_blank')}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              View Blog Posts
            </button>
            <button 
              onClick={() => window.open(`${API_BASE_URL}/contact/messages/`, '_blank')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              View Messages
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default APITest