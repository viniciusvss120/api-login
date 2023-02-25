const Users = require('../models/Users')
const PasswordToken = require('../models/PasswordToken')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { use } = require('../router/routes')

const secret = "O Palmeiras não tem mundial"

class UserController{

    async login(req,res){
        try {
            let {email, password} = req.body

            let user = await Users.findByEmail(email)

            if(user){
                let result = await bcrypt.compare(password, user.password)

                if(result){
                    let token = jwt.sign({id: user.id, name: user.name, email: user.email, password: user.password}, secret)
                    
                    let userId = jwt.verify(token,secret, (err,data) => {
                        if(err) {
                            res.status(401)
                            res.json("Token invalido.")
                        }else{
                            return data.id
                        }
                    })
                    
                    res.status(200)
                    res.json({token: token, userId})
                }else{
                    res.status(401)
                    res.send("Senha incorreta!!")
                }
            }else{
                res.status(401)
                res.send("Email invalido")
            }

        } catch (error) {
            console.log("Deu ruim :(", error)
            return []
        }
    }


    async recoverPassword(req, res){
        let email = req.body.email
        let user =  await Users.findByEmail(email)

        if(user != undefined) {
            var result = await PasswordToken.create(user)
        }else{
            res.status(406)
            res.send("E-mail não encontrado!")
        }

        if(result.status){
            res.status(200)
            res.send("" + result.token)
        }else{
            res.status(406);
            res.send(resultado.err);
        }
    }

    async chengePassword(req,res){
        let { token, password} = req.body

        let result = await PasswordToken.validete(token)

        if(result.status){
            await Users.chengePassword(password, result.token.user_id, result.token.token)

            res.status(200)
            res.send("senha alterada!!")
        }else{
            res.status(406);
            res.send("Token inválido!");
        }

    }

    async viewsUsers(req,res){
        let user = await Users.findAll()

        if(user){
            res.status(200)
            res.json({usuario: req.loggedUser,user: user})
        }else{
            res.status(401)
            res.send("Deu ruim")
        }

    }

    async createUser(req,res){
        let {name,email,password,telefone} = req.body

        if(email == undefined || password == undefined || telefone == undefined){
            res.send("Dados invalidos!!")
        }

        await Users.create(name,email,password,telefone)
        res.status(200)
        res.send("Deu certo!")
    }

    async editUser(req,res){
      let {id,name, email, password, telefone,category} = req.body
      
      let user = {
          name: name ? name : null,
          email: email ? email : null,
          password: password ? password : null,
          telefone: telefone ? telefone : null,
          category: category ? category : null
      }
      try {
        let result = await Users.findById(id)
        if(result != undefined){
          await Users.chengeUser(user,id)
            res.status(200)
            res.send("Deu certo!")
          }              
       }catch (error) {
          console.log(error)
        }
            
    }

    async deleteUser(req,res){
        let id = req.params.id

        let user = await Users.findById(id)

        if(user != undefined){
            try {
                await Users.removeUser(id)

                res.status(200)
                res.send("Usuário excluido com sucesso!")
            } catch (error) {
                console.log(error)
            }
        }else{
            res.send("Usuario não encontrado!")
        }
    }
}

module.exports = new UserController()