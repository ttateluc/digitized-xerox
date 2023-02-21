import FileSaver from 'file-saver';
import { surpriseMePrompts } from '../constant';

/* Generates a random index within the range of surpriseMePrompts 
 * and returns the corresponding value. If the randomly selected 
 * prompt matches the provided prompt, the function calls itself 
 * recursively until it finds a prompt that is not equal to the provided prompt.
 */
export function getRandomPrompt(prompt) {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if (randomPrompt === prompt) return getRandomPrompt(prompt);

  return randomPrompt;
}

/* Exports an asynchronous function called downloadImage
 * that takes two parameters, _id and photo. The function 
 * uses the FileSaver.saveAs() method to save the photo
 * as a file with the name download-${_id}.jpg. 
 * The saveAs() method is a part of the file-saver 
 * package and allows you to save files on the client-side.
 */
export async function downloadImage(_id, photo) {
  FileSaver.saveAs(photo, `download-${_id}.jpg`);
}
