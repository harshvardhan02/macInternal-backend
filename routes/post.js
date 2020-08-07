const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

/*===============================================================================
                            Moduel Schema for Book
============================================================================== */

const Post = mongoose.model('post', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        trim: true
    },
    body: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 6500,
        trim: true
    }
}))

/*===============================================================================
                                Create Api
============================================================================== */

router.post('/create_post', async (req, res) => {
    const postSchema = Joi.object({
        title: Joi.string().min(3).max(255).required().trim(),
        body: Joi.string().min(10).max(6500).required().trim()
    });

    const result = postSchema.validate(req.body);
    console.log(result);

    if (result.error) {
        res.status(400).send(result.error.details[0].message)
    } else {
        res.status(200).send({ status: true, message: 'post created successfully' })
    }

    let post = new Post({
        title: req.body.title,
        body: req.body.body
    })
    post = await post.save();
    // res.send(post);
});

/*===============================================================================
                                    Read Api
============================================================================== */

router.get('/get_posts', async (req, res) => {
    // for pagination example
    // http://localhost:4500/api/v1/get_posts?page=0&limit=5
    const pageOptions = {
        page: parseInt(req.query.page),
        limit: parseInt(req.query.limit)
    }

    const posts = await Post.find()
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .exec(function (err, result) {
            if (err) {
                let row = {
                    status: false,
                    status_code: 400,
                    message: 'There is some issue'
                }
                res.status(400).send(row);
            } else {
                let row = {
                    status: true,
                    status_code: 200,
                    message: 'Posts fetched successfully',
                    data: result
                }
                console.log(result);
                res.status(200).send(row)
            }
        })
})

/*===============================================================================
                            Read Api By Id
============================================================================== */

router.get('/get_postsById/:id', async (req, res) => {
    const posts = await Post.findById(req.params.id)
        .exec(function (err, result) {
            if (err) {
                let row = {
                    status: false,
                    status_code: 400,
                    message: 'There is some issue'
                }
                res.status(400).send(row);
            } else {
                let row = {
                    status: true,
                    status_code: 200,
                    data: result
                }
                console.log(result);
                res.status(200).send(row)
            }
        })
})

/*===============================================================================
                                Update Api By Id 
============================================================================== */

router.put('/update_post/:id', async (req, res) => {
    const postSchema = Joi.object({
        title: Joi.string().min(3).max(255).required().trim(),
        body: Joi.string().min(10).max(6500).required().trim()
    });

    const result = postSchema.validate(req.body);
    console.log(result);

    if (result.error) {
        res.status(400).send(error.details[0].message);
    } else {
        //res.status(200).send({ status: true, message: "Post updated successfully" })
        const post = await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body
        }, { new: true });
        if (!post) return res.status(400).send('The post with given Id was not found');
        // res.send(post);
        res.status(200).send({ status: true, message: 'post updated successfully', data: post })
    }
})

/*===============================================================================
                            Delete Api By Id
============================================================================== */

router.delete('/delete_post/:id', async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id)
    if (!post) {
        res.status(400).send('The post with given Id was not found')
    } else {
        res.status(200).send({ status: true, message: 'Post deleted successfully' })
    }
})

/*===============================================================================
                            get home
============================================================================== */

router.get('/', async (req, res) => {
    const post = true
    if (!post) {
        res.status(400).send('Connection not found')
    } else {
        res.status(200).send({ status: true, message: 'Connection found successfully' })
    }
})

module.exports = router;