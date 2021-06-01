const router = require('express').Router();
const{LogModel} = require('../models');
const middleware = require('../middleware');

/*

POST:
/log/ - Create a workout log with log properties

GET:
    /log/ = gets all logs for an individual user
    /log/:id  = gets all logs by id for an individual user

PUT: 
    /log/:id = allows individual logs to be updated by a user

DELETE: 
    /log/:id = allows individual logs to be deleted by a user

*/


router.post('/', middleware.validateSession, async (req, res)=> {
    const {description, definition, result, owner_id} = req.body;

    try{
        const Log = await LogModel.create({
            description, definition, result, owner_id: req.user.id
        });

        res.status(201).json({
            message: "Log successfully created!",
            Log
        })
    }catch (err){
        res.status(500).json({
            message: `Failed to create log: ${err}`
        })
    }

});

router.get('/', async (req, res)=> {
    try {
        const allLogs = await LogModel.findAll();
        res.status(200).json(allLogs);
    }catch(err){
        res.status(500).json({error:err});
    }

});

router.get('/:id', middleware.validateSession, async (req, res)=> {
    try {
        const userLogs = await LogModel.findAll({
            where: {id: owner_id}
        });
        res.status(200).json(userLogs);
    }catch(err){
        res.status(500).json({error: err});
    }

});

router.put('/:id', middleware.validateSession, async (req, res) => {
    const {description, definition, result} = req.body;

    try {
        const logUpdate = await LogModel.update({description, definition, result},
            {where: {id: req.params.id}})

            res.status(200).json({
                message: "Log successfully updated",
                logUpdate
            })
    }catch (err){
        res.status(500).json({
            message: `Failed to update log ${err}`
        })

    }
});

router.delete('/delete/:id', middleware.validateSession, async (req, res) => {
    try {
        const logDeleted = await LogModel.destroy({
            where: {id: req.params.id}
        })

        res.status(200).json({
            message: "Log successfully deleted.",
            logDeleted
        })
    }catch (err){
        res.status(500).json({
            message: `Failed to delete log: ${err}`
        })
    }
});


module.exports = router;