const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');
const route
r = new express.Router() //creating a router with express

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        const saved = await user.save();
        sendWelcomeEmail(saved.email, saved.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ token, saved });
    } catch(e) {
        res.status(400).send(e);
    }
    // user.save()
    //     .then(() => res.status(201).send(user))
    //     .catch((error) => res.status(400).send(error))
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch(e) {
        res.status(400).send(e);
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();
        res.send({ message: 'Logout success!' });
    } catch(e) {
        res.status(500).send(e);
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send({ message: 'Logout of all accounts was success.' });
    } catch(e) {
        res.status(500).send(e);
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if(!user) {
            return res.status(404)
                      .send({ 
                                status: 404,
                                error: 'User not found',
                                message: 'Not found'
                            });
        }
        res.send(user);
    } catch(e) {
        res.status(500).send(e)
    }
    // User.findById(_id)
    //     .then(user => {
    //         if(!user) {
    //             return res.status(404)
    //                       .send({ 
    //                                 status: 404,
    //                                 error: 'User not found',
    //                                 message: 'Not found'
    //                             });
    //         }
    //         res.send(user);
    //     })
    //     .catch(error => res.status(500).send(error));
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdate = ['name', 'age', 'email', 'password'];
    const isValid = updates.every(field => allowUpdate.includes(field))
    
    if(!isValid) {
        return res.status(400).send( { error: 'Invalid field to update'})
    }
    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        // const user = await User.findById(req.params.id);
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();

        // if(!user) {
        //     return res.status(404)
        //               .send({ 
        //                         status: 404,
        //                         error: 'User not found',
        //                         message: 'Not found'
        //                     });
        // }
        res.send(req.user);
    } catch(e) {
        res.status(400).send(e);
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const deleted = await User.findByIdAndDelete(req.user._id);
        // if(!deleted) {
        //     return res.status(404).send({
        //         error: 'User not found',
        //         message: 'Not found',
        //         status: 404
        //     })
        // }
        // res.send(deleted)
        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);
        res.send(req.user)
    } catch(e) {
        res.send(500).send(e);
    }
})

const avatar = multer({
    limits: {
        fileSize: 1000000 //bytes
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            cb(new Error('Just images are accepted'));
        }
        cb(undefined, true);
    }
});

// validar el tamaño del file y el tipo de archivo
router.post('/users/me/avatar', auth, avatar.single('avatar'), async (req, res) => {
    // req.user.avatar = req.file.buffer;
    const buffer = await sharp(req.file.buffer)
                            .resize({ width: 250, height: 250 })
                            .png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send({ message: 'Upload success' });
}, (error, req, res, next) => { //funcion para retornar error en formato json
    res.status(400).send({ message: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send({ message: 'Pic profile deleted' });
})

router.get('/users/:id/avatar', async (req, res) => {
    console.log('something');
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    } catch(e) {
        res.status(404).send(e);
    }
})

module.exports = router;