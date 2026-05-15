import { useState } from 'react'
import { getSummary, getBullets, getSkills, getProjectDesc } from '../utils/anthropicApi'

const ROLES = [
  'Software Engineer', 'Data Scientist', 'Product Manager', 'Marketing Manager',
  'UX Designer', 'Business Analyst', 'Civil Engineer', 'Mechanical Engineer',
  'Electrical Engineer', 'Electronics Engineer', 'Teacher / Educator',
  'Doctor / Healthcare', 'Nurse', 'Accountant', 'HR Manager',
  'Graphic Designer', 'Content Writer', 'Sales Executive', 'Lawyer', 'Architect'
]

const PROFICIENCY = ['Beginner', 'Elementary', 'Intermediate', 'Fluent', 'Native']

export default function ResumeForm({ resumeData, setResumeData }) {
  const [activeTab, setActiveTab] = useState('info')
  const [isFresher, setIsFresher] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summarySuggestions, setSummarySuggestions] = useState([])
  const [bulletsLoading, setBulletsLoading] = useState({})
  const [bulletSuggestions, setBulletSuggestions] = useState({})
  const [skillsLoading, setSkillsLoading] = useState(false)
  const [skillSuggestions, setSkillSuggestions] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [projectLoading, setProjectLoading] = useState({})
  const [projectSuggestions, setProjectSuggestions] = useState({})

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

  const handleGetProjectDesc = async (index) => {
    const proj = resumeData.projects[index]
    if (!proj.title) return alert('Please enter project title first!')
    setProjectLoading(prev => ({ ...prev, [index]: true }))
    setProjectSuggestions(prev => ({ ...prev, [index]: [] }))
    const result = await getProjectDesc(proj.title, proj.technologies, resumeData.role)
    setProjectSuggestions(prev => ({ ...prev, [index]: result }))
    setProjectLoading(prev => ({ ...prev, [index]: false }))
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
                    <button className="use-btn" style={{marginRight:4}} onClick={() => { update('summary', s); setSummarySuggestions([]) }}>Use</button>
                    <button className="use-btn" style={{background:'#28a745'}} onClick={() => { update('summary', (resumeData.summary ? resumeData.summary + ' ' : '') + s) }}>Add</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'experience' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: 12, background: '#f0f7ff', borderRadius: 8, border: '1px solid #B5D4F4' }}>
            <input type="checkbox" id="fresher" checked={isFresher} onChange={e => setIsFresher(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
            <label htmlFor="fresher" style={{ fontSize: 13, fontWeight: 600, color: '#185FA5', cursor: 'pointer' }}>
              I am a Fresher (No work experience — show projects instead)
            </label>
          </div>

          {!isFresher && (
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

          {isFresher && (
            <div>
              <p style={{ fontSize: 13, color: '#185FA5', fontWeight: 600, marginBottom: 12 }}>🎓 Add your academic projects:</p>
              {resumeData.projects.map((proj, i) => (
                <div key={i} className="exp-block">
                  <div className="two-col">
                    <div className="field-group">
                      <label>Project title</label>
                      <input placeholder="e.g. AI Resume Builder" value={proj.title} onChange={e => { const updated = [...resumeData.projects]; updated[i].title = e.target.value; update('projects', updated) }} />
                    </div>
                    <div className="field-group">
                      <label>Technologies used</label>
                      <input placeholder="e.g. React, Node.js" value={proj.technologies} onChange={e => { const updated = [...resumeData.projects]; updated[i].technologies = e.target.value; update('projects', updated) }} />
                    </div>
                  </div>
                  <div className="field-group">
                    <label>Project link (GitHub/Live)</label>
                    <input placeholder="https://github.com/..." value={proj.link} onChange={e => { const updated = [...resumeData.projects]; updated[i].link = e.target.value; update('projects', updated) }} />
                  </div>
                  <div className="field-group">
                    <label>Description</label>
                    <textarea placeholder="Describe your project..." value={proj.description} onChange={e => { const updated = [...resumeData.projects]; updated[i].description = e.target.value; update('projects', updated) }} />
                    <button className="ai-btn" onClick={() => handleGetProjectDesc(i)} disabled={projectLoading[i]}>
                      ✨ {projectLoading[i] ? 'Generating...' : 'AI Describe Project'}
                    </button>
                    {projectLoading[i] && <div className="loading"><span/><span/><span/></div>}
                    {projectSuggestions[i]?.length > 0 && (
                      <div className="suggestion-box">
                        {projectSuggestions[i].map((s, j) => (
                          <div key={j} className="suggestion-item">
                            <span className="sug-text">{s}</span>
                            <button className="use-btn" style={{marginRight:4}} onClick={() => {
                              const updated = [...resumeData.projects]
                              updated[i].description = s
                              update('projects', updated)
                              setProjectSuggestions(prev => ({ ...prev, [i]: [] }))
                            }}>Use</button>
                            <button className="use-btn" style={{background:'#28a745'}} onClick={() => {
                              const updated = [...resumeData.projects]
                              updated[i].description = (updated[i].description ? updated[i].description + ' ' : '') + s
                              update('projects', updated)
                            }}>Add</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button className="add-btn" onClick={() => update('projects', [...resumeData.projects, { title: '', description: '', technologies: '', link: '' }])}>+ Add Another Project</button>
            </div>
          )}
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

          {!isFresher && (
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#333' }}>Projects</p>
              {resumeData.projects.map((proj, i) => (
                <div key={i} className="exp-block">
                  <div className="two-col">
                    <div className="field-group">
                      <label>Project title</label>
                      <input placeholder="e.g. AI Chatbot" value={proj.title} onChange={e => { const updated = [...resumeData.projects]; updated[i].title = e.target.value; update('projects', updated) }} />
                    </div>
                    <div className="field-group">
                      <label>Technologies</label>
                      <input placeholder="e.g. React, Node.js" value={proj.technologies} onChange={e => { const updated = [...resumeData.projects]; updated[i].technologies = e.target.value; update('projects', updated) }} />
                    </div>
                  </div>
                  <div className="field-group">
                    <label>Project link</label>
                    <input placeholder="https://github.com/..." value={proj.link} onChange={e => { const updated = [...resumeData.projects]; updated[i].link = e.target.value; update('projects', updated) }} />
                  </div>
                  <div className="field-group">
                    <label>Description</label>
                    <textarea placeholder="Describe your project..." value={proj.description} onChange={e => { const updated = [...resumeData.projects]; updated[i].description = e.target.value; update('projects', updated) }} />
                    <button className="ai-btn" onClick={() => handleGetProjectDesc(i)} disabled={projectLoading[i]}>
                      ✨ {projectLoading[i] ? 'Generating...' : 'AI Describe Project'}
                    </button>
                    {projectLoading[i] && <div className="loading"><span/><span/><span/></div>}
                    {projectSuggestions[i]?.length > 0 && (
                      <div className="suggestion-box">
                        {projectSuggestions[i].map((s, j) => (
                          <div key={j} className="suggestion-item">
                            <span className="sug-text">{s}</span>
                            <button className="use-btn" style={{marginRight:4}} onClick={() => {
                              const updated = [...resumeData.projects]
                              updated[i].description = s
                              update('projects', updated)
                              setProjectSuggestions(prev => ({ ...prev, [i]: [] }))
                            }}>Use</button>
                            <button className="use-btn" style={{background:'#28a745'}} onClick={() => {
                              const updated = [...resumeData.projects]
                              updated[i].description = (updated[i].description ? updated[i].description + ' ' : '') + s
                              update('projects', updated)
                            }}>Add</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button className="add-btn" onClick={() => update('projects', [...resumeData.projects, { title: '', description: '', technologies: '', link: '' }])}>+ Add Another Project</button>
            </div>
          )}

          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#333' }}>Certifications</p>
            {resumeData.certifications.map((cert, i) => (
              <div key={i} className="exp-block">
                <div className="two-col">
                  <div className="field-group">
                    <label>Certificate name</label>
                    <input placeholder="e.g. AWS Certified Developer" value={cert.name} onChange={e => { const updated = [...resumeData.certifications]; updated[i].name = e.target.value; update('certifications', updated) }} />
                  </div>
                  <div className="field-group">
                    <label>Issuing organization</label>
                    <input placeholder="e.g. Amazon, Google" value={cert.issuer} onChange={e => { const updated = [...resumeData.certifications]; updated[i].issuer = e.target.value; update('certifications', updated) }} />
                  </div>
                </div>
                <div className="field-group">
                  <label>Year</label>
                  <input placeholder="e.g. 2024" value={cert.year} onChange={e => { const updated = [...resumeData.certifications]; updated[i].year = e.target.value; update('certifications', updated) }} />
                </div>
              </div>
            ))}
            <button className="add-btn" onClick={() => update('certifications', [...resumeData.certifications, { name: '', issuer: '', year: '' }])}>+ Add Certification</button>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#333' }}>Languages</p>
            {resumeData.languages.map((lang, i) => (
              <div key={i} className="exp-block">
                <div className="two-col">
                  <div className="field-group">
                    <label>Language</label>
                    <input placeholder="e.g. English, Hindi" value={lang.language} onChange={e => { const updated = [...resumeData.languages]; updated[i].language = e.target.value; update('languages', updated) }} />
                  </div>
                  <div className="field-group">
                    <label>Proficiency</label>
                    <select value={lang.proficiency} onChange={e => { const updated = [...resumeData.languages]; updated[i].proficiency = e.target.value; update('languages', updated) }} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 13 }}>
                      {PROFICIENCY.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button className="add-btn" onClick={() => update('languages', [...resumeData.languages, { language: '', proficiency: 'Beginner' }])}>+ Add Language</button>
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