import { useNavigate } from 'react-router-dom'

import Button from '../../components/button'

function Landing() {
  const navigate = useNavigate()
  
  return (
    <div className="flex h-screen flex-col justify-center bg-[#121418]">
      <div className="flex h-1/2 flex-col items-center justify-center gap-8 bg-[#4b1044]">
        <p className="text-5xl font-bold text-white">AI Summary App</p>

        <Button onClick={() => navigate('/summary')}>Go to Summarizer</Button>
      </div>
    </div>
  )
}

export default Landing
