import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendBookingConfirmation({
  userEmail,
  userName,
  serviceName,
  date,
  barbershopName,
}: {
  userEmail: string
  userName: string
  serviceName: string
  date: Date
  barbershopName: string
}) {
  try {
    // Formata a data (ex: 25 de Fevereiro às 14:00)
    const formattedDate = date.toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    })

    await resend.emails.send({
      from: "Agendamento <nao-responda@gmpsaas.com>", // Use um email do seu domínio
      to: userEmail,
      subject: `Confirmado: ${serviceName} na Vila Barbearia com ${barbershopName}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Agendamento Confirmado! ✅</h1>
          <p>Olá, <strong>${userName}</strong>.</p>
          <p>Seu horário está garantido. Veja os detalhes abaixo:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>🏢 Barbeiro:</strong> ${barbershopName}</p>
            <p style="margin: 5px 0;"><strong>✂️ Serviço:</strong> ${serviceName}</p>
            <p style="margin: 5px 0;"><strong>📅 Data:</strong> ${formattedDate}</p>
          </div>

          <p>Se precisar cancelar, acesse o painel "Meus Agendamentos" no site.</p>
          <p style="color: #888; font-size: 12px; margin-top: 30px;">
            Este é um e-mail automático do sistema GMP Barber.
          </p>
        </div>
      `,
    })
    console.log("Email enviado com sucesso!")
  } catch (error) {
    console.error("Erro ao enviar email:", error)
  }
}
