import jsPDF from 'jspdf'

export function downloadPDF(data) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = 18

  const name = data.name || 'Resume'

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(24, 95, 165)
  doc.text(name, 105, y, { align: 'center' })
  y += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  const contact = [data.role, data.email, data.phone, data.linkedin].filter(Boolean).join('  |  ')
  doc.text(contact, 105, y, { align: 'center' })
  y += 5

  doc.setDrawColor(24, 95, 165)
  doc.setLineWidth(0.4)
  doc.line(15, y, 195, y)
  y += 6

  function sectionTitle(title) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(24, 95, 165)
    doc.text(title.toUpperCase(), 15, y)
    y += 1
    doc.setLineWidth(0.2)
    doc.line(15, y, 195, y)
    y += 5
  }

  if (data.summary) {
    sectionTitle('Professional Summary')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    const lines = doc.splitTextToSize(data.summary, 178)
    doc.text(lines, 15, y)
    y += lines.length * 4 + 4
  }

  const hasExp = data.experience.some(e => e.title || e.company)
  if (hasExp) {
    sectionTitle('Experience')
    data.experience.forEach(exp => {
      if (!exp.title && !exp.company) return
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(30, 30, 30)
      doc.text(`${exp.title}${exp.company ? ' — ' + exp.company : ''}`, 15, y)
      y += 4
      if (exp.dates || exp.location) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(100, 100, 100)
        doc.text([exp.dates, exp.location].filter(Boolean).join(' | '), 15, y)
        y += 4
      }
      if (exp.description) {
        doc.setTextColor(50, 50, 50)
        exp.description.split('\n').filter(l => l.trim()).forEach(line => {
          const clean = '• ' + line.replace(/^[•\-]\s*/, '')
          const wrapped = doc.splitTextToSize(clean, 175)
          doc.text(wrapped, 17, y)
          y += wrapped.length * 4
        })
      }
      y += 3
    })
  }

  if (data.skills.length > 0) {
    sectionTitle('Skills')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    const skillLine = doc.splitTextToSize(data.skills.join(' • '), 178)
    doc.text(skillLine, 15, y)
    y += skillLine.length * 4 + 4
  }

  if (data.degree || data.institution) {
    sectionTitle('Education')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(30, 30, 30)
    doc.text(`${data.degree}${data.institution ? ' — ' + data.institution : ''}`, 15, y)
    y += 4
    if (data.year || data.cgpa) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text([data.year, data.cgpa].filter(Boolean).join(' | '), 15, y)
    }
  }

  doc.save(`${name.replace(/\s+/g, '_')}_resume.pdf`)
}