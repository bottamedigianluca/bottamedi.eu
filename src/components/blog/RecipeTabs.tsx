import React, { useState, isValidElement, Children } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface RecipeProps {
  name: string
  prep?: string
  cook?: string
  servings?: string | number
  category?: string
  children: React.ReactNode
}

export const Recipe: React.FC<RecipeProps> = ({ children }) => <>{children}</>

interface RecipeTabsProps {
  children: React.ReactNode
}

export const RecipeTabs: React.FC<RecipeTabsProps> = ({ children }) => {
  const recipes = Children.toArray(children).filter((child): child is React.ReactElement<RecipeProps> =>
    isValidElement(child) && (child.type === Recipe || (typeof child.type === 'function' && (child.type as React.FC).displayName === 'Recipe'))
  )
  const [active, setActive] = useState(0)

  if (recipes.length === 0) return null

  const current = recipes[active]
  const meta = current.props

  return (
    <section className="my-10 rounded-2xl border border-green-100 bg-white shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-white px-5 py-4 border-b border-green-100">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-green-700 mb-3">Ricette consigliate</h3>
        <div role="tablist" className="flex flex-wrap gap-2">
          {recipes.map((r, i) => (
            <button
              key={r.props.name}
              role="tab"
              aria-selected={i === active}
              aria-controls={`recipe-panel-${i}`}
              id={`recipe-tab-${i}`}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                i === active
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white border border-green-200 text-gray-700 hover:bg-green-50'
              }`}
            >
              {r.props.name}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          id={`recipe-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`recipe-tab-${active}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="px-6 py-6"
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-500 mb-4">
            {meta.prep && (
              <span>
                <strong className="text-gray-700">Prep:</strong> {meta.prep}
              </span>
            )}
            {meta.cook && (
              <span>
                <strong className="text-gray-700">Cottura:</strong> {meta.cook}
              </span>
            )}
            {meta.servings && (
              <span>
                <strong className="text-gray-700">Porzioni:</strong> {meta.servings}
              </span>
            )}
            {meta.category && (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
                {meta.category}
              </span>
            )}
          </div>
          <div className="recipe-content prose prose-green max-w-none">{current.props.children}</div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

Recipe.displayName = 'Recipe'
RecipeTabs.displayName = 'RecipeTabs'
