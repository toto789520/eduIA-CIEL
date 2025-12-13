import { NextRequest, NextResponse } from 'next/server'

interface EmailConfig {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPass: string
  fromEmail: string
  serverDomain: string
}

// Email configuration from environment variables
function getEmailConfig(): EmailConfig {
  return {
    smtpHost: process.env.SMTP_HOST || 'localhost',
    smtpPort: parseInt(process.env.SMTP_PORT || '587'),
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    fromEmail: process.env.FROM_EMAIL || 'noreply@eduia-ciel.local',
    serverDomain: process.env.SERVER_DOMAIN || 'localhost:3000'
  }
}

// Email templates
function getAccountValidationEmail(userName: string, userEmail: string): string {
  const config = getEmailConfig()
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9fafb; padding: 30px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>eduIA-CIEL</h1>
    </div>
    <div class="content">
      <h2>Compte Validé! 🎉</h2>
      <p>Bonjour ${userName},</p>
      <p>Votre compte eduIA-CIEL a été validé avec succès!</p>
      <p>Vous pouvez maintenant accéder à toutes les fonctionnalités de la plateforme:</p>
      <ul>
        <li>Évaluations interactives</li>
        <li>Chat IA</li>
        <li>Quiz personnalisés</li>
        <li>Classement et compétitions</li>
      </ul>
      <p style="text-align: center; margin: 30px 0;">
        <a href="http://${config.serverDomain}/login" class="button">Se Connecter</a>
      </p>
      <p>Bon apprentissage!</p>
    </div>
    <div class="footer">
      <p>eduIA-CIEL - Plateforme Éducative IA pour BTS CIEL</p>
      <p>Email: ${userEmail}</p>
    </div>
  </div>
</body>
</html>
  `
}

function getRankingChangeEmail(userName: string, userEmail: string, category: string, oldRank: number, newRank: number, totalScore: number): string {
  const config = getEmailConfig()
  const rankImproved = newRank < oldRank
  const emoji = rankImproved ? '📈' : '📊'
  
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9fafb; padding: 30px; }
    .rank-box { background-color: white; border: 2px solid #2563eb; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
    .rank-number { font-size: 48px; font-weight: bold; color: #2563eb; }
    .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>eduIA-CIEL</h1>
    </div>
    <div class="content">
      <h2>Changement de Classement ${emoji}</h2>
      <p>Bonjour ${userName},</p>
      <p>Votre position dans le classement <strong>${category}</strong> a changé!</p>
      <div class="rank-box">
        <div style="margin-bottom: 10px;">Position</div>
        <div class="rank-number">#${newRank}</div>
        <div style="margin-top: 10px; color: ${rankImproved ? '#059669' : '#6b7280'};">
          ${rankImproved ? `↑ Progression depuis la position #${oldRank}` : `Depuis la position #${oldRank}`}
        </div>
        <div style="margin-top: 15px; font-size: 18px;">
          <strong>${totalScore} points</strong>
        </div>
      </div>
      <p>${rankImproved ? 'Félicitations pour votre progression! Continuez vos efforts.' : 'Continuez à participer aux évaluations pour améliorer votre classement.'}</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="http://${config.serverDomain}/leaderboard" class="button">Voir le Classement</a>
      </p>
    </div>
    <div class="footer">
      <p>eduIA-CIEL - Plateforme Éducative IA pour BTS CIEL</p>
      <p>Email: ${userEmail}</p>
    </div>
  </div>
</body>
</html>
  `
}

// Mock email sending function (replace with actual SMTP implementation)
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const config = getEmailConfig()
  
  // Log email for demonstration (in production, use nodemailer or similar)
  console.log('='.repeat(60))
  console.log('EMAIL NOTIFICATION')
  console.log('='.repeat(60))
  console.log(`From: ${config.fromEmail}`)
  console.log(`To: ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Server: ${config.smtpHost}:${config.smtpPort}`)
  console.log('Content:')
  console.log(html)
  console.log('='.repeat(60))
  
  // In production, implement actual email sending:
  // const nodemailer = require('nodemailer')
  // const transporter = nodemailer.createTransport({ ... })
  // await transporter.sendMail({ from, to, subject, html })
  
  return true
}

export async function POST(request: NextRequest) {
  try {
    const { type, userName, userEmail, category, oldRank, newRank, totalScore } = await request.json()

    if (!type || !userName || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let subject = ''
    let html = ''

    if (type === 'account_validation') {
      subject = 'Votre compte eduIA-CIEL a été validé!'
      html = getAccountValidationEmail(userName, userEmail)
    } else if (type === 'ranking_change') {
      if (!category || oldRank === undefined || newRank === undefined || totalScore === undefined) {
        return NextResponse.json(
          { error: 'Missing ranking information' },
          { status: 400 }
        )
      }
      subject = `Changement de classement - ${category}`
      html = getRankingChangeEmail(userName, userEmail, category, oldRank, newRank, totalScore)
    } else {
      return NextResponse.json(
        { error: 'Invalid email type' },
        { status: 400 }
      )
    }

    const sent = await sendEmail(userEmail, subject, html)

    if (sent) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' })
    } else {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
