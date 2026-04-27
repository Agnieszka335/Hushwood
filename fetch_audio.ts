const url = 'https://freesound.org/s/384869/';
fetch(url)
  .then(res => res.text())
  .then(html => {
     const match = html.match(/https:\/\/cdn\.freesound\.org\/previews\/.*?\.mp3/);
     if (match) {
         console.info('AUDIO_URL=' + match[0]);
     } else {
         console.info('No audio URL found');
     }
  });
