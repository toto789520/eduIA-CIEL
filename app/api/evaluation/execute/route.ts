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

function simulateCommand(command: string, exerciseId: string): any {
  const cleanCommand = command.trim().toLowerCase()
  const validation = commandValidations[exerciseId]
  
  if (!validation) {
    return {
      output: 'Exercice non trouvé',
      correct: false
    }
  }

  // Common commands simulation
  if (cleanCommand === 'pwd') {
    return { output: '/home/user', correct: false }
  }
  
  if (cleanCommand === 'whoami') {
    return { output: 'user', correct: false }
  }
  
  if (cleanCommand.startsWith('echo ')) {
    return { output: cleanCommand.substring(5), correct: false }
  }

  if (cleanCommand === 'help') {
    return { 
      output: 'Commandes disponibles: ls, pwd, whoami, mkdir, cd, chmod, echo, help',
      correct: false 
    }
  }

  // Check if command matches validation
  if (cleanCommand.includes(validation.validation.toLowerCase())) {
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
