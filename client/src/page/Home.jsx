import React, { useEffect, useState } from 'react'; // Allows functional components to use state variables
import { Card, FormField, Loader } from '../components'; // Imports Card component, formfield component, and Loader animation component

import swal from 'sweetalert'; // Imports custom popup message library for default alert() replacement

/*A functional component to render a list of cards or a title if there are posts to show*/
const RenderCards = ({ data, title }) => { // Data-Title props
  if (data?.length > 0) { // Safely accessses length to see if data exists
    return (
      data.map((post) => <Card key={post._id} {...post} />) // Returns mapped array of card components
    );
  }

  return ( // No data
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2> // Returns title prop for "no posts" indicator
  );
};

// The main functional component for the Home page
const Home = () => {
  // Set up state variables to manage loading status and post data
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  // Set up state variables to manage search functionality
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);

  /* An async function to fetch posts from a local API and update state with the response */
  const fetchPosts = async () => {

    setLoading(true); // Displays loading animation as default on site refresh

    try {
      const response = await fetch('http://localhost:8080/api/v1/post', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json(); // Converts the response body to JSON format and sets the allPosts state to the array of data objects returned from the API.
        setAllPosts(result.data.reverse()); // Reverses the order of the posts, so that the newest post appears first
      }
    } catch (err) {
      swal(err);
    } finally {
      setLoading(false);
    }
  };

  /* Fetches posts when the component mounts (every render, default state) */
  useEffect(() => {
    fetchPosts();
  }, []);

  // A function to handle changes to the search input and filter posts accordingly
  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout); // Ensures the function is not called too frequently, which slows down the app
    setSearchText(e.target.value); // Updates searchText state to input value

    setSearchTimeout( // Sets new timeout
      setTimeout(() => { // Runs code within after 100 ms
        const searchResult = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase())); // Filters the allPosts array to find any items where the name or prompt includes the search text w/ case insensitivity
        setSearchedResults(searchResult);
      }, 100),
    );
  };

  // If response successful, render the component
  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#ffffff] text-[32px]">Our Private Gallery</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Browse through a collection of imaginative and visually stunning images generated by DALL-E AI</p>
      </div>

      <div className="mt-16">
        <FormField
          labelName="Your Name"
          type="text"
          name="text"
          placeholder="Search for a prompt"
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing Resuls for <span className="text-[#222328]">{searchText}</span>:
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchedResults}
                  title="No Results"
                />
              ) : (
                <RenderCards
                  data={allPosts}
                  title="No Posts"
                />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
