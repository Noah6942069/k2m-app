"use client"

import './StarBorder.css'

interface StarBorderProps {
  as?: React.ElementType
  className?: string
  color?: string
  speed?: string
  children: React.ReactNode
  [key: string]: any
}

const StarBorder = ({
  as: Component = 'button',
  className = '',
  color = '#4a2d8a',
  speed = '4s',
  children,
  ...rest
}: StarBorderProps) => {
  return (
    <Component
      className={`star-border-container ${className}`}
      {...rest}
    >
      <div
        className="star-glow"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, ${color} 10%, transparent 20%, transparent 100%)`,
          animationDuration: speed
        }}
      />
      <div className="star-inner">{children}</div>
    </Component>
  )
}

export default StarBorder
