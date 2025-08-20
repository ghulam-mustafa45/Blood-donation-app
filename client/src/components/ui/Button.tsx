import { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export default function Button({ className = '', variant = 'primary', ...props }: Props) {
  const base = 'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'
  const styles = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900',
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-200',
  }[variant]

  return <button className={`${base} ${styles} ${className}`} {...props} />
}


