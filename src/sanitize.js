import DOMPurify from 'dompurify'
export function sanitizeInput(str){ return DOMPurify.sanitize(str) }