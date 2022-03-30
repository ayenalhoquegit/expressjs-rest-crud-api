const express = require('express')
const router = express.Router()
const dbConn = require('../db/connection')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

router.post('/singnup', async(req,res)=>{
    const hashPass = await bcrypt.hash(req.body.password,10)
    req.body.hashPass = hashPass
    dbConn.query(`INSERT INTO users (name,email,password) values ('${req.body.name}','${req.body.email}', '${req.body.hashPass}')`, (error, results,fields)=>{
        if(error) throw error
        return res.send({error:false, message:'User create successfuly'})
    })
})

router.post('/login', async(req,res)=>{
    const email = req.body.email;
    if(!email){
        return res.status(400).send({error:true, message:'Please provide user email'})
    }else{
        dbConn.query(`SELECT * FROM users where email='${email}'`, (error,result,fields)=>{
            if(error){
                return res.status(400).send({message: error  })                                    
            }
            if(!result.length){
                return res.status(401).send({message: 'Incorrect email'  })   
            }
            
            bcrypt.compare(req.body.password,result[0]['password'],(bErr, bResult) => {  
                console.log(bErr)      
                console.log(bResult)      
                if (!bResult) {          
                    return res.status(401).send({message: 'Incorrect password' }) 
                }else{
                    const token = jwt.sign({userId:result[0].id, username:result[0].name},process.env.JWT_SECRET,{ expiresIn: '1h' });
                    return res.status(200).send({message: 'Login success',token:token }) 
                } 
                        
            })
            
                
        })
    }
    
})


module.exports=router