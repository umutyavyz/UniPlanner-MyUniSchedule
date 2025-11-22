const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

// Uygulamayı başlat
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // URL'i parse et
      const parsedUrl = parse(req.url, true)
      
      // Tüm istekleri Next.js'e devret
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('İstek işlenirken hata oluştu:', req.url, err)
      res.statusCode = 500
      res.end('Sunucu hatası')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Sunucu çalışıyor: http://${hostname}:${port}`)
    })
})