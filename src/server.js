require('dotenv').config();
const express = require('express')
const app = express()
app.use(express.json());
const dbConn = require('./db/connection')
const userRoute = require('./routes/userRoutes')
const checkLogin = require('./middleware/checkLogin')
const log4js = require('log4js')
log4js.configure({
    appenders: { 
        out: { type: "stdout" },
        app: { type: "file", filename: "app.log" },
        multi:{ type: 'multiFile', base: 'logs/', property: 'categoryName', extension: '.log' }
    },
    categories: { default: { appenders: ["multi"], level: "debug" } }
});
const logger = log4js.getLogger()
logger.debug("Get debug logger")



// user registration route
app.use('/', userRoute)
// default route
app.get('/', (req, res)=>{
   return res.send({error:false, message:'hello'})
})

// retrive user data
app.get('/users', checkLogin, (req,res)=>{
    dbConn.query('SELECT * FROM users', (error,r,fields)=>{
        if (error) throw error;
        return res.send({ error: false, data: r, message: 'get users list.' });
    })
})
// Retrive user by id
app.get('/user/:id', (req, res)=>{
    let user_id  = req.params.id;
    if(!user_id){
        return res.status(400).send({error:true, message:'Please provide user id'})
    }else{
        dbConn.query(`SELECT * FROM users where id=${user_id}`, (error,results,fields)=>{
            if(error) throw error;
            return res.send({error:false, data:results[0], message:'get user by id'})
        })
    }
})
// Add new user
app.post('/user',(req,res)=>{
    dbConn.query(`INSERT INTO users (name,email) values ('${req.body.name}','${req.body.email}')`, (error, results,fields)=>{
        if(error) throw error
        return res.send({error:false, message:'User create successfuly'})
    })
})

// update a user by id 
app.put('/user',(req,res)=>{
    let id = req.body.id
    if(!id){
        return res.status(400).send({error:true, message:'Please provide user id'}) 
    }else{
        dbConn.query(`UPDATE users set name='${req.body.name}', email='${req.body.email}' where id='${id}'`, (error,results,fields)=>{
            return res.send({error:false, message:'User updated successfully'})
        })
    }

})

// delete user
app.delete('/user',(req,res)=>{
    let id = req.body.id
    if(!id){
        return res.status(400).send({error:true, message:'Please provide user id'}) 
    }else{
        dbConn.query(`DELETE FROM  users  where id='${id}'`, (error,results,fields)=>{
            return res.send({error:false, message:'User deleted successfully'})
        })
    }

})
// route handler
app.get('/example', (req, res, next) => {
    console.log('the response will be sent by the next function ...')
    next()
  }, (req, res) => {
      console.log('from B')
    res.send('Hello from B!')
  })

const port = process.env.PORT || 8000
// App listen
app.listen(port,()=>{
    console.log(`App is running on port ${port} `)
})
//module.exports = app
