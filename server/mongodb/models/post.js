import mongoose from 'mongoose'; // Defines schema

const Post = new mongoose.Schema({ // New schema
  name: { type: String, required: true },
  prompt: { type: String, required: true },
  photo: { type: String, required: true },
});

const PostSchema = mongoose.model('Post', Post); // New model

export default PostSchema;
