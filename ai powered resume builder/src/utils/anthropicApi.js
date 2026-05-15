const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

async function callClaude(prompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  })
  const data = await response.json()
  const text = data.content[0].text
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

export async function getSummary(role) {
  try {
    return await callClaude(
      `Write 3 professional resume summary options for a ${role}. Each should be 2-3 sentences, action-oriented and ATS-friendly. Return ONLY a JSON array of 3 strings, no markdown, no extra text.`
    )
  } catch {
    return [
      `Results-driven ${role} with proven experience delivering impactful solutions.`,
      `Motivated ${role} skilled at solving complex problems and collaborating cross-functionally.`,
      `Detail-oriented ${role} passionate about building scalable and user-friendly solutions.`
    ]
  }
}

export async function getBullets(jobTitle, role) {
  try {
    return await callClaude(
      `Generate 5 strong ATS-friendly resume bullet points for a ${jobTitle} targeting a ${role} role. Use action verbs and quantify where possible. Return ONLY a JSON array of 5 strings, no markdown, no extra text.`
    )
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
    return await callClaude(
      `List the top 10 most in-demand skills for a ${role} in 2025. Return ONLY a JSON array of 10 short skill name strings, no markdown, no extra text.`
    )
  } catch {
    return ['Communication', 'Problem Solving', 'Teamwork', 'Leadership', 'Analytical Thinking',
            'Project Management', 'Critical Thinking', 'Adaptability', 'Time Management', 'Creativity']
  }
}