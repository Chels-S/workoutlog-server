const e = require('express');
const {UniqueConstraintError} = require('sequelize');
const router = require('express').Router();
const {UserModel} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get ('/practice', (req, res)=> {
    res.send("This is the test response from the user controller")
});


/*
POST: 
    /user/regiser
    /user/login
    

*/

router.post('/register', async (req, res) => {
    const {username, password} = req.body;

    try {
        const newUser = await UserModel.create({
            username,
            password: bcrypt.hashSync(password, 13)
        })

        const token = jwt.sign (
            {id: newUser.id},
            process.env.JWT_SECRET,
            {expiresIn: 60*60*12}
        )

        res.status(201).json({
            message: "User successfully registered!",
            user: newUser,
            token
        })

    } catch(error) {
        if (error instanceof UniqueConstraintError){
            res.status(409).json ({
                message: `Username is already in use`
            });
        }else {
            res.status(500).json({
                error: `Failed to register user ${error}`
            })
        }
        
    }
});

router.post('/login', async (req, res)=> {
    let {username, password} = req.body;

    try {
        let userLogin = await UserModel.findOne({
            where: {username: username},
        });

        if (userLogin) {
            let passwordComparison = await bcrypt.compare (password, userLogin.password);
            if (passwordComparison){
                let token = jwt.sign (
                    {id: userLogin.id},
                    process.env.JWT_SECRET,
                    {expiresIn: 60*60*12}
                    )
                    
                    res.status(200).json({
                        user: userLogin,
                        message: "Sucessfully logged in!",
                        token
                    });
                }else {
                    res.status(401).json({
                        message: "Incorrect email or password."
                    })
                }
                
        }else {
            res.status(401).json({
                message: "Incorrect email or password."
            });
        }



    } catch (error){
        res.status(500).json({
            message: "Login failed."
        })
    }
});



module.exports = router;