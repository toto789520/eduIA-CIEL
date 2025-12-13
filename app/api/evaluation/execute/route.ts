import { NextRequest, NextResponse } from 'next/server'

const commandValidations: { [key: string]: { [key: string]: string } } = {
  'linux-1': {
    validation: 'ls -la',
    output: `total 24
drwxr-xr-x  4 user user 4096 Dec 13 10:30 .
drwxr-xr-x 10 user user 4096 Dec 13 10:00 ..
-rw-r--r--  1 user user  220 Dec 13 10:00 .bashrc
-rw-r--r--  1 user user  807 Dec 13 10:00 .profile
drwxr-xr-x  2 user user 4096 Dec 13 10:30 documents
drwxr-xr-x  2 user user 4096 Dec 13 10:30 projet`,
    hint: 'Utilisez ls avec les options -l et -a'
  },
  'linux-2': {
    validation: 'mkdir projet',
    output: 'Répertoire "projet" créé avec succès',
    hint: 'Utilisez mkdir pour créer un répertoire'
  },
  'linux-3': {
    validation: 'chmod',
    output: 'Permissions modifiées avec succès',
    hint: 'Utilisez chmod avec +x pour rendre exécutable'
  }
}

function normalizeCommand(command: string): string {
  // Remove extra spaces and normalize
  return command.trim().replace(/\s+/g, ' ')
}

function checkCommandMatch(userCommand: string, expectedCommand: string): boolean {
  const normalized = normalizeCommand(userCommand.toLowerCase())
  
  // Split command into parts
  const parts = normalized.split(' ')
  const cmd = parts[0]
  
  // Special handling for ls command with -l and -a flags
  if (cmd === 'ls' && expectedCommand.toLowerCase().includes('ls')) {
    // Check if the expected command requires both -l and -a flags
    const expectedHasL = /-[a-z]*l/.test(expectedCommand.toLowerCase())
    const expectedHasA = /-[a-z]*a/.test(expectedCommand.toLowerCase())
    
    if (expectedHasL && expectedHasA) {
      // Check for -l flag in user command (as separate or in combined form like -la, -al, -lah, etc.)
      const hasL = /-[a-z]*l/.test(normalized)
      // Check for -a flag in user command (as separate or in combined form)
      const hasA = /-[a-z]*a/.test(normalized)
      
      return hasL && hasA
    }
  }
  
  // For mkdir, check if the command matches (e.g., "mkdir projet")
  if (cmd === 'mkdir' && expectedCommand.toLowerCase().includes('mkdir')) {
    // Extract the expected directory name
    const expectedParts = expectedCommand.toLowerCase().split(/\s+/)
    if (expectedParts.length > 1) {
      // If there's a specific directory expected, check for it exactly
      const expectedDir = expectedParts[1]
      return parts.length === 2 && parts[1] === expectedDir
    }
    // If no specific directory, just check that mkdir is used
    return true
  }
  
  // For chmod, check if it starts with chmod
  if (cmd === 'chmod' && expectedCommand.toLowerCase().includes('chmod')) {
    return true
  }
  
  // Default: check if command includes validation
  return normalized.includes(expectedCommand.toLowerCase())
}

function simulateCommand(command: string, exerciseId: string): any {
  const cleanCommand = command.trim()
  const validation = commandValidations[exerciseId]
  
  if (!validation) {
    return {
      output: 'Exercice non trouvé',
      correct: false
    }
  }

  // Common commands simulation
  const lowerCommand = cleanCommand.toLowerCase()
  
  if (lowerCommand === 'pwd') {
    return { output: '/home/user', correct: false }
  }
  
  if (lowerCommand === 'whoami') {
    return { output: 'user', correct: false }
  }
  
  if (lowerCommand.startsWith('echo ')) {
    return { output: cleanCommand.substring(5), correct: false }
  }

  if (lowerCommand === 'help') {
    return { 
      output: 'Commandes disponibles: ls, pwd, whoami, mkdir, cd, chmod, echo, help',
      correct: false 
    }
  }

  // Check if command matches validation
  if (checkCommandMatch(cleanCommand, validation.validation)) {
    return {
      output: validation.output,
      correct: true
    }
  }

  return {
    output: `commande non reconnue: ${command}`,
    correct: false,
    hint: validation.hint
  }
}

export async function POST(request: NextRequest) {
  try {
    const { command, exerciseId } = await request.json()

    if (!command || !exerciseId) {
      return NextResponse.json(
        { error: 'Command and exerciseId required' },
        { status: 400 }
      )
    }

    const result = simulateCommand(command, exerciseId)
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to execute command' },
      { status: 500 }
    )
  }
}
