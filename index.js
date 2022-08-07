const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { games } = require('./data');
const router = require('./src/routes/index')

const app = new Koa();

app.use(bodyParser())

const port = 8081;
app.use(router());


const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

io.on('connection', socket => {
  console.log('初始化成功！下面可以用socket绑定事件和触发事件了', socket.id);
  socket.on('select', data => {
      console.log('客户端发送的内容：', data);
      const gameId = data.gameId;
      const type = data.type
      const userId = data.userId

      const game = games.find((game) => game.id === Number(gameId))
     
      for(let m of game.members) {
        if(m.userId === Number(userId)) {
          m.value = type
        }
      }
      const tag = game.members.some(m => typeof m.value === 'undefined')
      if(tag || (game.members || []).length < 2) {

        // socket.emit('selectMsg', '等待中。。。');
      } else {
        const m1 = game.members.find((m) => m.userId !== userId)
        const tag = data.type > m1.value && data.type - m1.value === 1
        io.to(m1.socketId).emit('selectMsg', `${ tag ? '对方' : 'you'}赢了`);
        io.to(socket.id).emit('selectMsg', `${ tag ? 'you' : '对方'}赢了`);
        game.status = 1 // 表示游戏结束
      }
  })

  socket.on('join', data => {
    const game = games.find((game) => game.id === Number(data.gameId))

    let member = (game?.members || []).find((member) => member.id === data.userId)
    if(!member) {
      member = { userId: Number(data.userId), socketId: socket.id}
      game.members.push(member)
    }
  })
})


server.listen(port)