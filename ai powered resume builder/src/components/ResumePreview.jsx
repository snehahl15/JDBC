import { downloadPDF } from '../utils/pdfExport'

export default function ResumePreview({ resumeData }) {
  return (
    <div className="preview-panel">
      <h2>📄 Live Preview</h2>
      <div className="resume-sheet" id="resume-sheet">
        <div className="resume-name">{resumeData.name || 'Your Name'}</div>
        <div className="resume-role">{resumeData.role}</div>
        <div className="resume-contact">
          {[resumeData.email, resumeData.phone, resumeData.linkedin].filter(Boolean).join(' | ') || 'email | phone | linkedin'}
        </div>

        {resumeData.summary && (
          <div className="resume-section">
            <div className="resume-section-title">Summary</div>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: '#333' }}>{resumeData.summary}</p>
          </div>
        )}

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

      <button className="download-btn" onClick={() => downloadPDF(resumeData)}>
        ⬇ Download PDF
      </button>
    </div>
  )
}