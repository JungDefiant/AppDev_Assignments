import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Gallery from './Gallery.jsx'

const images = [
    { id: 1, url: 'https://static.wikia.nocookie.net/sonic/images/7/7e/Sa2_shadow.png', description: 'Image 1' },
    { id: 2, url: 'https://static.wikia.nocookie.net/sonic/images/5/59/Shadow_4.png', description: 'Image 2' },
    { id: 3, url: 'https://static.wikia.nocookie.net/sonic/images/f/f9/SonicChannel_Nov2005_Shadow.png', description: 'Image 3' },
  ];

function App() {
  return (
    <>
      <section id="center">
        <Gallery images={images} />
      </section>
    </>
  )
}

export default App
