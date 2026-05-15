import { downloadPDF } from '../utils/pdfExport'
import { useState } from 'react'

export default function ResumePreview({ resumeData }) {
  const [saveMsg, setSaveMsg] = useState('')
  const [scoreMsg, setScoreMsg] = useState('')
  const [scoreLoading, setScoreLoading] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [coverLoading, setCoverLoading] = useState(false)
  const [showCover, setShowCover] = useState(false)

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`

  const saveResume = async () => {
    try {
      localStorage.setItem('resumeData', JSON.stringify(resumeData))
      setSaveMsg('✅ Resume saved successfully!')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch (error) {
      setSaveMsg('❌ Failed to save!')
      setTimeout(() => setSaveMsg(''), 3000)
    }
  }

  const getResumeScore = async () => {
    setScoreLoading(true)
    setScoreMsg('')
    try {
      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Score this resume out of 100 and give 3 short improvement tips. Name: ${resumeData.name}, Role: ${resumeData.role}, Summary: ${resumeData.summary}, Skills: ${resumeData.skills.join(', ')}, Experience: ${resumeData.experience.map(e => e.title).join(', ')}. Return ONLY a JSON object like: {"score": 75, "tips": ["tip1", "tip2", "tip3"]}. No markdown.`
            }]
          }]
        })
      })
      const data = await response.json()
      const text = data.candidates[0].content.parts[0].text
      const clean = text.replace(/```json|```/g, '').trim()
      const result = JSON.parse(clean)
      setScoreMsg(result)
    } catch {
      setScoreMsg({ score: 0, tips: ['Failed to score. Check your API key.'] })
    }
    setScoreLoading(false)
  }

  const getCoverLetter = async () => {
    setCoverLoading(true)
    setCoverLetter('')
    setShowCover(true)
    try {
      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Write a professional cover letter for ${resumeData.name} applying for ${resumeData.role} position. Summary: ${resumeData.summary}. Skills: ${resumeData.skills.join(', ')}. Keep it 3 paragraphs, professional and convincing. Return only the cover letter text, no extra formatting.`
            }]
          }]
        })
      })
      const data = await response.json()
      const text = data.candidates[0].content.parts[0].text
      setCoverLetter(text)
    } catch {
      setCoverLetter('Unable to generate cover letter. Please try again.')
    }
    setCoverLoading(false)
  }

  return (
    <div className="preview-panel">
      <h2>📄 Live Preview</h2>
      <div className="resume-sheet" id="resume-sheet">
        <div className="resume-name">{resumeData.name || 'Your Name'}</div>
        <div className="resume-role">{resumeData.role}</div>
        <div className="resume-contact">
          {[resumeData.email, resumeData.phone, resumeData.linkedin].filter(Boolean).join(' | ') || 'email | phone | linkedin'}
        </div>

        {resumeData.summary.split(/(?<=[.!?])\s+/).filter(s => s.trim()).map((point, i) => (
          <div key={i} className="resume-bullet">
            {point.trim()}
          </div>
        ))}

        {resumeData.experience.some(e => e.title || e.company) && (
          <div className="resume-section">
            <div className="resume-section-title">Experience</div>
            {resumeData.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                {(exp.title || exp.company) && (
                  <div className="resume-exp-title">
                    {exp.title}{exp.company ? ` — ${exp.company}` : ''}
                  </div>
                )}
                {(exp.dates || exp.location) && (
                  <div className="resume-exp-sub">
                    {[exp.dates, exp.location].filter(Boolean).join(' | ')}
                  </div>
                )}
                {exp.description && exp.description.split('\n').filter(l => l.trim()).map((line, j) => (
                  <div key={j} className="resume-bullet">
                    {line.replace(/^[•\-]\s*/, '')}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {resumeData.projects?.some(p => p.title) && (
          <div className="resume-section">
            <div className="resume-section-title">Projects</div>
            {resumeData.projects.map((proj, i) => (
              proj.title && <div key={i} style={{ marginBottom: 8 }}>
                <div className="resume-exp-title">
                  {proj.title} {proj.technologies && <span style={{ fontWeight: 400, color: '#666' }}>— {proj.technologies}</span>}
                </div>
                {proj.link && <div className="resume-exp-sub">{proj.link}</div>}
                {proj.description && <div className="resume-bullet">{proj.description}</div>}
              </div>
            ))}
          </div>
        )}

        {resumeData.skills.length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title">Skills</div>
            <div className="resume-skills">
              {resumeData.skills.map((s, i) => (
                <span key={i} className="resume-skill">{s}</span>
              ))}
            </div>
          </div>
        )}

        {resumeData.certifications?.some(c => c.name) && (
          <div className="resume-section">
            <div className="resume-section-title">Certifications</div>
            {resumeData.certifications.map((cert, i) => (
              cert.name && <div key={i} style={{ marginBottom: 4 }}>
                <div className="resume-exp-title">{cert.name}</div>
                <div className="resume-exp-sub">{[cert.issuer, cert.year].filter(Boolean).join(' — ')}</div>
              </div>
            ))}
          </div>
        )}

        {resumeData.languages?.some(l => l.language) && (
          <div className="resume-section">
            <div className="resume-section-title">Languages</div>
            <div className="resume-skills">
              {resumeData.languages.map((lang, i) => (
                lang.language && <span key={i} className="resume-skill">{lang.language} ({lang.proficiency})</span>
              ))}
            </div>
          </div>
        )}

        {(resumeData.degree || resumeData.institution) && (
          <div className="resume-section">
            <div className="resume-section-title">Education</div>
            <div className="resume-exp-title">
              {resumeData.degree}{resumeData.institution ? ` — ${resumeData.institution}` : ''}
            </div>
            <div className="resume-exp-sub">
              {[resumeData.year, resumeData.cgpa].filter(Boolean).join(' | ')}
            </div>
          </div>
        )}
      </div>

      {scoreMsg && (
        <div style={{ marginTop: 12, padding: 12, background: '#f0f7ff', borderRadius: 8, border: '1px solid #B5D4F4' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#185FA5', marginBottom: 6 }}>
            Resume Score: {scoreMsg.score}/100 {scoreMsg.score >= 80 ? '🌟' : scoreMsg.score >= 60 ? '👍' : '💪'}
          </div>
          <div style={{ fontSize: 12, color: '#333' }}>
            <strong>Tips to improve:</strong>
            {scoreMsg.tips?.map((tip, i) => (
              <div key={i} style={{ marginTop: 4 }}>• {tip}</div>
            ))}
          </div>
        </div>
      )}

      {showCover && (
        <div style={{ marginTop: 12, padding: 12, background: '#f8fff8', borderRadius: 8, border: '1px solid #B5D4B4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <strong style={{ fontSize: 13, color: '#333' }}>📝 Cover Letter</strong>
            <button onClick={() => setShowCover(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>✕</button>
          </div>
          {coverLoading ? (
            <div className="loading"><span/><span/><span/></div>
          ) : (
            <p style={{ fontSize: 11, lineHeight: 1.8, color: '#333', whiteSpace: 'pre-line' }}>{coverLetter}</p>
          )}
        </div>
      )}

      {saveMsg && <p style={{ textAlign: 'center', marginTop: 8, fontSize: 13 }}>{saveMsg}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
        <button className="download-btn" style={{ background: '#28a745' }} onClick={saveResume}>
          💾 Save
        </button>
        <button className="download-btn" onClick={() => downloadPDF(resumeData)}>
          ⬇ PDF
        </button>
        <button className="download-btn" style={{ background: '#6f42c1' }} onClick={getResumeScore} disabled={scoreLoading}>
          {scoreLoading ? '⏳ Scoring...' : '🎯 Score Resume'}
        </button>
        <button className="download-btn" style={{ background: '#fd7e14' }} onClick={getCoverLetter} disabled={coverLoading}>
          {coverLoading ? '⏳ Writing...' : '📝 Cover Letter'}
        </button>
      </div>
    </div>
  )
}