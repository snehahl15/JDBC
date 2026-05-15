import { useState } from 'react'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import './index.css'

function App() {
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    role: 'Software Engineer',
    summary: '',
    experience: [{ title: '', company: '', dates: '', location: '', description: '' }],
    skills: [],
    degree: '',
    institution: '',
    year: '',
    cgpa: '',
    projects: [{ title: '', description: '', technologies: '', link: '' }],
    certifications: [{ name: '', issuer: '', year: '' }],
    languages: [{ language: '', proficiency: 'Beginner' }],
    template: 'modern'
  })

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>✨ AI Resume Builder</h1>
        <p>Get AI-powered suggestions tailored to your target role</p>
      </header>
      <div className="app-body">
        <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
        <ResumePreview resumeData={resumeData} />
      </div>
    </div>
  )
}

export default App