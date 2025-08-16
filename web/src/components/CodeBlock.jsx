import { useState } from 'react';
import { Copy } from 'lucide-react';

export default function CodeBlock({ children, language = '' }){
  const [copied, setCopied] = useState(false);
  async function copy(){
    try{ await navigator.clipboard.writeText(children); setCopied(true); setTimeout(()=>setCopied(false), 1200);}catch{}
  }
  return (
    <div style={{ position:'relative', border:'1px solid var(--glass-border)', borderRadius:12, overflow:'hidden', background:'#0b3d2a' }}>
      <div style={{ position:'absolute', top:6, left:8, fontSize:11, color:'#a7f3d0', background:'rgba(255,255,255,0.06)', border:'1px solid var(--glass-border)', padding:'2px 6px', borderRadius:999 }}>{language || 'code'}</div>
      <button aria-label="Copy code" onClick={copy} className="btn" style={{ position:'absolute', top:4, right:4 }}><Copy size={14}/>{copied? ' Copied':' Copy'}</button>
      <pre style={{ margin:0, padding:'14px 12px', color:'#d1fae5', overflow:'auto' }}><code>{children}</code></pre>
    </div>
  );
}

