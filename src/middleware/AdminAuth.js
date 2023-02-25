const jwt = require('jsonwebtoken')
const secret = "O Palmeiras não tem mundial"


class AdminAuth{

    // Falta validações para acessar as funcionalidades do sistemas
    decoded(req,res,next){
        const authToken = req.headers['authorization']
        
        if(authToken != undefined){
            const bearer = authToken.split(' ')
            let token = bearer[1]
    
            jwt.verify(token,secret,(err,data) => {
                if(err){
                    res.status(401)
                    res.json({err: "Token Invalido!"})
                }else {          
                    // res.status(200)
                    req.token = token
                    req.loggedUser = {id: data.id, email: data.email}
                    next()
                }
            })
        }else{
            res.status(401)
            res.json({err: "falha Token Invalido!!"})
        }
    }

    validateEdit(req,res,next){
        // Essa função validará se o usuário logado esta editando apenas os imoveis que ele postou.
        const authToken = req.headers['authorization']

        if(authToken != undefined){
            const bearer = authToken.split(' ')
            let token = bearer[1]
    
            jwt.verify(token,secret, async (err,data) => {
                if(err){
                    res.status(401)
                    res.json({err: "Token Invalido!!!"})
                }else{
                    req.idImovel = {id: data.id}
                    next()
                }

                // try {
                //     let imoveis = await Imoveis.findImoveisUser(data.id)

                //     imoveis.forEach(imovel => {
                //         if(imovel.imoveis_id == data.id){
                //             req.idImovel = {id: imovel.id}
                //             next()
                //         }else{
                //             res.status(401)
                //             res.json({err: "Usuario não tem acesso!"})
                //         }
                //     })
    
                  
                // } catch (error) {
                //     console.log(error)
                // }
           

            })
        }
    }
}

module.exports = new AdminAuth()