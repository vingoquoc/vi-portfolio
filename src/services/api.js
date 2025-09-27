class ApiService {
  constructor() {
    // Cache for JSON data to avoid multiple fetches
    this.cache = new Map()
  }

  // Method to clear cache (useful for development)
  clearCache() {
    this.cache.clear()
  }

  async loadJsonData(filename) {
    // Check cache first (but can be cleared if needed)
    if (this.cache.has(filename)) {
      console.log(`Loading ${filename} from cache`)
      return this.cache.get(filename)
    }

    try {
      // Add cache busting for fresh data
      const cacheBuster = new Date().getTime()
      const response = await fetch(`./data/${filename}?v=${cacheBuster}`)
      
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Cache the data
      this.cache.set(filename, data)
      console.log(`Loaded fresh data for ${filename}:`, data)
      
      return data
    } catch (error) {
      console.error(`Error loading ${filename}:`, error)
      throw error
    }
  }

  // Simulate API delay for realistic behavior (optional)
  async delay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Portfolio API methods
  async getPortfolioOverview() {
    await this.delay()
    const [profile, projects, skills] = await Promise.all([
      this.getProfile(),
      this.getProjects(),
      this.getSkills()
    ])
    
    return {
      profile,
      featured_projects: projects.filter(p => p.featured).slice(0, 3),
      skills_summary: skills.slice(0, 6),
      total_projects: projects.length,
      years_experience: new Date().getFullYear() - 2019 // Calculated from first job
    }
  }

  async getProfile() {
    await this.delay()
    return this.loadJsonData('profile.json')
  }

  async getSkills() {
    await this.delay()
    return this.loadJsonData('skills.json')
  }

  async getProjects() {
    await this.delay()
    return this.loadJsonData('projects.json')
  }

  async getProject(id) {
    await this.delay()
    const projects = await this.loadJsonData('projects.json')
    const project = projects.find(p => p.id === parseInt(id))
    
    if (!project) {
      throw new Error(`Project with id ${id} not found`)
    }
    
    return project
  }

  async getExperience() {
    await this.delay()
    return this.loadJsonData('experience.json')
  }

  async getEducation() {
    await this.delay()
    return this.loadJsonData('education.json')
  }

  async getCertificates() {
    await this.delay()
    const education = await this.loadJsonData('education.json')
    // Return only items that are certificates
    return education.filter(item => 
      item.degree.toLowerCase().includes('certified') || 
      item.degree.toLowerCase().includes('certificate')
    )
  }

  async getTestimonials() {
    await this.delay()
    // Return empty array for now, can be extended later
    return []
  }

  // Blog API methods
  async getBlogOverview() {
    await this.delay()
    const posts = await this.loadJsonData('blog.json')
    
    return {
      total_posts: posts.length,
      featured_posts: posts.filter(p => p.featured),
      recent_posts: posts.slice(0, 5),
      categories: [...new Set(posts.map(p => p.category))],
      total_views: posts.reduce((sum, p) => sum + p.views, 0)
    }
  }

  async getBlogPosts(params = {}) {
    await this.delay()
    let posts = await this.loadJsonData('blog.json')
    
    // Apply filters
    if (params.category) {
      posts = posts.filter(p => p.category.toLowerCase() === params.category.toLowerCase())
    }
    
    if (params.tag) {
      posts = posts.filter(p => p.tags.some(tag => 
        tag.toLowerCase().includes(params.tag.toLowerCase())
      ))
    }
    
    if (params.search) {
      const searchTerm = params.search.toLowerCase()
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.excerpt.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }
    
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    
    // Pagination
    const page = parseInt(params.page) || 1
    const limit = parseInt(params.limit) || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    
    return {
      results: posts.slice(startIndex, endIndex),
      count: posts.length,
      next: endIndex < posts.length ? page + 1 : null,
      previous: page > 1 ? page - 1 : null
    }
  }

  async getBlogPost(id) {
    await this.delay()
    const posts = await this.loadJsonData('blog.json')
    
    // Find by ID or slug
    const post = posts.find(p => 
      p.id === parseInt(id) || p.slug === id
    )
    
    if (!post) {
      throw new Error(`Blog post with id/slug ${id} not found`)
    }
    
    return post
  }

  async getBlogComments(postId) {
    await this.delay()
    // Return empty array for now, can be extended later
    return []
  }

  // Contact API methods
  async getContactOverview() {
    await this.delay()
    const profile = await this.loadJsonData('profile.json')
    
    return {
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      social: profile.social,
      available_for_hire: true,
      response_time: "Within 24 hours"
    }
  }

  async submitContactMessage(data) {
    await this.delay(500) // Longer delay for form submission
    
    // Simulate form submission (in real app, this would send to a service)
    console.log('Contact message submitted:', data)
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      throw new Error('Please fill in all required fields')
    }
    
    // Simulate successful submission
    return {
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
      id: Date.now() // Simulate generated ID
    }
  }

  async subscribeNewsletter(email) {
    await this.delay(300)
    
    // Validate email
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address')
    }
    
    // Simulate successful subscription
    console.log('Newsletter subscription:', email)
    
    return {
      success: true,
      message: 'Successfully subscribed to newsletter!'
    }
  }
}

export default new ApiService()