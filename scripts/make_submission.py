"""Validate public URL submissions and bundle them in a ZIP for class."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from urllib.parse import urlparse

BASE = Path(__file__).resolve().parent.parent
SOURCE = BASE / 'submission' / 'links_template.txt'
DEST = BASE / 'submission' / 'OLAPulse_submission_links.zip'
REQUIRED = ['PUBLIC_GITHUB_REPOSITORY', 'PUBLIC_LIVE_APPLICATION', 'PUBLIC_MEDIUM_ARTICLE', 'PUBLIC_VIDEO']


def main():
    text = SOURCE.read_text(encoding='utf-8')
    data = {}
    for line in text.splitlines():
        if ': ' in line:
            key, value = line.split(': ', 1)
            if key in REQUIRED:
                data[key] = value.strip()
    for key in REQUIRED:
        url = data.get(key, '')
        parsed = urlparse(url)
        if (not url.startswith('https://') or not parsed.netloc or
                any(token in url.upper() for token in ['YOUR_', 'PASTE_', 'TU_', 'EXAMPLE', 'PLACEHOLDER'])):
            raise SystemExit(f'Update {key} with a verified PUBLIC URL before creating the final submission ZIP.')
    if 'github.com' not in urlparse(data['PUBLIC_GITHUB_REPOSITORY']).netloc:
        raise SystemExit('PUBLIC_GITHUB_REPOSITORY must point to github.com')
    with ZipFile(DEST, 'w', ZIP_DEFLATED) as archive:
        archive.writestr('OLAPulse_public_links.txt', '\n'.join(f'{key}: {data[key]}' for key in REQUIRED) + '\n')
    print('Created:', DEST)


if __name__ == '__main__':
    main()
