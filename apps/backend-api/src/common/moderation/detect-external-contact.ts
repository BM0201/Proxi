/**
 * Detección anti-fuga de contacto externo (anti-leak).
 *
 * Proxi protege la relación dentro de la plataforma: el pago protegido, la
 * liquidación y la verificación dependen de que la comunicación y el acuerdo
 * ocurran dentro de Proxi. Por eso detectamos intentos de mover la conversación
 * a canales externos (teléfono, WhatsApp, Telegram, correo, redes, enlaces).
 *
 * Esta función es puramente heurística: NO bloquea, solo señala (warning) para
 * que el sistema marque la oferta/mensaje y genere un ModerationFlag de revisión.
 */

export interface ExternalContactMatch {
  detected: boolean;
  reasons: string[];
}

/** Patrón de teléfono (formatos NI e internacionales, con separadores). */
const phonePattern = /(\+?\d[\d\s().-]{7,}\d)/;

/** Patrón de correo electrónico. */
const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

/** Enlaces y dominios (http/https/www, acortadores y dominios comunes). */
const urlPattern = /(https?:\/\/|www\.)/i;
const domainPattern = /\b[a-z0-9-]+\.(com|net|org|io|app|me|ni|gt|hn|cr|sv|info|link|page|site|online|store)\b/i;

/** Mensajería externa por nombre o por enlace corto (wa.me / t.me). */
const messengerPattern = /(whats?app|wsp|telegram|signal|messenger|instagram|facebook|fb\.com|tiktok|wa\.me|t\.me|@[a-z0-9_]{3,})/i;

/**
 * Frases típicas en español (Nicaragua) que buscan sacar la conversación de Proxi:
 * "escribime al", "llamame al", "mi número", "te paso mi numero", "agregame", etc.
 */
const phrasePattern =
  /(escrib[ií](me|í)?\s+al|ll[aá]m(a|á)me\s+al|mi\s+n[uú]mero|te\s+paso\s+(mi\s+)?n[uú]mero|ag(r|rr)eg(a|á)me|fuera\s+de\s+(la\s+)?(app|plataforma|proxi)|por\s+fuera|cont[aá]ct(a|á)me\s+(al|por)|mand(a|á)me\s+(un\s+)?mensaje\s+al|pasame\s+tu\s+(n[uú]mero|contacto)|hablemos\s+por)/i;

/**
 * Analiza un texto y devuelve si contiene posibles intentos de contacto externo,
 * junto con las razones detectadas (útil para auditoría/moderación).
 */
export function detectExternalContact(text: string | null | undefined): ExternalContactMatch {
  const reasons: string[] = [];
  if (!text || !text.trim()) {
    return { detected: false, reasons };
  }

  if (phonePattern.test(text)) reasons.push('Posible número de teléfono');
  if (emailPattern.test(text)) reasons.push('Posible correo electrónico');
  if (urlPattern.test(text) || domainPattern.test(text)) reasons.push('Posible enlace o dominio externo');
  if (messengerPattern.test(text)) reasons.push('Posible mensajería externa (WhatsApp/Telegram/redes)');
  if (phrasePattern.test(text)) reasons.push('Frase que sugiere contacto fuera de Proxi');

  return { detected: reasons.length > 0, reasons };
}
