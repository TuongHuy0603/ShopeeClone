/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { InputHTMLAttributes, forwardRef } from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'
import { ref } from 'yup'
export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: RegisterOptions
  placeholder?: string
  ref?: string
}
const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(({ type, errorMessage, className, classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm', classNameError = "mt-1 text-red-600 min-h-[1.25rem] text-sm", onChange, ...rest }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    //check number
    if ((/^\d+$/.test(value) || value === '') && onChange) {
      onChange(e)
    }
  }
  return (
    <div className={className} >
      <input className={classNameInput} onChange={handleChange} {...rest} ref={ref} />
      <div className={classNameError}>
        {errorMessage}
      </div>
    </div>
  )
})

export default InputNumber
