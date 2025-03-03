export function extractTitleFromContent(content: string): string | null {
  try {
    // Try to parse as JSON first (BlockNote format)
    const blocks = JSON.parse(content)
    if (Array.isArray(blocks)) {
      const h1Block = blocks.find(block => 
        block.type === 'heading' && 
        block.props?.level === 1 &&
        block.content?.[0]?.text
      )
      if (h1Block?.content?.[0]?.text) {
        return h1Block.content[0].text
      }
    }
  } catch {
    // If not JSON, treat as HTML (legacy format)
    if (typeof document !== 'undefined') {
      const div = document.createElement('div')
      div.innerHTML = content
      const h1 = div.querySelector('h1')
      return h1?.textContent || null
    }
    
    // Fallback for server-side HTML parsing
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/)
    return h1Match ? h1Match[1] : null
  }
  
  return null
}
