import React, { useState, useEffect } from 'react'
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaDownload, FaExternalLinkAlt, FaChevronDown, FaBars, FaTimes, FaCode, FaRocket, FaLightbulb, FaUser, FaBriefcase, FaGraduationCap, FaAward, FaEye, FaHeart, FaMapMarkerAlt, FaPhone, FaStar, FaArrowUp } from 'react-icons/fa'
import { HiCode, HiLightningBolt, HiAcademicCap, HiCollection, HiStar } from 'react-icons/hi'
import { BiLocationPlus } from 'react-icons/bi'
import { MdEmail, MdPhone, MdDateRange } from 'react-icons/md'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'
import ApiService from '../services/api'

function DynamicPortfolio() {
  const { isDark } = useTheme()
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [animateStats, setAnimateStats] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState([])
  const [skillsInView, setSkillsInView] = useState(false)
  const [projectsInView, setProjectsInView] = useState(false)
  
  // API Data States
  const [profileData, setProfileData] = useState(null)
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [experience, setExperience] = useState([])
  const [education, setEducation] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  
  const apiService = ApiService

  // Helper function to normalize paths for GitHub Pages
  const getAssetPath = (path) => {
    if (!path) return path
    return path.startsWith('/') ? '.' + path : path
  }

  // Initialize particles for background animation
  useEffect(() => {
    const initialParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      opacity: Math.random() * 0.4 + 0.1
    }))
    setParticles(initialParticles)
  }, [])

  // Animate particles (disabled to reduce page refreshes)
  useEffect(() => {
    // Particle animation disabled to prevent auto-refresh
    // Uncomment below to enable particles animation
    /*
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.speedX,
        y: particle.y + particle.speedY,
        x: particle.x > window.innerWidth ? 0 : particle.x < 0 ? window.innerWidth : particle.x,
        y: particle.y > window.innerHeight ? 0 : particle.y < 0 ? window.innerHeight : particle.y
      })))
    }

    const interval = setInterval(animateParticles, 50)
    return () => clearInterval(interval)
    */
  }, [])

  const fetchPortfolioData = async () => {
    try {
      console.log('🔄 fetchPortfolioData called at:', new Date().toLocaleTimeString())
      
      // Preserve scroll position during data refresh
      const currentScrollY = window.scrollY
      
      setLoading(true)
      
      // Fetch all data in parallel
      const [profileRes, skillsRes, projectsRes, experienceRes, educationRes] = await Promise.all([
        apiService.getProfile(),
        apiService.getSkills(),
        apiService.getProjects(),
        apiService.getExperience(),
        apiService.getEducation()
      ])
      
      // Set profile data directly from API response
      setProfileData(profileRes)
      console.log('Profile data loaded:', profileRes)
      
      // Set skills data
      setSkills(skillsRes.results || skillsRes)
      
      // Set projects data  
      setProjects(projectsRes.results || projectsRes)
      
      // Set experience data
      setExperience(experienceRes.results || experienceRes)
      
      // Set education data
      setEducation(educationRes.results || educationRes)
      
      setError(null)
      setLastUpdated(new Date())
      
      // Restore scroll position after data update
      // Disabled to test auto-scroll issue
      // setTimeout(() => {
      //   window.scrollTo(0, currentScrollY)
      // }, 100)
      
    } catch (err) {
      console.error('Error fetching portfolio data:', err)
      setError('Failed to load portfolio data')
      
      // Restore scroll position even on error
      // Disabled to test auto-scroll issue
      // setTimeout(() => {
      //   window.scrollTo(0, currentScrollY)
      // }, 100)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPortfolioData()
    
    // Auto-refresh disabled to prevent page resets
    // Uncomment below lines if you want auto-refresh every 30 seconds
    // const interval = setInterval(fetchPortfolioData, 30000)
    // return () => clearInterval(interval)
    
    // Debug: Monitor for any setInterval/setTimeout calls
    const originalSetInterval = window.setInterval
    const originalSetTimeout = window.setTimeout
    
    window.setInterval = function(...args) {
      console.log('🔥 setInterval detected:', args[0]?.toString()?.substring(0, 100))
      return originalSetInterval.apply(window, args)
    }
    
    window.setTimeout = function(...args) {
      console.log('⏰ setTimeout detected:', args[0]?.toString()?.substring(0, 100))
      return originalSetTimeout.apply(window, args)
    }
    
    return () => {
      // Restore original functions
      window.setInterval = originalSetInterval
      window.setTimeout = originalSetTimeout
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      // Animate stats when in view
      const statsSection = document.getElementById('stats')
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect()
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setAnimateStats(true)
        }
      }

      // Animate skills when in view
      const skillsSection = document.getElementById('skills')
      if (skillsSection) {
        const rect = skillsSection.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0) {
          setSkillsInView(true)
        }
      }

      // Animate projects when in view
      const projectsSection = document.getElementById('projects')
      if (projectsSection) {
        const rect = projectsSection.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0) {
          setProjectsInView(true)
        }
      }

      // Update active section based on scroll
      const sections = ['home', 'about', 'skills', 'education', 'experience', 'projects', 'contact']
      sections.forEach(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
          }
        }
      })
    }

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navHeight = 60 // Navigation bar height
      const elementPosition = element.offsetTop - navHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
      setMobileMenuOpen(false)
    }
  }

  const formatSkillLevel = (skill) => {
    // Convert skill level to percentage if needed
    const level = skill.proficiency || skill.proficiency_level || skill.level || 0
    return Math.min(Math.max(level, 0), 100)
  }

  const getSkillIcon = (skill) => {
    // If skill has an icon path (SVG), return img element
    if (skill.icon && skill.icon.startsWith('/icons/')) {
      return (
        <img 
          src={getAssetPath(skill.icon)} 
          alt={skill.name} 
          className="w-6 h-6"
          style={{ filter: 'brightness(0) saturate(100%) invert(1)' }}
        />
      );
    }
    
    // Fallback to emoji if available
    if (skill.icon) {
      return skill.icon;
    }
    
    // Default fallback
    return '💻';
  }

  const getServiceIcon = (service) => {
    // If service has an icon path (SVG), return img element
    if (service.icon && service.icon.startsWith('/icons/')) {
      return (
        <img 
          src={getAssetPath(service.icon)} 
          alt={service.title} 
          className="w-6 h-6"
          style={{ filter: 'brightness(0) saturate(100%) invert(1)' }}
        />
      );
    }
    
    // Fallback to emoji if available
    if (service.icon) {
      return service.icon;
    }
    
    // Default fallback based on title
    const defaultIcons = {
      'UI/UX Design': '🎨',
      'Mobile Development': '📱',
      'Web Development': '⚡',
      'DevOps & Deployment': '🚀'
    };
    return defaultIcons[service.title] || '💼';
  }

  const getEducationIcon = (education) => {
    // If education has an icon path (SVG), return img element
    if (education.icon && education.icon.startsWith('/icons/')) {
      return (
        <img 
          src={getAssetPath(education.icon)} 
          alt={education.degree} 
          className="w-8 h-8"
          style={{ filter: isDark ? 'brightness(0) saturate(100%) invert(1)' : 'none' }}
        />
      );
    }
    
    // Default fallback based on degree type
    const defaultIcons = {
      'Bachelor': '🎓',
      'Certificate': '📜',
      'Certification': '🏆',
      'Specialization': '📚',
      'Bootcamp': '💻'
    };
    
    // Try to match by degree type
    for (let type in defaultIcons) {
      if (education.degree && education.degree.includes(type)) {
        return defaultIcons[type];
      }
    }
    
    return '🎓'; // Default university icon
  }

  const getSkillColor = (index) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500', 
      'from-yellow-500 to-orange-500',
      'from-blue-600 to-indigo-600',
      'from-purple-500 to-pink-500',
      'from-green-600 to-teal-600',
      'from-orange-500 to-red-500',
      'from-pink-500 to-rose-500'
    ]
    return colors[index % colors.length]
  }

  const getProjectGradient = (index) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-blue-600',
      'from-purple-500 to-pink-600',
      'from-orange-500 to-red-600',
      'from-teal-500 to-cyan-600',
      'from-indigo-500 to-purple-600'
    ]
    return gradients[index % gradients.length]
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-white'} relative overflow-hidden`}>
        <div className="text-center z-10">
          <div className="relative mb-8">
            <div className={`animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 ${isDark ? 'border-blue-400' : 'border-blue-600'}`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`animate-pulse text-4xl ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>⚡</div>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-purple-500 animate-spin-reverse"></div>
          </div>
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Loading Professional Portfolio...
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
            Crafting the perfect experience for you
          </p>
          <div className="flex justify-center space-x-2">
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"
                style={{animationDelay: `${i * 0.1}s`}}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Loading Background Animation */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${isDark ? 'bg-blue-500/20' : 'bg-blue-300/30'} animate-ping`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} relative overflow-x-hidden`}>
      
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`absolute rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-300'}`}
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity
            }}
          />
        ))}
      </div>

      {/* Cursor Follower */}
      <div 
        className="fixed w-8 h-8 pointer-events-none z-50 mix-blend-difference transition-all duration-200 ease-out"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-60 animate-pulse scale-75 hover:scale-100 transition-transform duration-200"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? `backdrop-blur-xl ${isDark ? 'bg-gray-900/95 shadow-2xl border-b border-gray-800' : 'bg-white/95 shadow-2xl border-b border-gray-200'}` 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className="relative">
                {profileData?.profile_image ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 border-2 border-white/20">
                    <img 
                      src={getAssetPath(profileData.profile_image)} 
                      alt="Profile"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <span className="text-white font-bold text-lg transform group-hover:scale-110 transition-transform duration-300">
                      {profileData?.first_name?.[0] && profileData?.last_name?.[0] 
                        ? `${profileData.first_name[0]}${profileData.last_name[0]}`
                        : profileData?.name 
                          ? profileData.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                          : '?'
                      }
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg blur-lg opacity-30 group-hover:opacity-60 transition-all duration-300 animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                {profileData?.first_name && profileData?.last_name && (
                  <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'} transition-colors group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:bg-clip-text group-hover:text-transparent`}>
                    {profileData.first_name} {profileData.last_name}
                  </span>
                )}
                {profileData?.title && (
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} group-hover:text-blue-500 transition-colors`}>
                    {profileData.title}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {['home', 'about', 'skills', 'education', 'experience', 'projects', 'contact'].map((section, index) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`relative capitalize transition-all duration-300 hover:text-blue-500 group font-medium ${
                    activeSection === section 
                      ? 'text-blue-500 font-semibold scale-110' 
                      : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {section}
                  <span className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full ${
                    activeSection === section ? 'w-full' : ''
                  }`}></span>
                  <span className={`absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                    activeSection === section ? 'opacity-100 animate-ping' : ''
                  }`}></span>
                </button>
              ))}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90 ${
                  isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`lg:hidden py-6 ${isDark ? 'bg-gray-800/95' : 'bg-gray-50/95'} backdrop-blur-xl rounded-2xl mb-4 shadow-2xl animate-slideDown border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              {['home', 'about', 'skills', 'education', 'experience', 'projects', 'contact'].map((section, index) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`block w-full text-left px-6 py-4 capitalize transition-all duration-300 hover:translate-x-4 hover:scale-105 ${
                    activeSection === section 
                      ? 'text-blue-500 font-semibold bg-gradient-to-r from-blue-50 to-purple-50 border-r-4 border-blue-500 shadow-lg' 
                      : isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    transform: `translateX(${activeSection === section ? '8px' : '0'})`
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeSection === section ? 'bg-blue-500 animate-pulse' : 'bg-transparent'
                    }`}></div>
                    <span>{section}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 animate-pulse ${isDark ? 'bg-blue-500' : 'bg-blue-200'}`}></div>
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10 animate-pulse ${isDark ? 'bg-purple-500' : 'bg-purple-200'}`} style={{animationDelay: '2s'}}></div>
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5 animate-spin ${isDark ? 'bg-pink-500' : 'bg-pink-200'}`} style={{animationDuration: '20s'}}></div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500 rotate-45 animate-bounce opacity-20"></div>
          <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-purple-500 rounded-full animate-ping opacity-20" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-pink-500 animate-pulse opacity-20" style={{animationDelay: '0.5s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-fadeInUp">
            <div className="mb-16 relative">
              {profileData?.profile_image ? (
                <div className="relative group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 blur-2xl opacity-50 group-hover:opacity-75 transition-all duration-500 animate-pulse"></div>
                  <img 
                    src={getAssetPath(profileData.profile_image)} 
                    alt="Profile"
                    className="relative w-48 h-48 rounded-full mx-auto border-4 border-white shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 transform"
                  />
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-400 animate-spin-slow opacity-30"></div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center animate-bounce">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-all duration-500 animate-pulse"></div>
                  <div className="relative w-48 h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 border-4 border-white">
                    <span className="text-white font-bold text-7xl transform group-hover:scale-110 transition-transform duration-300">
                      {profileData?.first_name?.[0] && profileData?.last_name?.[0] 
                        ? `${profileData.first_name[0]}${profileData.last_name[0]}`
                        : profileData?.name 
                          ? profileData.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                          : '?'
                      }
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-400 animate-spin-slow opacity-30"></div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center animate-bounce">
                    <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Enhanced Name & Title */}
            <div className="mb-12">
              {profileData?.first_name && profileData?.last_name ? (
                <h1 className={`text-6xl md:text-8xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'} tracking-tight`}>
                  <span className="animate-slideInLeft inline-block hover:animate-bounce">
                    {profileData.first_name}
                  </span>{' '}
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-slideInRight inline-block hover:animate-pulse">
                    {profileData.last_name}
                  </span>
                </h1>
              ) : profileData?.name ? (
                <h1 className={`text-6xl md:text-8xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'} tracking-tight`}>
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fadeIn inline-block hover:animate-pulse">
                    {profileData.name}
                  </span>
                </h1>
              ) : (
                <div className={`text-6xl md:text-8xl font-black mb-6 ${isDark ? 'text-gray-500' : 'text-gray-400'} tracking-tight animate-pulse`}>
                  Loading...
                </div>
              )}
              
              <div className="relative">
                {profileData?.title && (
                  <p className={`text-2xl md:text-4xl mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'} font-light animate-fadeIn hover:text-blue-500 transition-colors duration-300 cursor-default`} style={{animationDelay: '0.5s'}}>
                    {profileData.title}
                  </p>
                )}
                
                {/* Typing effect underline */}
                <div className="flex justify-center items-center space-x-4 mb-8">
                  <div className="w-20 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
                  <div className="relative">
                    <FaRocket className="text-blue-500 text-3xl animate-bounce hover:text-purple-500 transition-colors duration-300" />
                    <div className="absolute inset-0 text-blue-500 text-3xl animate-ping opacity-30">
                      <FaRocket />
                    </div>
                  </div>
                  <div className="w-20 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Bio */}
            {profileData?.bio && (
              <p className={`text-xl mb-16 max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'} animate-fadeIn hover:text-gray-300 transition-colors duration-300`} style={{animationDelay: '1s'}}>
                {profileData.bio}
              </p>
            )}

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 animate-fadeIn" style={{animationDelay: '1.5s'}}>
              <button 
                onClick={() => scrollToSection('projects')}
                className="group relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-12 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <FaRocket className="mr-3 group-hover:animate-bounce" />
                  View My Work
                  <FaExternalLinkAlt className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={16} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
              
              <button 
                onClick={() => scrollToSection('contact')}
                className={`group relative border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 p-0.5 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className={`px-12 py-5 rounded-full font-bold text-lg transition-all duration-300 ${
                  isDark ? 'bg-gray-900 text-white hover:bg-transparent' : 'bg-white text-gray-900 hover:bg-transparent hover:text-white'
                }`}>
                  <span className="flex items-center justify-center">
                    <FaEnvelope className="mr-3 group-hover:animate-pulse" />
                    Get In Touch
                    <FaHeart className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-500" size={16} />
                  </span>
                </div>
              </button>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-6 mb-12">
              {profileData?.github_url && (
                <a href={profileData.github_url} target="_blank" rel="noopener noreferrer" 
                   className={`w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all duration-300 hover:scale-110 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <FaGithub size={20} />
                </a>
              )}
              {profileData?.linkedin_url && (
                <a href={profileData.linkedin_url} target="_blank" rel="noopener noreferrer"
                   className={`w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all duration-300 hover:scale-110 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <FaLinkedin size={20} />
                </a>
              )}
              {profileData?.twitter_url && (
                <a href={profileData.twitter_url} target="_blank" rel="noopener noreferrer"
                   className={`w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all duration-300 hover:scale-110 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <FaTwitter size={20} />
                </a>
              )}
              {profileData?.email && (
                <a href={`mailto:${profileData.email}`}
                   className={`w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all duration-300 hover:scale-110 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <FaEnvelope size={20} />
                </a>
              )}
            </div>

            {/* Scroll Indicator */}
            <div className="animate-bounce mt-12">
              <button 
                onClick={() => scrollToSection('about')}
                className={`w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <FaChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-24 relative ${isDark ? 'bg-gray-800' : 'bg-gray-50'} overflow-hidden`}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500`}></div>
          <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-5 ${isDark ? 'bg-blue-400' : 'bg-blue-200'} animate-pulse`}></div>
          <div className={`absolute -bottom-20 -left-20 w-32 h-32 rounded-full opacity-5 ${isDark ? 'bg-purple-400' : 'bg-purple-200'} animate-pulse`} style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              About <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Me</span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-4"></div>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Discover more about my journey, passion, and the drive that powers my work
            </p>
          </div>

          {/* Enhanced Stats Cards */}
          <div id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
            {[
              { 
                icon: HiCollection, 
                label: 'Projects', 
                value: projects.length, 
                color: 'from-blue-500 to-cyan-500',
                description: 'Completed Projects'
              },
              { 
                icon: HiLightningBolt, 
                label: 'Experience', 
                value: experience.length, 
                suffix: ' Years', 
                color: 'from-purple-500 to-pink-500',
                description: 'Years of Experience'
              },
              { 
                icon: HiCode, 
                label: 'Technologies', 
                value: skills.filter(skill => skill.is_active !== false).length, 
                color: 'from-green-500 to-emerald-500',
                description: 'Tech Stack'
              },
              { 
                icon: HiAcademicCap, 
                label: 'Education', 
                value: education.length, 
                color: 'from-orange-500 to-red-500',
                description: 'Degrees & Certificates'
              }
            ].map((stat, index) => (
              <div 
                key={index} 
                className={`group text-center p-8 rounded-3xl backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${
                  isDark ? 'bg-gray-900/50 border border-gray-700 hover:bg-gray-900/70' : 'bg-white/70 border border-gray-200 hover:bg-white/90'
                }`} 
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className={`relative w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  <stat.icon size={32} className="text-white group-hover:animate-bounce" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-all duration-300 animate-pulse`}></div>
                </div>
                <h3 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'} ${animateStats ? 'animate-countUp' : ''} group-hover:text-blue-500 transition-colors duration-300`}>
                  {stat.value}{stat.suffix || ''}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors duration-300`}>
                  {stat.label}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  {stat.description}
                </p>
              </div>
            ))}
          </div>

          {/* Enhanced About Content */}
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h3 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} leading-tight`}>
                {profileData?.about?.title ? (
                  <>
                    {profileData.about.title.split('&')[0]}&
                    <span className="block bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                      {profileData.about.title.split('&')[1]}
                    </span>
                  </>
                ) : (
                  <>
                    Passionate Developer & 
                    <span className="block bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                      Creative Problem Solver
                    </span>
                  </>
                )}
              </h3>
              
              {profileData?.about?.description && (
                <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {profileData.about.description}
                </p>
              )}
              
              {profileData?.about?.highlights && profileData.about.highlights.length > 0 && (
                <div className="space-y-3">
                  <h4 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Key Highlights
                  </h4>
                  <ul className="space-y-2">
                    {profileData.about.highlights.map((highlight, index) => (
                      <li key={index} className={`flex items-center space-x-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Contact Info with enhanced styling */}
              <div className="space-y-6">
                {profileData?.email && (
                  <div className="flex items-center space-x-4 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <FaEnvelope className="text-white" size={20} />
                    </div>
                    <div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Email</p>
                      <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'} font-semibold hover:text-blue-500 transition-colors duration-300`}>
                        {profileData.email}
                      </p>
                    </div>
                  </div>
                )}
                
                {profileData?.location && (
                  <div className="flex items-center space-x-4 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <FaMapMarkerAlt className="text-white" size={20} />
                    </div>
                    <div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Location</p>
                      <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'} font-semibold hover:text-blue-500 transition-colors duration-300`}>
                        {profileData.location}
                      </p>
                    </div>
                  </div>
                )}
                
                {profileData?.phone && (
                  <div className="flex items-center space-x-4 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <FaPhone className="text-white" size={20} />
                    </div>
                    <div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Phone</p>
                      <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'} font-semibold hover:text-blue-500 transition-colors duration-300`}>
                        {profileData.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Enhanced Services Card */}
            <div className="relative">
              <div className={`p-10 rounded-3xl backdrop-blur-sm ${isDark ? 'bg-gray-900/50 border border-gray-700' : 'bg-white/70 border border-gray-200'} shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105`}>
                <h4 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'} text-center`}>
                  What I Do
                </h4>
                <div className="space-y-6">
                  {(profileData?.about?.services || [
                    { 
                      icon: '🎨', 
                      title: 'UI/UX Design', 
                      description: 'Creating beautiful, intuitive user interfaces with modern design principles',
                      color: 'from-pink-500 to-rose-500'
                    },
                    { 
                      icon: '⚡', 
                      title: 'Frontend Development', 
                      description: 'Building responsive, interactive web applications with cutting-edge technologies',
                      color: 'from-blue-500 to-cyan-500'
                    },
                    { 
                      icon: '🛠️', 
                      title: 'Backend Development', 
                      description: 'Developing robust, scalable server-side solutions and APIs',
                      color: 'from-green-500 to-emerald-500'
                    },
                    { 
                      icon: '🚀', 
                      title: 'DevOps & Deployment', 
                      description: 'Optimizing performance and streamlining deployment workflows',
                      color: 'from-purple-500 to-violet-500'
                    }
                  ]).map((item, index) => {
                    // Define colors based on index if not provided in JSON
                    const colors = [
                      'from-pink-500 to-rose-500',
                      'from-blue-500 to-cyan-500', 
                      'from-green-500 to-emerald-500',
                      'from-purple-500 to-violet-500'
                    ];
                    const itemColor = item.color || colors[index % colors.length];
                    
                    return (
                      <div key={index} className="flex items-start space-x-4 group hover:translate-x-2 transition-transform duration-300">
                      <div className={`w-12 h-12 bg-gradient-to-r ${itemColor} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 text-2xl`}>
                        {getServiceIcon(item)}
                      </div>
                      <div className="flex-1">
                        <h5 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-blue-500 transition-colors duration-300 mb-2`}>
                          {item.title}
                        </h5>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                          {item.description || item.desc}
                        </p>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section - Ultra Modern Design */}
      <section id="skills" className={`py-24 relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20' : 'bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50'}`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-10 ${isDark ? 'bg-blue-500' : 'bg-blue-300'} blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 ${isDark ? 'bg-purple-500' : 'bg-purple-300'} blur-3xl animate-pulse`} style={{animationDelay: '2s'}}></div>
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5 ${isDark ? 'bg-pink-500' : 'bg-pink-300'} blur-3xl animate-spin`} style={{animationDuration: '30s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mb-8 shadow-2xl">
              <HiCode className="w-12 h-12 text-white" />
            </div>
            <h2 className={`text-6xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'} tracking-tight`}>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Technical Skills
              </span>
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed font-light`}>
              Technologies and tools I master to build exceptional digital experiences
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>

          {/* Skills Grid - Unified Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {skills.filter(skill => skill.is_active !== false).map((skill, index) => (
              <div 
                key={skill.id || index} 
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${
                  isDark 
                    ? 'bg-gradient-to-br from-gray-800/90 via-gray-700/90 to-gray-800/90 border border-gray-600 hover:border-blue-400' 
                    : 'bg-gradient-to-br from-white/90 via-gray-50/90 to-white/90 border border-gray-200 hover:border-purple-300 shadow-lg'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  transform: skillsInView ? 'translateY(0)' : 'translateY(50px)',
                  opacity: skillsInView ? 1 : 0,
                  transition: `all 0.6s ease ${index * 0.1}s`
                }}
              >
                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getSkillColor(index)} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Skill Content */}
                <div className="relative z-10 p-6">
                  {/* Skill Icon & Name */}
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${getSkillColor(index)} shadow-xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        {getSkillIcon(skill)}
                      </div>
                      {/* Glow effect */}
                      <div className={`absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${getSkillColor(index)} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                    </div>
                    
                    <h4 className={`font-bold text-xl mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    } group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300`}>
                      {skill.name}
                    </h4>
                  </div>

                  {/* Skill Level */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Proficiency
                      </span>
                      <span className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        {formatSkillLevel(skill)}%
                      </span>
                    </div>
                    
                    {/* Enhanced Progress Bar */}
                    <div className={`relative w-full h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden shadow-inner`}>
                      <div 
                        className={`h-4 bg-gradient-to-r ${getSkillColor(index)} rounded-full transition-all duration-1500 ease-out relative shadow-lg`}
                        style={{ 
                          width: skillsInView ? `${formatSkillLevel(skill)}%` : '0%' 
                        }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full transform -skew-x-12 animate-shimmer"></div>
                        
                        {/* Progress glow */}
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Skill Description */}
                  {skill.description && (
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center`}>
                      {skill.description}
                    </p>
                  )}

                  {/* Experience Badge */}
                  <div className="mt-4 flex justify-center">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      formatSkillLevel(skill) >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                      formatSkillLevel(skill) >= 70 ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
                      formatSkillLevel(skill) >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                      'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                    } shadow-lg`}>
                      {formatSkillLevel(skill) >= 90 ? 'EXPERT' :
                       formatSkillLevel(skill) >= 70 ? 'ADVANCED' :
                       formatSkillLevel(skill) >= 50 ? 'INTERMEDIATE' : 'BEGINNER'}
                    </div>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 ease-out"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-12deg); }
            100% { transform: translateX(200%) skewX(-12deg); }
          }
          
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `}</style>
      </section>

      {/* Education Section - Enhanced Modern Design */}
      {education.length > 0 && (
        <section id="education" className={`py-24 relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className={`absolute top-20 left-20 w-96 h-96 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-300'} blur-3xl animate-pulse`}></div>
            <div className={`absolute bottom-20 right-20 w-80 h-80 rounded-full ${isDark ? 'bg-purple-500' : 'bg-purple-300'} blur-3xl animate-pulse`} style={{animationDelay: '2s'}}></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Enhanced Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-8 shadow-2xl">
                <HiAcademicCap className="w-10 h-10 text-white" />
              </div>
              <h2 className={`text-6xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'} tracking-tight`}>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Education
                </span>
              </h2>
              <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed font-light`}>
                My academic journey through knowledge and continuous learning
              </p>
              <div className="mt-8 flex justify-center">
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
            </div>
            
            {/* Timeline Education Cards */}
            <div className="relative">
              {/* Timeline Line */}
              <div className={`absolute left-1/2 transform -translate-x-px w-0.5 h-full ${isDark ? 'bg-gradient-to-b from-blue-500 to-purple-500' : 'bg-gradient-to-b from-blue-400 to-purple-400'} hidden lg:block`}></div>
              
              <div className="space-y-12 lg:space-y-24">
                {education.map((edu, index) => (
                  <div 
                    key={edu.id || index} 
                    className={`relative ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex flex-col lg:flex items-center`}
                    style={{
                      animation: `fadeInUp 0.8s ease-out ${index * 0.3}s both`
                    }}
                  >
                    {/* Timeline Node */}
                    <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 z-20">
                      <div className={`w-6 h-6 rounded-full border-4 ${isDark ? 'bg-gray-900 border-blue-500' : 'bg-white border-purple-500'} shadow-xl`}>
                        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-400' : 'bg-purple-500'} m-0.5 animate-pulse`}></div>
                      </div>
                    </div>

                    {/* Education Card */}
                    <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                      <div className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                        isDark 
                          ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600 hover:border-blue-400' 
                          : 'bg-gradient-to-br from-white via-blue-50 to-white border border-gray-200 hover:border-purple-300 shadow-lg'
                      }`}>
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Card Content */}
                        <div className="relative z-10 p-8">
                          {/* Header with Icon and Status */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-4">
                              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                                isDark 
                                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg' 
                                  : 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg'
                              } group-hover:scale-110 transition-transform duration-300`}>
                                {getEducationIcon(edu)}
                              </div>
                              {edu.current && (
                                <div className={`px-4 py-2 rounded-full text-xs font-bold ${
                                  isDark 
                                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg' 
                                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                                } animate-pulse`}>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                    <span>CURRENT</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Year Badge */}
                            <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
                              isDark ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-gray-100 text-gray-700 border border-gray-200'
                            } backdrop-blur-sm`}>
                              {edu.startDate?.split('-')[0]} - {edu.endDate?.split('-')[0] || 'Present'}
                            </div>
                          </div>

                          {/* Degree Title */}
                          <h3 className={`text-2xl lg:text-3xl font-black mb-3 ${
                            isDark ? 'text-white' : 'text-gray-900'
                          } group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300`}>
                            {edu.degree}
                          </h3>

                          {/* Institution */}
                          <div className={`text-lg font-semibold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'} flex items-center space-x-2`}>
                            <BiLocationPlus className="w-5 h-5" />
                            <span>{edu.institution}</span>
                          </div>

                          {/* Description */}
                          {edu.description && (
                            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 leading-relaxed text-base`}>
                              {edu.description}
                            </p>
                          )}

                          {/* GPA Badge */}
                          {edu.gpa && (
                            <div className="mb-6">
                              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl ${
                                isDark 
                                  ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30' 
                                  : 'bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200'
                              } backdrop-blur-sm`}>
                                <HiStar className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                                <span className={`font-bold text-sm ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                                  GPA: {edu.gpa}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Achievements */}
                          {edu.achievements && edu.achievements.length > 0 && (
                            <div className="space-y-3">
                              <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'} flex items-center space-x-2`}>
                                <HiStar className="w-5 h-5 text-yellow-500" />
                                <span>Key Achievements</span>
                              </h4>
                              <div className="space-y-2">
                                {edu.achievements.map((achievement, achievementIndex) => (
                                  <div 
                                    key={achievementIndex} 
                                    className={`flex items-start space-x-3 p-3 rounded-lg ${
                                      isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                                    } transition-colors duration-200 group/achievement`}
                                  >
                                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0 group-hover/achievement:animate-pulse"></div>
                                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed`}>
                                      {achievement}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Institution Logo */}
                          {edu.institution_logo && (
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex justify-center">
                                <img 
                                  src={edu.institution_logo} 
                                  alt={`${edu.institution} logo`}
                                  className="w-20 h-20 object-contain rounded-xl shadow-lg hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Subtle Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 ease-out"></div>
                      </div>
                    </div>

                    {/* Empty space for the other side in timeline */}
                    <div className="hidden lg:block w-5/12"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add custom animation keyframes */}
          <style jsx>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </section>
      )}

      {/* Experience Section - Ultra Modern Timeline Design */}
      <section id="experience" className={`py-24 relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-gray-900 via-indigo-900/20 to-purple-900/20' : 'bg-gradient-to-br from-white via-indigo-50/50 to-purple-50/50'}`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 ${isDark ? 'bg-indigo-500' : 'bg-indigo-300'} blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full opacity-10 ${isDark ? 'bg-purple-500' : 'bg-purple-300'} blur-3xl animate-pulse`} style={{animationDelay: '2s'}}></div>
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5 ${isDark ? 'bg-pink-500' : 'bg-pink-300'} blur-3xl animate-spin`} style={{animationDuration: '40s'}}></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 mb-8 shadow-2xl">
              <FaBriefcase className="w-12 h-12 text-white" />
            </div>
            <h2 className={`text-6xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'} tracking-tight`}>
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Work Experience
              </span>
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed font-light`}>
              My professional journey through innovation and continuous growth
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"></div>
            </div>
          </div>

          {/* Professional Timeline */}
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className={`absolute left-1/2 transform -translate-x-px w-0.5 h-full ${isDark ? 'bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500' : 'bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400'} hidden lg:block`}></div>
            
            <div className="space-y-16 lg:space-y-24">
              {experience.map((exp, index) => (
                <div 
                  key={exp.id || index} 
                  className={`relative ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex flex-col lg:flex items-center`}
                  style={{
                    animation: `fadeInUp 0.8s ease-out ${index * 0.3}s both`
                  }}
                >
                  {/* Timeline Node */}
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 z-20">
                    <div className={`w-8 h-8 rounded-full border-4 ${isDark ? 'bg-gray-900 border-indigo-500' : 'bg-white border-purple-500'} shadow-2xl relative`}>
                      <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-purple-500'} m-0.5 animate-pulse`}></div>
                      {/* Pulsing ring */}
                      <div className={`absolute inset-0 rounded-full border-2 ${isDark ? 'border-indigo-400' : 'border-purple-400'} animate-ping opacity-20`}></div>
                    </div>
                  </div>

                  {/* Experience Card */}
                  <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <div className={`group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                      isDark 
                        ? 'bg-gradient-to-br from-gray-800/90 via-gray-700/90 to-gray-800/90 border border-gray-600 hover:border-indigo-400' 
                        : 'bg-gradient-to-br from-white/90 via-indigo-50/90 to-white/90 border border-gray-200 hover:border-purple-300 shadow-xl'
                    }`}>
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Card Content */}
                      <div className="relative z-10 p-8">
                        {/* Header with Company Logo and Status */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            {exp.company_logo && (
                              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                                isDark 
                                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg' 
                                  : 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg'
                              } group-hover:scale-110 transition-transform duration-300 p-2`}>
                                <img 
                                  src={exp.company_logo} 
                                  alt={`${exp.company} logo`}
                                  className="w-full h-full object-contain filter brightness-0 invert"
                                />
                              </div>
                            )}
                            {exp.current && (
                              <div className={`px-4 py-2 rounded-full text-xs font-bold ${
                                isDark 
                                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg' 
                                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                              } animate-pulse`}>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                  <span>CURRENT</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Duration Badge */}
                          <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
                            isDark ? 'bg-gray-700/80 text-gray-300 border border-gray-600' : 'bg-gray-100/80 text-gray-700 border border-gray-200'
                          } backdrop-blur-sm`}>
                            {(() => {
                              const start = new Date(exp.start_date);
                              const end = exp.end_date ? new Date(exp.end_date) : new Date();
                              const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                              return months >= 12 ? `${Math.floor(months/12)}y ${months%12}m` : `${months}m`;
                            })()}
                          </div>
                        </div>

                        {/* Position Title */}
                        <h3 className={`text-2xl lg:text-3xl font-black mb-3 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        } group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300`}>
                          {exp.position}
                        </h3>

                        {/* Company & Location */}
                        <div className="space-y-2 mb-6">
                          <div className={`text-lg font-semibold ${isDark ? 'text-indigo-400' : 'text-indigo-600'} flex items-center space-x-2`}>
                            <FaBriefcase className="w-5 h-5" />
                            <span>{exp.company}</span>
                          </div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-center space-x-2`}>
                            <BiLocationPlus className="w-4 h-4" />
                            <span>{exp.location}</span>
                          </div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-center space-x-2`}>
                            <MdDateRange className="w-4 h-4" />
                            <span>
                              {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {' '}
                              {exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 leading-relaxed text-base`}>
                          {exp.description}
                        </p>

                        {/* Technologies Used */}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="mb-6">
                            <h5 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center space-x-2`}>
                              <HiCode className="w-5 h-5 text-indigo-500" />
                              <span>Technologies</span>
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {exp.technologies.map((tech, techIndex) => (
                                <span 
                                  key={techIndex}
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    isDark ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                  } hover:scale-105 transition-transform duration-200`}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Key Achievements */}
                        {exp.achievements && exp.achievements.length > 0 && (
                          <div className="space-y-3">
                            <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'} flex items-center space-x-2`}>
                              <HiStar className="w-5 h-5 text-yellow-500" />
                              <span>Key Achievements</span>
                            </h4>
                            <div className="space-y-3">
                              {exp.achievements.map((achievement, achievementIndex) => (
                                <div 
                                  key={achievementIndex} 
                                  className={`flex items-start space-x-4 p-4 rounded-xl ${
                                    isDark ? 'bg-gray-700/50 hover:bg-gray-700/70' : 'bg-gray-50 hover:bg-gray-100'
                                  } transition-all duration-200 group/achievement border-l-4 ${
                                    isDark ? 'border-indigo-500' : 'border-purple-500'
                                  }`}
                                >
                                  <div className={`w-3 h-3 rounded-full ${
                                    isDark ? 'bg-indigo-400' : 'bg-purple-500'
                                  } mt-1.5 flex-shrink-0 group-hover/achievement:animate-pulse`}></div>
                                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed flex-1`}>
                                    {achievement}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Subtle Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 ease-out"></div>
                    </div>
                  </div>

                  {/* Empty space for the other side in timeline */}
                  <div className="hidden lg:block w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Animation Styles */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </section>

      {/* Projects Section */}
      <section id="projects" className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Featured Projects
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Some of the projects I've worked on recently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.id || index} 
                className={`group rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 ${
                  isDark ? 'bg-gray-900/50 border border-gray-700 hover:border-blue-500' : 'bg-white/70 border border-gray-200 hover:border-blue-300'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  transform: projectsInView ? 'translateY(0)' : 'translateY(50px)',
                  opacity: projectsInView ? 1 : 0,
                  transition: `all 0.6s ease ${index * 0.1}s`
                }}
              >
                <div className={`h-56 bg-gradient-to-r ${getProjectGradient(index)} relative overflow-hidden`}>
                  {project.image_url ? (
                    <img 
                      src={getAssetPath(project.image_url)} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white relative">
                      <FaCode size={48} className="group-hover:scale-125 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  )}
                  
                  {/* Enhanced Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md border transition-all duration-300 hover:scale-110 hover:shadow-xl ${
                      project.status === 'Completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400/30 shadow-green-500/25' : 
                      project.status === 'In Progress' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400/30 shadow-blue-500/25' :
                      project.status === 'Coming Soon' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400/30 shadow-purple-500/25' :
                      'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400/30 shadow-gray-500/25'
                    } shadow-lg group/badge`}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          project.status === 'Completed' ? 'bg-green-200 animate-pulse' :
                          project.status === 'In Progress' ? 'bg-blue-200 animate-ping' :
                          project.status === 'Coming Soon' ? 'bg-purple-200 animate-pulse' :
                          'bg-gray-200'
                        }`}></div>
                        <span className="uppercase tracking-wider font-extrabold">
                          {project.status || 'Completed'}
                        </span>
                      </div>
                      {/* Shine effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/badge:opacity-100 group-hover/badge:animate-pulse transition-opacity duration-300"></div>
                    </div>
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex space-x-3">
                        {project.github_url && (
                          <a 
                            href={project.github_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 text-sm font-medium"
                          >
                            <FaGithub size={16} />
                            <span>Code</span>
                          </a>
                        )}
                        {project.demo_url && (
                          <a 
                            href={project.demo_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 bg-blue-500/80 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-blue-500 transition-all duration-300 text-sm font-medium"
                          >
                            <FaExternalLinkAlt size={14} />
                            <span>Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className={`font-bold text-2xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-blue-500 transition-colors duration-300`}>
                    {project.title}
                  </h3>
                  
                  <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed line-clamp-3`}>
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(project.technologies || project.tech || []).map((tech, techIndex) => (
                      <span 
                        key={techIndex} 
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isDark ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-100 text-gray-700 border border-gray-200'
                        } hover:scale-105 transition-transform duration-200`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Project Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FaStar className="inline mr-1 text-yellow-500" />
                        Featured
                      </span>
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        2024
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {project.github_url && (
                        <a 
                          href={project.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`w-8 h-8 rounded-full ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} flex items-center justify-center transition-colors duration-200`}
                        >
                          <FaGithub size={16} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                        </a>
                      )}
                      {project.demo_url && (
                        <a 
                          href={project.demo_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors duration-200"
                        >
                          <FaExternalLinkAlt size={14} className="text-white" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Let's Work Together
          </h2>
          
          <p className={`text-lg mb-12 ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            I'm always interested in new opportunities and exciting projects. 
            Let's discuss how we can bring your ideas to life!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300`}>
              <FaEnvelope className="text-3xl text-blue-500 mx-auto mb-4" />
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Email</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {profileData?.email}
              </p>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300`}>
              <BiLocationPlus className="text-3xl text-green-500 mx-auto mb-4" />
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Location</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {profileData?.location}
              </p>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300`}>
              <MdPhone className="text-3xl text-purple-500 mx-auto mb-4" />
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Phone</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {profileData?.phone}
              </p>
            </div>
          </div>

          {profileData?.email && (
            <button 
              onClick={() => window.location.href = `mailto:${profileData.email}`}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center"
            >
              <MdEmail className="mr-3" />
              Send Message
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 border-t ${isDark ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-600'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 {profileData?.first_name || 'Nguyen Quoc'} {profileData?.last_name || 'Vi'}. All rights reserved.</p>
          <p className="mt-2 text-sm">Built with React, Django, and lots of ☕</p>
          <p className="mt-1 text-xs opacity-70">
            Data updates every 30 seconds • Last updated: {lastUpdated?.toLocaleTimeString() || 'Loading...'}
          </p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={() => scrollToSection('home')}
        className={`fixed bottom-6 right-6 z-30 group transform transition-all duration-500 ${
          scrolled ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-0'
        }`}
        title="Back to Top"
      >
        <div className="relative">
          <div className={`w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${
            isDark ? 'backdrop-blur-xl border border-white/10' : 'backdrop-blur-xl border border-black/10'
          }`}>
            <FaArrowUp className="text-white text-lg group-hover:animate-bounce transition-transform duration-300" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-all duration-300 animate-pulse"></div>
          
          {/* Floating ring animation */}
          <div className="absolute inset-0 rounded-2xl border-2 border-white/30 group-hover:scale-125 group-hover:opacity-0 transition-all duration-500"></div>
          
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
        </div>
      </button>
    </div>
  )
}

export default DynamicPortfolio
