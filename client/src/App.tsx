import React from "react"
import { Routes, Route } from "react-router-dom"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Home — coming soon</div>} />
      <Route path="/product/:id" element={<div>Product Detail — coming soon</div>} />
      <Route path="/store/:id" element={<div>Store — coming soon</div>} />
    </Routes>
  )
}

export default App
