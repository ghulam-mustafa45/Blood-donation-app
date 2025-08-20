import { InputHTMLAttributes, forwardRef } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, Props>(function Input({ label, error, className = '', ...props }, ref) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input ref={ref} className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${className}`} {...props} />
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  )
})

export default Input


