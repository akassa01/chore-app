// Enhanced theme configurations for each user
export interface UserTheme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    card: string
    border: string
    text: string
    muted: string
  }
  logo?: string
  description: string
  welcomeEmoji?: string
  // New properties for unique styling
  themeClass: string
  fontFamily: string
  backgroundImage?: string
  cardStyle: 'default' | 'hockey' | 'cave' | 'restaurant' | 'peru'
  buttonStyle: 'default' | 'sporty' | 'gothic' | 'neon' | 'cultural'
}

export const userThemes: Record<string, UserTheme> = {
  'Default': {
    name: 'Chore App',
    colors: {
      primary: '#3B82F6', // Simple blue
      secondary: '#6B7280', // Gray
      accent: '#F3F4F6', // Light gray
      background: '#FFFFFF', // White background
      card: '#FFFFFF', // White cards
      border: '#E5E7EB', // Light border
      text: '#111827', // Dark text
      muted: '#6B7280', // Gray muted text
    },
    logo: '🏠',
    description: 'Choose your profile to get started',
    welcomeEmoji: '',
    themeClass: 'default-theme',
    fontFamily: "'Inter', sans-serif",
    backgroundImage: "",
    cardStyle: 'default',
    buttonStyle: 'default'
  },
  'Arman': {
    name: 'Vancouver Canucks',
    colors: {
      primary: '#008752', // Canucks Green
      secondary: '#001F5B', // Canucks Blue
      accent: '#E8F5E8', // Light green accent
      background: '#F0F8F0', // Ice rink inspired background
      card: '#FFFFFF', // White cards like ice
      border: '#008752', // Green borders
      text: '#001F5B', // Canucks blue text
      muted: '#4A5568', // Darker muted text
    },
    logo: '🏒',
    description: 'Go Canucks Go!',
    welcomeEmoji: '🇨🇦',
    themeClass: 'hockey-theme',
    fontFamily: "'Rajdhani', 'Impact', sans-serif", // Sporty, bold font
    backgroundImage: "linear-gradient(135deg, #F0F8F0 0%, #E8F5E8 50%, #FFFFFF 100%), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" opacity=\"0.03\"><path d=\"M50 10 L90 50 L50 90 L10 50 Z\" fill=\"%23008752\"/></svg>')",
    cardStyle: 'hockey',
    buttonStyle: 'sporty'
  },
  'Lucas': {
    name: 'Shake Shack',
    colors: {
      primary: '#00FF41', // Shake Shack Neon Green
      secondary: '#FF6B35', // Orange accent like fries
      accent: '#2D2D2D', // Dark gray
      background: '#1A1A1A', // Dark restaurant background
      card: '#2D2D2D', // Dark cards like menu boards
      border: '#00FF41', // Neon green borders
      text: '#FFFFFF', // White text
      muted: '#CCCCCC', // Light muted text
    },
    logo: '🍔',
    description: 'Cheese Fries >>>',
    welcomeEmoji: '🍟',
    themeClass: 'restaurant-theme',
    fontFamily: "'Fredoka One', 'Comic Sans MS', cursive", // Fun, rounded font
    backgroundImage: "linear-gradient(45deg, #1A1A1A 25%, #2D2D2D 25%, #2D2D2D 50%, #1A1A1A 50%, #1A1A1A 75%, #2D2D2D 75%, #2D2D2D), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 50 50\" opacity=\"0.05\"><circle cx=\"25\" cy=\"25\" r=\"20\" fill=\"%2300FF41\"/></svg>')",
    cardStyle: 'restaurant',
    buttonStyle: 'neon'
  },
  'Shanmugam': {
    name: 'Batman',
    colors: {
      primary: '#FFD700', // Batman Gold
      secondary: '#4A4A4A', // Dark gray
      accent: '#2D2D2D', // Darker gray
      background: '#0A0A0A', // Cave black
      card: '#1A1A1A', // Dark cave cards
      border: '#FFD700', // Gold borders
      text: '#FFFFFF', // White text
      muted: '#AAAAAA', // Light gray for muted
    },
    logo: '🦇',
    description: 'I am Batman',
    welcomeEmoji: '🦸🏾',
    themeClass: 'cave-theme',
    fontFamily: "'Creepster', 'Chiller', fantasy", // Gothic, mysterious font
    backgroundImage: "radial-gradient(ellipse at center, #1A1A1A 0%, #0A0A0A 70%, #000000 100%), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" opacity=\"0.02\"><path d=\"M20 80 Q30 60 40 80 Q50 60 60 80 Q70 60 80 80\" stroke=\"%23FFD700\" stroke-width=\"2\" fill=\"none\"/></svg>')",
    cardStyle: 'cave',
    buttonStyle: 'gothic'
  },
  'Alejandro': {
    name: 'Peru',
    colors: {
      primary: '#DC143C', // Peruvian Red
      secondary: '#FFD700', // Inca Gold
      accent: '#FFF5F5', // Light red tint
      background: '#FDF2E9', // Warm sand background
      card: '#FFFFFF', // White cards
      border: '#DC143C', // Red borders
      text: '#8B4513', // Brown text like earth
      muted: '#A0522D', // Darker brown for muted
    },
    logo: '🇵🇪',
    description: '¡Viva Perú!',
    welcomeEmoji: '🦙',
    themeClass: 'peru-theme',
    fontFamily: "'Dancing Script', 'Brush Script MT', cursive", // Cultural, flowing font
    backgroundImage: "linear-gradient(120deg, #FDF2E9 0%, #F4E4BC 25%, #FDF2E9 50%, #E6D3A3 75%, #FDF2E9 100%), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" opacity=\"0.03\"><path d=\"M10 50 Q25 30 40 50 Q55 30 70 50 Q85 30 100 50\" stroke=\"%23DC143C\" stroke-width=\"2\" fill=\"none\"/></svg>')",
    cardStyle: 'peru',
    buttonStyle: 'cultural'
  }
}

export function getUserTheme(userName: string): UserTheme {
  return userThemes[userName] || userThemes['Default']
}

export function applyUserTheme(userName: string): void {
  const theme = getUserTheme(userName)
  
  // Ensure DOM is available
  if (typeof document === 'undefined') return
  
  // Apply CSS custom properties to the document root
  const root = document.documentElement
  root.style.setProperty('--primary', theme.colors.primary)
  root.style.setProperty('--secondary', theme.colors.secondary)
  root.style.setProperty('--accent', theme.colors.accent)
  root.style.setProperty('--background', theme.colors.background)
  root.style.setProperty('--card', theme.colors.card)
  root.style.setProperty('--border', theme.colors.border)
  root.style.setProperty('--text', theme.colors.text)
  root.style.setProperty('--muted', theme.colors.muted)
  
  // Apply theme-specific styling
  root.style.setProperty('--theme-font', theme.fontFamily)
  if (theme.backgroundImage) {
    root.style.setProperty('--theme-background-image', theme.backgroundImage)
  }
  
  // Remove existing theme classes from body
  const themeClasses = ['default-theme', 'hockey-theme', 'restaurant-theme', 'cave-theme', 'peru-theme']
  themeClasses.forEach(className => {
    document.body.classList.remove(className)
  })
  
  // Add new theme class to body
  document.body.classList.add(theme.themeClass)
  
  // Update theme color for PWA
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme.colors.primary)
  } else {
    // Create meta theme-color if it doesn't exist
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = theme.colors.primary
    document.head.appendChild(meta)
  }
}