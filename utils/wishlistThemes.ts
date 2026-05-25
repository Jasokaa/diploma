import type { CSSProperties } from 'vue'
import type { WishlistTheme } from '~/types/wishlist'

export interface WishlistThemeOption {
  key: WishlistTheme
  label: string
  primary: string
  secondary: string
}

export const wishlistThemeOptions: WishlistThemeOption[] = [
  {
    key: 'standard',
    label: 'Standard',
    primary: '#EBEBEB',
    secondary: '#A6A6A6'
  },
  {
    key: 'lime_bloom',
    label: 'Lime Bloom',
    primary: '#D9F497',
    secondary: '#90AF41'
  },
  {
    key: 'sage_light',
    label: 'Sage Light',
    primary: '#C7F6A8',
    secondary: '#5C7E46'
  },
  {
    key: 'aqua_mint',
    label: 'Aqua Mint',
    primary: '#BDF8F1',
    secondary: '#4CA096'
  },
  {
    key: 'lavender_mist',
    label: 'Lavender Mist',
    primary: '#DDC9F9',
    secondary: '#926FC6'
  },
  {
    key: 'rose_glow',
    label: 'Rose Glow',
    primary: '#FFCAE5',
    secondary: '#E56AA4'
  }
]

export const getWishlistTheme = (themeKey?: string | null): WishlistThemeOption => {
  return wishlistThemeOptions.find((theme) => theme.key === themeKey) || wishlistThemeOptions[0]
}

export const getWishlistThemeStyle = (themeKey?: string | null): CSSProperties => {
  const theme = getWishlistTheme(themeKey)

  return {
    '--wishlist-theme-primary': theme.primary,
    '--wishlist-theme-secondary': theme.secondary,
    '--wishlist-theme-soft': `${theme.primary}66`
  } as CSSProperties
}
