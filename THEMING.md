# Personalized Theming System

The Chore Tracker app now features personalized dashboards for each user with unique themes based on their interests and preferences.

## 🎨 Available Themes

### Arman - Vancouver Canucks Theme
- **Colors**: Canucks Green (#008752) and Canucks Blue (#001F5B)
- **Logo**: 🏒 Hockey stick emoji
- **Description**: "Go Canucks Go!"
- **Style**: Professional sports theme with team colors

### Lucas - Shake Shack Theme
- **Colors**: Shake Shack Orange (#FF6B35) and Dark Gray (#2C3E50)
- **Logo**: 🍔 Burger emoji
- **Description**: "Shake Shack Style"
- **Style**: Food and restaurant branding colors

### Shanmugam - Batman Theme
- **Colors**: Batman Black (#000000) and Batman Gold (#FFD700)
- **Logo**: 🦇 Bat emoji
- **Description**: "I am Batman"
- **Style**: Dark theme with gold accents

### Alejandro - Default Theme
- **Colors**: Standard blue (#3B82F6) and gray (#6B7280)
- **Logo**: 🏠 House emoji
- **Description**: "Clean & Simple"
- **Style**: Clean, professional default theme

## 🛠️ Technical Implementation

### Theme Configuration
Themes are defined in `lib/themes.ts` with the following structure:

```typescript
interface UserTheme {
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
}
```

### CSS Custom Properties
Themes are applied using CSS custom properties:

```css
:root {
  --user-primary: #3B82F6;
  --user-secondary: #6B7280;
  --user-accent: #F3F4F6;
  --user-background: #FFFFFF;
  --user-card: #FFFFFF;
  --user-border: #E5E7EB;
  --user-text: #111827;
  --user-muted: #6B7280;
}
```

### Theme Utility Classes
The app includes utility classes for easy theming:

- `.theme-primary` - Primary color text
- `.theme-primary-bg` - Primary color background
- `.theme-secondary` - Secondary color text
- `.theme-secondary-bg` - Secondary color background
- `.theme-accent` - Accent background
- `.theme-background` - Main background
- `.theme-card` - Card styling
- `.theme-text` - Main text color
- `.theme-muted` - Muted text color
- `.theme-border` - Border color

## 🎯 How It Works

1. **User Login**: When a user logs in, their name is used to determine their theme
2. **Theme Application**: The `ThemeProvider` component applies the appropriate theme
3. **Dynamic Styling**: CSS custom properties are updated to reflect the user's theme
4. **PWA Integration**: The theme color is also updated for the PWA manifest

## 🔧 Adding New Themes

To add a new theme for a user:

1. **Update `lib/themes.ts`**:
```typescript
'NewUser': {
  name: 'Theme Name',
  colors: {
    primary: '#YOUR_PRIMARY_COLOR',
    secondary: '#YOUR_SECONDARY_COLOR',
    // ... other colors
  },
  logo: '🎯',
  description: 'Theme description'
}
```

2. **Add user to database**:
```sql
INSERT INTO users (name) VALUES ('NewUser');
```

3. **Test the theme** by logging in as the new user

## 🎨 Color Guidelines

When creating new themes, consider:

- **Accessibility**: Ensure sufficient contrast between text and background colors
- **Brand Consistency**: Use authentic colors from the source material
- **Readability**: Test the theme in different lighting conditions
- **Mobile Optimization**: Ensure colors work well on mobile devices

## 🚀 Features

### Personalized Elements
- **Dashboard Header**: Shows user's theme logo and description
- **Color Scheme**: All UI elements adapt to the user's theme
- **Progress Bars**: Use theme primary color
- **Cards and Borders**: Match theme styling
- **Navigation**: Themed navbar and buttons

### Responsive Design
- All themes work seamlessly on mobile and desktop
- PWA theme color updates automatically
- Smooth transitions between theme elements

### Performance
- Themes are applied client-side for instant switching
- No additional server requests required
- Minimal impact on app performance

## 🎉 User Experience

Each user gets a completely personalized experience:

- **Arman**: Feels like using a Canucks-branded app
- **Lucas**: Shake Shack-inspired interface
- **Shanmugam**: Dark Batman-themed dashboard
- **Alejandro**: Clean, professional default theme

The theming system makes the app feel more personal and engaging for each user while maintaining full functionality across all themes.
