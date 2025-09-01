// Theme configurations for each user
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
}

export const userThemes: Record<string, UserTheme> = {
  'Arman': {
    name: 'Vancouver Canucks',
    colors: {
      primary: '#008752', // Canucks Green
      secondary: '#001F5B', // Canucks Blue
      accent: '#FFFFFF', // White
      background: '#F8FAFC', // Light gray background
      card: '#FFFFFF', // White cards
      border: '#E2E8F0', // Light border
      text: '#1A202C', // Dark text
      muted: '#718096', // Muted text
    },
    logo: '🏒',
    description: 'Go Canucks Go!',
    welcomeEmoji: '🇨🇦'
  },
  'Lucas': {
    name: 'Shake Shack',
    colors: {
      primary: '#FF6B35', // Shake Shack Orange
      secondary: '#2C3E50', // Dark gray
      accent: '#F39C12', // Golden yellow
      background: '#FEFEFE', // Off-white background
      card: '#FFFFFF', // White cards
      border: '#E8E8E8', // Light border
      text: '#2C3E50', // Dark text
      muted: '#7F8C8D', // Muted text
    },
    logo: '🍔',
    description: 'Cheese Fries >>>',
    welcomeEmoji: '🍟'
  },
  'Shanmugam': {
    name: 'Batman',
    colors: {
      primary: '#000000', // Batman Black
      secondary: '#FFD700', // Batman Gold
      accent: '#1A1A1A', // Dark gray
      background: '#0A0A0A', // Very dark background
      card: '#1A1A1A', // Dark cards
      border: '#333333', // Dark border
      text: '#FFFFFF', // White text
      muted: '#CCCCCC', // Light muted text
    },
    logo: '🦇',
    description: 'I am Batman',
    welcomeEmoji: '🦸🏾'
  },
  'Alejandro': {
    name: 'Peru',
    colors: {
      primary: '#DC143C', // Peruvian Red
      secondary: '#DC143C', // Peruvian Red for secondary elements
      accent: '#FFF5F5', // Light red tint
      background: '#FFFFFF', // White background
      card: '#FFFFFF', // White cards
      border: '#FFE4E4', // Light red border
      text: '#1A202C', // Dark text
      muted: '#6B7280', // Gray for muted text
    },
    logo: '🇵🇪',
    description: '¡Viva Perú!',
    welcomeEmoji: '🦙'
  }
}

export function getUserTheme(userName: string): UserTheme {
  return userThemes[userName] || userThemes['Alejandro']
}

export function applyUserTheme(userName: string): void {
  const theme = getUserTheme(userName)
  
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
  
  // Update theme color for PWA
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme.colors.primary)
  }
}
