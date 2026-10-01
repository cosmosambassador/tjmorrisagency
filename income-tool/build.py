"""Create a standalone income-planner HTML file."""
from pathlib import Path
root = Path(__file__).resolve().parent
page = (root / 'index.html').read_text()
for name in ('income.js', 'ui.js'):
    page = page.replace(f'<script src="{name}"></script>', '<script>\n' + (root / name).read_text() + '\n</script>')
page = page.replace('<a href="../round-robin-space/index.html">Explore our Round Robin lab</a>', 'Our Round Robin lab is a separate demonstration.')
output = root.parent / 'TJ-Fair-Work-Planner.html'
output.write_text(page)
print(output)
