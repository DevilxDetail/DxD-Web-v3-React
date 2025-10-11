import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Read the built index.html
  const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Replace meta tags for /thegarden
  html = html.replace(
    /<meta property="og:image" content="[^"]*" \/>/g,
    '<meta property="og:image" content="https://devilxdetail.com/Jules Thumbnail.jpg" />'
  );
  
  html = html.replace(
    /<meta property="og:image:secure_url" content="[^"]*" \/>/g,
    '<meta property="og:image:secure_url" content="https://devilxdetail.com/Jules Thumbnail.jpg" />'
  );

  html = html.replace(
    /<meta name="twitter:image" content="[^"]*" \/>/g,
    '<meta name="twitter:image" content="https://devilxdetail.com/Jules Thumbnail.jpg" />'
  );

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.status(200).send(html);
}

