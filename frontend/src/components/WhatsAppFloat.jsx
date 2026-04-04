import { useState, useRef } from 'react'

export default function WhatsAppFloat() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 })

  const onPointerDown = (e) => {
    setIsDragging(true)
    dragRef.current.startX = e.clientX
    dragRef.current.startY = e.clientY
    dragRef.current.startPosX = pos.x
    dragRef.current.startPosY = pos.y
    e.target.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!isDragging) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setPos({ x: dragRef.current.startPosX + dx, y: dragRef.current.startPosY + dy })
  }

  const onPointerUp = (e) => {
    setIsDragging(false)
    e.target.releasePointerCapture(e.pointerId)
  }

  return (
    <a href="https://wa.me/2348000000000?text=Hello%20Adekunle%20TV!%20I%20want%20to%20order%20a%20jersey."
      target="_blank" rel="noopener noreferrer"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={`wa-float ${isDragging ? 'dragging' : ''}`}
      aria-label="Chat on WhatsApp"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px) ${isDragging ? 'scale(1.05)' : ''}`,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        background: 'linear-gradient(135deg, var(--red), var(--red-dark))',
        boxShadow: '0 8px 32px rgba(232,0,30,0.5)',
        animation: isDragging ? 'none' : 'pulse-red 2.5s infinite',
        border: 'none'
      }}
      onClick={(e) => {
        // Prevent click if there was a substantial drag
        if (Math.abs(pos.x - dragRef.current.startPosX) > 5 || Math.abs(pos.y - dragRef.current.startPosY) > 5) {
           e.preventDefault()
        }
      }}
    >
      💬
    </a>
  )
}