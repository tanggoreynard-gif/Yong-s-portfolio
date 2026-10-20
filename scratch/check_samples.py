import os
import re

samples = ['lumina-dental.html', 'fitco-coaching.html', 'haven-senior-care.html', 'meridian-staffing.html']

for s in samples:
    path = os.path.join('public', 'samples', s)
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Find all src attributes
    imgs = re.findall(r'src=["\']([^"\']+)["\']', html)
    print(f"=== {s} ({len(html)} bytes) ===")
    missing = []
    for img in imgs:
        if img.startswith('data:'):
            continue
        rel = img.lstrip('/')
        # Check in public folder
        p1 = os.path.join('public', rel)
        p2 = rel
        if not os.path.exists(p1) and not os.path.exists(p2):
            missing.append(img)
    print(f"  Total images referenced: {len(imgs)}")
    if missing:
        print(f"  MISSING IMAGES: {missing}")
    else:
        print("  All images exist on disk!")
