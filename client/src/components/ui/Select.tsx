import { SelectHTMLAttributes, forwardRef } from 'react'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string
}

const Select = forwardRef<HTMLSelectElement, Props>(function Select({ label, error, className = '', children, ...props }, ref) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select ref={ref} className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${className}`} {...props}>
        {children}
      </select>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  )
})

export default Select


