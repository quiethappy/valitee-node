const { games } = require("../../data")

let id = 0

class GameController {
    add(ctx, next){
        const createGameId = id++
        games.push({
            id: createGameId,
            members: [],
            status: 0, // 表示游戏进行中
        })
        ctx.body = {
            data: createGameId
        }
    }
    detail(ctx, next) {
        console.log(games, typeof ctx.params.id)
        const game = games.find(v => v.id === Number(ctx.params.id))
        ctx.body = {
            data: game || null
        }
       
    }
    list(ctx, next){
        ctx.body = {
            data: games
        }
    }
}

module.exports = GameController