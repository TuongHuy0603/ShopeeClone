import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState, useId } from 'react'
import { FloatingPortal, arrow, offset, shift, useFloating } from '@floating-ui/react-dom-interactions'
interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
}
export default function Popover({ children, renderPopover, className }: Props) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const arrowRef = useRef<HTMLElement>(null)
  const { x, y, reference, floating, strategy, middlewareData } = useFloating({
    middleware: [offset(6), shift(), arrow({ element: arrowRef })],
    placement: "bottom-end"
  })
  const hidePopover = () => {
    setOpen(false)
  }
  const showPopover = () => {
    setOpen(true)
  }

  return (
    <div className={className} ref={reference} onMouseLeave={hidePopover} onMouseEnter={showPopover} >
      {children}
      <FloatingPortal id={id}>
        <AnimatePresence >
          {open && (
            <motion.div ref={floating} style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content',
              transformOrigin: `${middlewareData.arrow?.x}px top`
            }} initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}>
              <span ref={arrowRef} className='border-x-transparent border-t-transparent border-b-white border-[11px] absolute translate-y-[-99%] z-[95%]' style={{
                left: middlewareData.arrow?.x,
                right: middlewareData.arrow?.y,
              }} />
              {renderPopover}
            </motion.div>)}
        </AnimatePresence>
      </FloatingPortal>
    </div>

  )
}
