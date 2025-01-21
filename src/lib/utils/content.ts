export function extractTitleFromContent(content: string): string | null {
  // Create a temporary div to parse the HTML content
  if (typeof document !== 'undefined') {
    const div = document.createElement('div')
    div.innerHTML = content
    const h1 = div.querySelector('h1')
    return h1?.textContent || null
  }
  
  // Fallback for server-side
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/)
  return h1Match ? h1Match[1] : null
}
