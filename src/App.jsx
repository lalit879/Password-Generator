import { useState, useCallback, useEffect, useRef } from 'react';

// No need to import App.css if all styling is done with Tailwind

function App() {
  // State for password length, character types, and the generated password
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");

  // useRef hook to get a reference to the password input element for copying
  const passwordRef = useRef(null);

  /**
   * Generates a password based on the current state (length, numbers, chars).
   * useCallback is used to memoize the function, so it's only recreated when its dependencies change.
   */
  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numberAllowed) str += "0123456789";
    if (charAllowed) str += "!@#$%^&*()+-_{}[]~`";

    for (let i = 1; i <= length; i++) {
      // FIX: Use Math.floor(Math.random() * str.length) to get a valid index
      let charIndex = Math.floor(Math.random() * str.length);
      pass += str.charAt(charIndex);
    }

    setPassword(pass);
  }, [length, numberAllowed, charAllowed]); // setPassword is a setter and doesn't need to be a dependency

  /**
   * Copies the generated password from the input field to the user's clipboard.
   */
  const copyPasswordToClipboard = useCallback(() => {
    // Highlight the password text for user feedback
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 101); // Select a larger range to be safe
    // Use the modern Clipboard API
    window.navigator.clipboard.writeText(password);
  }, [password]);

  /**
   * useEffect hook to re-run the password generator whenever the
   * length or character settings change.
   */
  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  return (
    // Main container to center the content on the screen
    <div className="w-full h-screen bg-gray-900 flex justify-center items-center p-4">
      
      {/* Increased max-width for better look on larger screens (max-w-2xl) */}
      <div className='w-full max-w-2xl mx-auto shadow-md rounded-lg px-6 py-8 text-orange-500 bg-gray-800'>
        
        {/* FIX: Corrected typo "Genarator" -> "Generator" and increased text size */}
        <h1 className='text-white text-center text-2xl underline mb-6'>Password Generator</h1>
        
        <div className='flex shadow rounded-lg overflow-hidden mb-6'>
          <input
            type="text"
            value={password}
            className='outline-none w-full py-2 px-4 bg-gray-200 text-gray-800'
            placeholder='Password'
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className='outline-none bg-blue-700 hover:bg-blue-800 text-white
            px-4 py-2 shrink-0 transition-colors duration-200'>Copy</button>
        </div>
        
        {/* Controls for length, numbers, and characters */}
        <div className='flex flex-col sm:flex-row text-sm gap-y-4 sm:gap-x-4'>
          <div className='flex items-center gap-x-2 flex-1'>
            <input
              type="range"
              min={6}
              max={100}
              value={length}
              className='cursor-pointer w-full'
              onChange={(e) => { setLength(e.target.value) }}
            />
            <label className="whitespace-nowrap">Length: {length}</label>
          </div>
          <div className='flex items-center gap-x-2'>
            <input
              type='checkbox'
              checked={numberAllowed} // Use 'checked' for controlled component
              id='numberInput'
              onChange={() => {
                setNumberAllowed((prev) => !prev);
              }}
            />
            {/* FIX: Swapped labels for clarity and correctness */}
            <label htmlFor='numberInput'>Numbers</label>
          </div>
          <div className='flex items-center gap-x-2'>
            <input
              type='checkbox'
              checked={charAllowed} // Use 'checked' for controlled component
              id='charInput' // FIX: Changed ID to be unique
              onChange={() => {
                setCharAllowed((prev) => !prev);
              }}
            />
            <label htmlFor='charInput'>Characters</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
