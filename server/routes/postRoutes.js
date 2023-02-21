import express from 'express';  // import the 'express' module
import * as dotenv from 'dotenv';  // import the 'dotenv' module
import { v2 as cloudinary } from 'cloudinary';  // import the 'cloudinary' module

import Post from '../mongodb/models/post.js';  // import the 'Post' model from a file path

dotenv.config();  // load environment variables from a .env file

const router = express.Router();  // create an instance of an Express router

// configure the Cloudinary module with the API keys from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// handle GET requests to the root URL
router.route('/').get(async (req, res) => {
  try {
    const posts = await Post.find({});  // fetch all posts from the MongoDB database
    res.status(200).json({ success: true, data: posts });  // send a JSON response with the fetched posts
  } catch (err) {
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });  // send an error message if the fetch fails
  }
});

// handle POST requests to the root URL
router.route('/').post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;  // extract the name, prompt, and photo from the request body
    const photoUrl = await cloudinary.uploader.upload(photo);  // upload the photo to Cloudinary and get the URL of the uploaded photo

    const newPost = await Post.create({  // create a new post in the MongoDB database with the extracted data and the photo URL
      name,
      prompt,
      photo: photoUrl.url,
    });

    res.status(200).json({ success: true, data: newPost });  // send a JSON response with the created post
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to create a post, please try again' });  // send an error message if the creation fails
  }
});

export default router;  // export the Express router as the default module
