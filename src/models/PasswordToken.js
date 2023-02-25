const database = require('../config/db')

class PasswordToken{

    async create(user){
        // let user = await Users.findByEmail(email)

        // if(user != undefined){
            try {
                let token = Date.now()
                await database.insert({token, user_id: user.id, used: 0}).table('passwordtokens')    
                return {status: true, token: token}
            } catch (error) {
                console.log("Deu ruim", error)
                return {status: false, err: error}
            }
        // }else{
        //     return {status: false, err: "O e-mail passado não existe no banco de dados!"}
        // }
    }

    async validete(token){
        try {
            
            let result = await database.select().where({token: token}).table('passwordtokens')

            if(result.length > 0){
                let tk = result[0]
    
                if(tk.used){
                    return {status: false}
                }else{
                    return {status: true, token: tk}
                }
            }else{
                return {status: false}
            }

        } catch (error) {
            console.log(error)
            return {status: false}
        }
  
    }

    async setUsed(token){
        await database.update({used: 1}).where({token: token}).table('passwordtokens')
    }
}

module.exports = new PasswordToken()