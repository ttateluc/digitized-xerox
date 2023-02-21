import React, { useState } from 'react'; // Allows functional components to use state variables
import { useNavigate } from 'react-router-dom'; // Allows components to navigate to different pages within a web application.

import { preview } from '../assets'; // Imports an image file
import { getRandomPrompt } from '../utils'; // Imports custom function that retrieves random prompt from constants folder
import { FormField, Loader } from '../components'; // Imports formfield component and animation component

import swal from 'sweetalert'; // Imports custom popup message library for default alert() replacement

/* Creates a functional component that returns JSX to render UI */
const CreatePost = () => {
  const navigate = useNavigate(); // Imported from the react-router-dom library for page navigation

  // Represents form user will fill out
  const [form, setForm] = useState({
    name: '', // initial name field is empty
    prompt: '', // initial prompt field is empty
    photo: '', // initial photo field is empty
  });

  // Represents whether image is generating or not
  const [generatingImg, setGeneratingImg] = useState(false); // Image is not initially generating

  // Represents loading state for Loader component
  const [loading, setLoading] = useState(false); // Image is not initiallly loading

  // Event handler allowing input field updates dynamically
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Non-dynamic event handler for 'Surprise Me' prompt field button click
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  /* Generate an image using DALL-E API */
  const generateImage = async () => {
    if (form.prompt) { // Proceeds if prompt input is provided
      try {
        setGeneratingImg(true); // Alters 'Generate' button string to "Generating..."
        const response = await fetch('http://localhost:8080/api/v1/dalle', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ // Converts form JS to JSON
            prompt: form.prompt, // Sends the prompt which tells OPENAI what to generate
          }),
        });

        // Assume success
        const data = await response.json(); // Extracts JSON data from response
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` }); // Sets empty photo field to a link that will display generated photo

        // Catch failure
      } catch (err) {
        swal(err);

        // Alters 'Generate' button string to default "Generate"
      } finally {
        setGeneratingImg(false);
      }
    } else { // Input not provided, display error message
      swal('Please provide proper prompt');
    }
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents submission of input data on button press

    if (form.prompt && form.photo) { // Checks form.prompt(async function) and form.photo for input
      setLoading(true); // Displays Loader's animation component over image container
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }), // Send entire form field as JSON request for database and frontend display
        });
        await response.json();

        // Navigate back to the home page, simulating an autosuccess
        navigate('/');

        // Catch failure
      } catch (err) {
        swal(err);

      } finally {
        setLoading(false);
      }
    } else { // One lacks input, display error message
      swal('Please generate an image with proper details');
    }
  };

  // If response successful, render the component
  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#ffffff] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Generate an image with DALL-E AI and share it with the collective</p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A fantasy castle with hidden passageways and a labyrinthine dungeon"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className="relative bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            { form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-10"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className=" text-white bg-[#91dafc] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">** Once you have created the image you want, it is imperative you share it with the collective **</p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? 'Sharing...' : 'Share with the Community'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
