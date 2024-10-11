//! Structure Code


import { tryToGetUser } from "https://dev.gymburgdorf.ch/auth/Authhelpers-min.js";

document.addEventListener("DOMContentLoaded", async function() {

  const mainContainer = document.querySelector('.mainContainer');
  mainContainer.classList.add("show");

  const userContainer = document.querySelector(".connect");
  userContainer.addEventListener('click', connect);
  
});

//! Fetch user data and set user-related variables
let userData = await tryToGetUser();
const userType = userData.type;
const userName = sessionStorage.getItem('userName') || userData.email;
const userPic = 'https://dev.gymburgdorf.ch/auth/getpic';

sessionStorage.setItem('userName', userName);
sessionStorage.setItem('userPic', userPic);

console.log("userType", userType); 
console.log("userName", userName); 
console.log("userPic", userPic); 

//! Connect function triggered by user interaction
async function connect(){
  
  if (!userData) {
    throw new Error("failed to fetch userdata", error);
  } else {
      await handleUserDirectory();
      login();
  }
}

//! Handle user directory check and creation
async function handleUserDirectory() {
  
  if (!userName) {
    throw new Error('No userName in sessionStorage');
  } 
   
  try {
    let response = await fetchPost("/api/checkDirectory", { userName });
    let check = await response.json();

    if (check.directoryExists) {
      console.log("User directory exists.");
      return;
    } else {
      console.log("userName", userName);
      await fetchPost("/api/createDirectory", { userName });
      console.log("dir created");
    }
  } catch (error) {
    console.error(error);
  }
}

//! Function to make a POST request
function fetchPost(url, data) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
  
  return fetch(url, options);
}

//! Function to trigger login based on user type
function login() {
  // Construct the URL with the query parameter
  const url = `/login?type=${encodeURIComponent(userType)}`;

  console.log("userType:", userType);

  // Create a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // Configure it: GET-request for the URL
  xhr.open('GET', url, true);

  // Set up the callback function to handle the response
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        // Success: Check response and handle redirection
        if (xhr.responseText === 'Invalid user type!') {
          console.log('Invalid user type');
        } else {
          // Redirect based on the response
          window.location.href = xhr.responseURL;
        }
      } else {
        // Handle errors
        console.error('Error during the request:', xhr.status, xhr.statusText);
      }
    }
  };

  // Send the request
  xhr.send();
}















//! Original Code for backup

// import { tryToGetUser } from "https://dev.gymburgdorf.ch/auth/Authhelpers-min.js";

// document.addEventListener("DOMContentLoaded", async function() {

//   const mainContainer = document.querySelector('.mainContainer');
//   mainContainer.classList.add("show");

//   const userContainer = document.querySelector(".connect");
//   userContainer.addEventListener('click', connect)
  
  
// });


// let userData = await tryToGetUser()
// const userType = userData.type
// const userName = sessionStorage.getItem('userName') || userData.email
// const userPic = 'https://dev.gymburgdorf.ch/auth/getpic'

// sessionStorage.setItem('userName', userName)
// sessionStorage.setItem('userPic', userPic)

// console.log("userType", userType) 
// console.log("userName", userName) 
// console.log("userPic", userPic) 

// async function connect(){
  
//   if (!userData){
//     throw new Error("failed to fetch userdata", error)
//       } else{
//           await handleUserDirectory()
//           login()
//         }
// }

// async function handleUserDirectory() {
  
//   if(!userName){
//     throw new Error('No userName in sessionStorage');
//   } 
   
//   try {
//     let response = await fetchPost("/api/checkDirectory", { userName });
//     let check = await response.json();

//     if (check.directoryExists) {
//      console.log("User directory exists.");
//      return
//     } else {
//         console.log("userName", userName)
//         await fetchPost("/api/createDirectory", { userName });
//         console.log("dir created")
//       }
//     } catch (error) {
//       console.error(error)
//   }
// }


// function fetchPost(url, data) {
//      const options = {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data)
//   };
  
//   return fetch(url, options);
// }


// // Function to trigger login based on user type
// function login() {
//   // Construct the URL with the query parameter
//   const url = `/login?type=${encodeURIComponent(userType)}`;

//   console.log("userType:", userType)

//   // Create a new XMLHttpRequest object
//   const xhr = new XMLHttpRequest();

//   // Configure it: GET-request for the URL
//   xhr.open('GET', url, true);

//   // Set up the callback function to handle the response
//   xhr.onreadystatechange = function () {
//     if (xhr.readyState === XMLHttpRequest.DONE) {
//       if (xhr.status === 200) {
//         // Success: Check response and handle redirection
//         if (xhr.responseText === 'Invalid user type!') {
//           console.log('Invalid user type');
//         } else {
//           // Redirect based on the response
//           window.location.href = xhr.responseURL;
//         }
//       } else {
//         // Handle errors
//         console.error('Error during the request:', xhr.status, xhr.statusText);
//       }
//     }
//   };

//   // Send the request
//   xhr.send();
// }

