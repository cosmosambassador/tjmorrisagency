"""Build a standalone demo HTML file without bundling any private roster."""
from pathlib import Path
from html import escape
root=Path(__file__).resolve().parent
page=(root/'index.html').read_text()
for name in ('core.js','simulation.js','world.js','app.js'):
 page=page.replace(f'<script src="{name}"></script>', '<script>\n'+(root/name).read_text()+'\n</script>')
page=page.replace('<a href="PAPER.md" target="_blank" rel="noopener">Read the architecture paper</a>', '<details><summary>Read the architecture paper</summary><pre>'+escape((root/'PAPER.md').read_text())+'</pre></details>')
output=root.parent/'Cosmos-Expanse-Demo.html'
output.write_text(page)
print(output)
