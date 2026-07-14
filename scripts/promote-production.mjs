#!/usr/bin/env node
/**
 * Force-assign silver-note.vercel.app to the latest production deployment.
 *
 * Usage:
 *   VERCEL_TOKEN=xxx node scripts/promote-production.mjs
 *
 * Optional:
 *   VERCEL_TEAM_ID=team_xxx
 *   VERCEL_PROJECT=silvernote
 */
const token = process.env.VERCEL_TOKEN
if (!token) {
  console.error('VERCEL_TOKEN 이 필요합니다.')
  process.exit(1)
}

const teamId = process.env.VERCEL_TEAM_ID || process.env.VERCEL_ORG_ID
const project = process.env.VERCEL_PROJECT || 'silvernote'
const domains = (process.env.VERCEL_DOMAINS || 'silver-note.vercel.app,caringnote.vercel.app')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const qs = teamId ? `?teamId=${encodeURIComponent(teamId)}` : ''

async function api(path, init = {}) {
  const res = await fetch(`https://api.vercel.com${path}${path.includes('?') ? (teamId ? `&teamId=${teamId}` : '') : qs}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })
  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = { raw: text }
  }
  if (!res.ok) {
    throw new Error(`${res.status} ${path}: ${JSON.stringify(data)}`)
  }
  return data
}

async function main() {
  // Resolve project
  let projectId = process.env.VERCEL_PROJECT_ID
  if (!projectId) {
    const p = await api(`/v9/projects/${encodeURIComponent(project)}`)
    projectId = p.id
    console.log('Project:', p.name, projectId)
  }

  const deps = await api(`/v6/deployments?projectId=${projectId}&target=production&limit=5`)
  const latest = deps.deployments?.[0]
  if (!latest) throw new Error('프로덕션 배포를 찾지 못했습니다.')

  const url = latest.url.startsWith('http') ? latest.url : `https://${latest.url}`
  console.log('Latest production deployment:', url, latest.uid || latest.id)

  for (const domain of domains) {
    try {
      // Prefer alias assignment to deployment host
      const host = url.replace(/^https?:\/\//, '')
      const aliased = await api('/v2/aliases', {
        method: 'POST',
        body: JSON.stringify({ alias: domain, deploymentId: latest.uid || latest.id }),
      })
      console.log('Aliased', domain, '→', aliased.alias || host)
    } catch (e) {
      console.error('Alias failed for', domain, e.message)
      // Fallback: ensure domain is on project
      try {
        await api(`/v10/projects/${projectId}/domains`, {
          method: 'POST',
          body: JSON.stringify({ name: domain }),
        })
        console.log('Domain added to project:', domain)
      } catch (e2) {
        console.error('Domain add failed:', e2.message)
      }
    }
  }

  console.log('Done. Check https://silver-note.vercel.app')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
