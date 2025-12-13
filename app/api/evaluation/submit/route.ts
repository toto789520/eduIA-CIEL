import { NextRequest, NextResponse } from 'next/server'

const codeValidations: { [key: string]: { validation: RegExp; message: string } } = {
  'code-1': {
    validation: /echo.*hello.*bts.*ciel.*date/is,
    message: 'Votre script doit contenir echo "Hello BTS CIEL" et la commande date'
  },
  'code-2': {
    validation: /def\s+calculate_average.*sum.*len/is,
    message: 'Votre fonction doit calculer la somme et diviser par la longueur de la liste'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, exerciseId } = await request.json()

    if (!code || !exerciseId) {
      return NextResponse.json(
        { error: 'Code and exerciseId required' },
        { status: 400 }
      )
    }

    const validation = codeValidations[exerciseId]
    
    if (!validation) {
      return NextResponse.json({
        correct: false,
        message: 'Exercice non trouvé'
      })
    }

    const cleanCode = code.toLowerCase().replace(/\s+/g, ' ')
    const isCorrect = validation.validation.test(cleanCode)

    return NextResponse.json({
      correct: isCorrect,
      message: isCorrect ? 'Code correct!' : validation.message
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to validate code' },
      { status: 500 }
    )
  }
}
