import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'

const root=process.cwd(),port=5174
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'}

createServer(async(request,response)=>{
  try{
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname)
    const relative=normalize(pathname==='/'?'index.html':pathname.replace(/^\/+/,''))
    const file=join(root,relative)
    if(!file.startsWith(root))throw new Error('Invalid path')
    const info=await stat(file)
    if(!info.isFile())throw new Error('Not found')
    response.writeHead(200,{'Content-Type':types[extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'})
    createReadStream(file).pipe(response)
  }catch{
    response.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});response.end('Not found')
  }
}).listen(port,'0.0.0.0',()=>console.log(`VOLUNELLE ready on this device and local network at port ${port}`))
