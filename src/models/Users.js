const database = require('../config/db')
const bcrypt = require('bcryptjs')
const PasswordToken = require('./PasswordToken')


class Users{
    async findAll(){
        try {
            let result = await database.select().table('users')
            return result
        } catch (error) {
            console.log("Deu ruim", error)
            return []
        }
       }
    
    async findByEmail(email){
        try {
            let result = await database.select('id','email','password').from('users').where({email: email})

            if(result.length > 0){
                return result[0]
            }else{
                return undefined
            }
        } catch (error) {
            console.log("Deu ruim!", error)
            return []
        }
    }
    async findById(id){
        try {
            let result = await database.select('id','email','password').from('users').where({id: id})

            if(result.length > 0){
                return result[0]
            }else{
                return undefined
            }
        } catch (error) {
            console.log("Deu ruim", error)
            return []
        }
    }

    async create(name,email,password,telefone,category){
        try {
            let hash = await bcrypt.hash(password, 10)
            await database.insert({name, email, password: hash, telefone,category}).table('users')
        } catch (error) {
            console.log("Deu ruim", error)
            return []
        }
    }

    async chengePassword(newPassword,id,token){
        try {
            let hash = await bcrypt.hash(newPassword, 10)
            await database.update({password: hash}).where({id: id}).table('users')
            await PasswordToken.setUsed(token)
        } catch (error) {
            console.log("Deu ruim", error)
        }
   
    }

    async chengeUser(user, id){
      const arrayUser = Object.keys(user)
      console.log(arrayUser)

      const userDiferenteDeNull = arrayUser.filter(item => user[item] != null)
      
      let newObject = {}

      userDiferenteDeNull.forEach(item => {
        return newObject[item] = user[item]
      })

      
        try {
          if(newObject.password){
            let hash = await bcrypt.hash(newObject.password, 10)
            newObject.password = hash
            await database.update(newObject)
            .where({id: id})
            .table('users')
          }
            
        } catch (error) {
            console.log("Deu ruim", error)
        }
    }

    async removeUser(id){
        try {
            await database.where({id: id}).delete().table('users')
        } catch (error) {
            console.log("Deu ruim", error)
        }

    }


}

module.exports = new Users()