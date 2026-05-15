import { useState } from 'react'
import { getSummary, getBullets, getSkills } from '../utils/anthropicApi'

const ROLES = ['Software Engineer', 'Data Scientist', 'Product Manager', 'Marketing Manager', 'UX Designer', 'Business Analyst']

export default function ResumeForm({ resumeData, setResumeData }) {
  const [activeTab, setActiveTab] = useState('info')
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summarySuggestions, setSummarySuggestions] = useState([])
  const [bulletsLoading, setBulletsLoading] = useState({})
  const [bulletSuggestions, setBulletSuggestions] = useState({})
  const [skillsLoading, setSkillsLoading] = useState(false)
  const [skillSuggestions, setSkillSuggestions] = useState([])
  const [skillInput, setSkillInput] = useState('')

  const update = (field, value) => setResumeData(prev => ({ ...prev, [field]: value }))

  const updateExp = (index, field, value) => {
    const updated = [...resumeData.experience]
    updated[index][field] = value
    update('experience', updated)
  }

  const addExp = () => update('experience', [...resumeData.experience, { title: '', company: '', dates: '', location: '', description: '' }])

  const addSkill = () => {
    if (!skillInput.trim()) return
    const newSkills = skillInput.split(',').map(s => s.trim()).filter(Boolean)
    update('skills', [...resumeData.skills, ...newSkills])
    setSkillInput('')
  }

  const removeSkill = (i) => update('skills', resumeData.skills.filter((_, idx) => idx !== i))

  const handleGetSummary = async () => {
    setSummaryLoading(true)
    setSummarySuggestions([])
    const result = await getSummary(resumeData.role)
    setSummarySuggestions(result)
    setSummaryLoading(false)
  }

  const handleGetBullets = async (index) => {
    setBulletsLoading(prev => ({ ...prev, [index]: true }))
    setBulletSuggestions(prev => ({ ...prev, [index]: [] }))
    const result = await getBullets(resumeData.experience[index].title || resumeData.role, resumeData.role)
    setBulletSuggestions(prev => ({ ...prev, [index]: result }))
    setBulletsLoading(prev => ({ ...prev, [index]: false }))
  }

  const handleGetSkills = async () => {
    setSkillsLoading(true)
    setSkillSuggestions([])
    const result = await getSkills(resumeData.role)
    setSkillSuggestions(result)
    setSkillsLoading(false)
  }

  const applyBullet = (index, bullet) => {
    const current = resumeData.experience[index].description
    updateExp(index, 'description', current ? current + '\n• ' + bullet : '• ' + bullet)
  }

  return (
    <div className="form-panel">
      <div className="tab-bar">
        {['info', 'experience', 'skills'].map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'info' ? 'Personal Info' : tab === 'experience' ? 'Experience' : 'Skills & Education'}
          </button>
        ))}
      </div>

      {activeTab === 'info' && (
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#333' }}>Select your target role:</p>
          <div className="role-chips">
            {ROLES.map(role => (
              <button key={role} className={`chip ${resumeData.role === role ? 'active' : ''}`} onClick={() => update('role', role)}>
                {role}
              </button>
            ))}
          </div>

          <div className="field-group">
            <label>Full name</label>
            <input placeholder="e.g. Priya Sharma" value={resumeData.name} onChange={e => update('name', e.target.value)} />
          </div>
          <div className="two-col">
            <div className="field-group">
              <label>Email</label>
              <input placeholder="priya@email.com" value={resumeData.email} onChange={e => update('email', e.target.value)} />
            </div>
            <div className="field-group">
              <label>Phone</label>
              <input placeholder="+91 98765 43210" value={resumeData.phone} onChange={e => update('phone', e.target.value)} />
            </div>
          </div>
          <div className="field-group">
            <label>LinkedIn / Portfolio</label>
            <input placeholder="linkedin.com/in/priya" value={resumeData.linkedin} onChange={e => update('linkedin', e.target.value)} />
          </div>
          <div className="field-group">
            <label>Professional summary</label>
            <textarea placeholder="Write a 2-3 line summary..." value={resumeData.summary} onChange={e => update('summary', e.target.value)} />
            <button className="ai-btn" onClick={handleGetSummary} disabled={summaryLoading}>
              ✨ {summaryLoading ? 'Generating...' : 'AI Suggest Summary'}
            </button>
            {summaryLoading && <div className="loading"><span/><span/><span/></div>}
            {summarySuggestions.length > 0 && (
              <div className="suggestion-box">
                {summarySuggestions.map((s, i) => (
                  <div key={i} className="suggestion-item">
                    <span className="sug-text">{s}</span>
                    <button className="use-btn" onClick={() => { update('summary', s); setSummarySuggestions([]) }}>Use</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'experience' && (
        <div>
          {resumeData.experience.map((exp, i) => (
            <div key={i} className="exp-block">
              <div className="two-col">
                <div className="field-group">
                  <label>Job title</label>
                  <input placeholder="Software Engineer" value={exp.title} onChange={e => updateExp(i, 'title', e.target.value)} />
                </div>
                <div className="field-group">
                  <label>Company</label>
                  <input placeholder="Google" value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} />
                </div>
              </div>
              <div className="two-col">
                <div className="field-group">
                  <label>Dates</label>
                  <input placeholder="Jun 2022 – Present" value={exp.dates} onChange={e => updateExp(i, 'dates', e.target.value)} />
                </div>
                <div className="field-group">
                  <label>Location</label>
                  <input placeholder="Bengaluru" value={exp.location} onChange={e => updateExp(i, 'location', e.target.value)} />
                </div>
              </div>
              <div className="field-group">
                <label>Description</label>
                <textarea placeholder="Describe your responsibilities..." value={exp.description} onChange={e => updateExp(i, 'description', e.target.value)} />
              </div>
              <button className="ai-btn" onClick={() => handleGetBullets(i)} disabled={bulletsLoading[i]}>
                ✨ {bulletsLoading[i] ? 'Generating...' : 'AI Generate Bullet Points'}
              </button>
              {bulletsLoading[i] && <div className="loading"><span/><span/><span/></div>}
              {bulletSuggestions[i]?.length > 0 && (
                <div className="suggestion-box">
                  {bulletSuggestions[i].map((b, j) => (
                    <div key={j} className="suggestion-item">
                      <span className="sug-text">{b}</span>
                      <button className="use-btn" onClick={() => applyBullet(i, b)}>Add</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button className="add-btn" onClick={addExp}>+ Add Another Experience</button>
        </div>
      )}

      {activeTab === 'skills' && (
        <div>
          <div className="field-group">
            <label>Add skills</label>
            <div className="skill-input-row">
              <input placeholder="e.g. Python, React, SQL" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} />
              <button onClick={addSkill}>Add</button>
            </div>
            <div className="skill-tags">
              {resumeData.skills.map((s, i) => (
                <span key={i} className="skill-tag">{s}<button onClick={() => removeSkill(i)}>×</button></span>
              ))}
            </div>
            <button className="ai-btn" onClick={handleGetSkills} disabled={skillsLoading}>
              ✨ {skillsLoading ? 'Generating...' : 'AI Suggest Skills'}
            </button>
            {skillsLoading && <div className="loading"><span/><span/><span/></div>}
            {skillSuggestions.length > 0 && (
              <div className="suggestion-box">
                {skillSuggestions.map((s, i) => (
                  <div key={i} className="suggestion-item">
                    <span className="sug-text">{s}</span>
                    <button className="use-btn" onClick={() => { update('skills', [...resumeData.skills, s]); setSkillSuggestions(prev => prev.filter((_, idx) => idx !== i)) }}>Add</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#333' }}>Education</p>
            <div className="two-col">
              <div className="field-group">
                <label>Degree</label>
                <input placeholder="B.Tech Computer Science" value={resumeData.degree} onChange={e => update('degree', e.target.value)} />
              </div>
              <div className="field-group">
                <label>Institution</label>
                <input placeholder="IIT Bombay" value={resumeData.institution} onChange={e => update('institution', e.target.value)} />
              </div>
            </div>
            <div className="two-col">
              <div className="field-group">
                <label>Year</label>
                <input placeholder="2020 – 2024" value={resumeData.year} onChange={e => update('year', e.target.value)} />
              </div>
              <div className="field-group">
                <label>CGPA / %</label>
                <input placeholder="8.5 / 10" value={resumeData.cgpa} onChange={e => update('cgpa', e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}