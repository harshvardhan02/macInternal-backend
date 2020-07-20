const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const Comment = mongoose.model('comments', new mongoose.Schema({
    post_id: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        trim: true
    },
    comment: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        trim: true
    }
}));

/*==========================================================================================
                                    Create Comment API
==========================================================================================*/

router.post('/create_comment', async (req, res) => {
    const postSchema = Joi.object({
        post_id: Joi.string().min(3).max(255).required().trim(),
        comment: Joi.string().min(3).max(255).required().trim()
    });

    const result = postSchema.validate(req.body);
    console.log(result);

    if (result.error) {
        res.status(400).send(result.error.details[0].message)
    } else {
        // res.status(200).send({ status: true, message: 'post created successfully' })
        let post = new Comment({
            comment: req.body.comment,
            post_id: req.body.post_id
        })
        post = await post.save();
        res.status(200).send({ status: true, message: 'Comment added Successfully' })
    }
});

/*==========================================================================================
                                    Get Comments API
==========================================================================================*/

router.get('/get_comments/:id', async (req, res) => {
    const comment = await Comment.find({
        post_id: req.params.id
    }
    )
        .exec(function (err, result) {
            if (err) {
                let row = {
                    status: false,
                    status_code: 400,
                    message: 'There is some issue'
                }
                res.status(400).send(row);
            } else {
                if (result.length > 0) {
                    let row = {
                        status: true,
                        status_code: 200,
                        data: result
                    }
                    console.log(result);
                    res.status(200).send(row)
                } else {
                    let row = {
                        status: false,
                        status_code: 400,
                        data: "No comments found"
                    }
                    console.log(result);
                    res.status(400).send(row)
                }
            }
        })
})

module.exports = router;