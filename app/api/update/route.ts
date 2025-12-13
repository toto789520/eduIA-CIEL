import { NextRequest, NextResponse } from 'next/server'

const GITHUB_REPO = 'toto789520/eduIA-CIEL'
const CURRENT_VERSION = '1.0.0' // This should match package.json version

interface GitHubRelease {
  tag_name: string
  name: string
  body: string
  published_at: string
  html_url: string
}

async function getLatestRelease(): Promise<GitHubRelease | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'eduIA-CIEL-App'
        }
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        // No releases yet
        return null
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching latest release:', error)
    return null
  }
}

async function getLatestCommit(): Promise<any> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/commits/main`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'eduIA-CIEL-App'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching latest commit:', error)
    return null
  }
}

function compareVersions(current: string, latest: string): number {
  const currentParts = current.split('.').map(Number)
  const latestParts = latest.split('.').map(Number)

  for (let i = 0; i < 3; i++) {
    const c = currentParts[i] || 0
    const l = latestParts[i] || 0
    if (l > c) return 1  // Update available
    if (l < c) return -1 // Current is newer (shouldn't happen)
  }
  return 0 // Same version
}

export async function GET(request: NextRequest) {
  try {
    const latestRelease = await getLatestRelease()
    const latestCommit = await getLatestCommit()

    const response: any = {
      currentVersion: CURRENT_VERSION,
      updateAvailable: false,
      latestVersion: null,
      releaseNotes: null,
      releaseUrl: null,
      lastCommit: null
    }

    if (latestRelease) {
      const latestVersion = latestRelease.tag_name.replace(/^v/, '')
      const comparison = compareVersions(CURRENT_VERSION, latestVersion)
      
      response.updateAvailable = comparison > 0
      response.latestVersion = latestVersion
      response.releaseNotes = latestRelease.body
      response.releaseUrl = latestRelease.html_url
      response.publishedAt = latestRelease.published_at
    }

    if (latestCommit) {
      response.lastCommit = {
        sha: latestCommit.sha.substring(0, 7),
        message: latestCommit.commit.message,
        author: latestCommit.commit.author.name,
        date: latestCommit.commit.author.date,
        url: latestCommit.html_url
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Update check error:', error)
    return NextResponse.json(
      { error: 'Failed to check for updates' },
      { status: 500 }
    )
  }
}

// POST endpoint to trigger update (for admin use)
export async function POST(request: NextRequest) {
  try {
    // This is a placeholder for actual update mechanism
    // In production, this would trigger a git pull and restart
    const { action } = await request.json()

    if (action === 'update') {
      // Check if update is available
      const latestRelease = await getLatestRelease()
      
      if (!latestRelease) {
        return NextResponse.json(
          { error: 'No updates available' },
          { status: 400 }
        )
      }

      const latestVersion = latestRelease.tag_name.replace(/^v/, '')
      const comparison = compareVersions(CURRENT_VERSION, latestVersion)

      if (comparison <= 0) {
        return NextResponse.json(
          { message: 'Already on latest version' },
          { status: 200 }
        )
      }

      // Log the update command that should be run
      console.log('='.repeat(60))
      console.log('UPDATE REQUESTED')
      console.log('='.repeat(60))
      console.log(`Current Version: ${CURRENT_VERSION}`)
      console.log(`Latest Version: ${latestVersion}`)
      console.log('To update, run:')
      console.log('  git fetch origin')
      console.log(`  git checkout ${latestRelease.tag_name}`)
      console.log('  npm install')
      console.log('  npm run build')
      console.log('  npm start')
      console.log('='.repeat(60))

      return NextResponse.json({
        message: 'Update instructions logged. Manual update required.',
        version: latestVersion,
        instructions: [
          'git fetch origin',
          `git checkout ${latestRelease.tag_name}`,
          'npm install',
          'npm run build',
          'npm start'
        ]
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Failed to process update' },
      { status: 500 }
    )
  }
}
