import { useState } from 'react';
import './App.css'
import Flow from './Flow'
import GallicaSearch from './GallicaSearch'

function App() {
  const [query, setQuery] = useState("");

  return (
    <>
      <h1 className='text-3xl'>Gallica</h1>
      {/* <GallicaSearch /> */}
      <div className='flex justify-center'>
        <Flow query={query} setQuery={setQuery}/>
      </div>
      <GallicaSearch query={query} />
    </>
  )
}

export default App
