import { getUtmParams } from "./utm";

const WEBHOOK_URL =
  "https://n8nfelipe.genialsolucoesdigitais.com.br/webhook/quiz_diogo";

interface WebhookPayload {
  name: string;
  email: string;
  whatsapp: string;
  score: number;
  totalQuestions: number;
  profile: string;
  diagnostic: string;
  opportunity: string;
  answers: Array<{
    question: string;
    type: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }>;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

async function postWebhook(data: Record<string, unknown>) {
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // Silent fail — não interfere na experiência do usuário
  }
}

export function sendLeadWebhook(payload: { name: string; email: string; whatsapp: string }) {
  const utms = getUtmParams();
  postWebhook({
    step: "lead_capture",
    ...payload,
    ...utms,
  });
}

export function sendQuizWebhook(payload: Omit<WebhookPayload, "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term">) {
  const utms = getUtmParams();
  postWebhook({
    step: "quiz_completed",
    ...payload,
    ...utms,
  });
}
