const BACKEND_URL = 'https://ai-resume-builder-backend-q815.onrender.com/api/ai'

export async function getSummary(role) {
  try {
    const response = await fetch(`${BACKEND_URL}/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    })
    console.log('Status:', response.status)
    const data = await response.json()
    console.log('Data:', data)
    return data.suggestions || []
  } catch(err) {
    console.log('Fetch error:', err)
    return [
      `Results-driven ${role} with proven experience delivering impactful solutions.`,
      `Motivated ${role} skilled at solving complex problems.`,
      `Detail-oriented ${role} passionate about building great solutions.`
    ]
  }
}

export async function getBullets(jobTitle, role) {
  try {
    const response = await fetch(`${BACKEND_URL}/bullets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobTitle, role })
    })
    const data = await response.json()
    return data.suggestions || []
  } catch {
    return [
      'Developed and maintained scalable applications serving thousands of users',
      'Collaborated with cross-functional teams to deliver projects on time',
      'Improved system performance by 30% through code optimization',
      'Led end-to-end feature development from design to deployment',
      'Mentored junior team members and conducted code reviews'
    ]
  }
}

export async function getSkills(role) {
  try {
    const response = await fetch(`${BACKEND_URL}/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    })
    const data = await response.json()
    return data.suggestions || []
  } catch {
    return ['Communication', 'Problem Solving', 'Teamwork', 'Leadership', 'Analytical Thinking',
            'Project Management', 'Critical Thinking', 'Adaptability', 'Time Management', 'Creativity']
  }
}

export async function getProjectDesc(title, technologies, role) {
  try {
    const response = await fetch(`${BACKEND_URL}/project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, technologies, role })
    })
    const data = await response.json()
    return data.suggestions || []
  } catch {
    return [
      `Developed ${title} using ${technologies || 'modern technologies'}, implementing key features that improved user experience.`,
      `Built ${title} as a ${role} project, focusing on performance, scalability and clean architecture.`,
      `Created ${title} with ${technologies || 'latest tech stack'}, delivering a fully functional solution with real-world impact.`
    ]
  }
}