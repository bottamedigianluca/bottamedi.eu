import React from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import '../index.css'
import Site from './Site'

const el = document.getElementById('root')
if (!el) throw new Error('root mancante')

createRoot(el).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <Site />
    </MotionConfig>
  </React.StrictMode>
)
