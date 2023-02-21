import express from 'express'; // Creates server and handles HTTP requests and responses
import * as dotenv from 'dotenv'; // Loads environment variables from a .env file
import { Configuration, OpenAIApi } from 'openai'; // Imports from the openai package

dotenv.config(); // Loads the environment variables from the .env file into process.env

const router = express.Router(); // Define HTTP routes

const configuration = new Configuration({ // Define instance of Configuration
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.route('/').get((req, res) => { // JSON call-response
  res.status(200).json({ message: 'Successful Vanilla Reload' });
});


/* Defines a POST endpoint for the root URL
 * that takes a prompt field from the request
 * body and sends it to the OpenAI API to 
 * generate an image. If successful, 
 * it sends a JSON response with the 
 * base64-encoded image. If unsuccessful, 
 * it sends a 500 error response with the 
 * error message.
 */
router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const aiResponse = await openai.createImage({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    const image = aiResponse.data.data[0].b64_json;
    res.status(200).json({ photo: image });
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message || 'Something went wrong');
  }
});

export default router;
