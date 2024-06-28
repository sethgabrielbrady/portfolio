import * as THREE from 'three';

// let userData;

// // use this for getting passed the Ngrok issue
//  async function getUsers() {

//   const response = await fetch("https://randomuser.me/api/?results=5");
//   let users = response.json();
//   console.log("users", users);
//   // let users = await JSON.parse(response);
//   if (users) {
//     userData = dataCleanup(users.results);
//     console.log("updatedUsers", userData);
//   }
// }
// getUsers();

const userDataGroupings = [];

 function dataCleanup(data) {
  let userArray = Array.from(data);
  let newUserArray = [];
  for (const user of userArray) {
    const newUserData = {};
    newUserData.name = user.name.first + " " + user.name.last;
    newUserData.location = user.location.city + ", " + user.location.country;
    newUserData.dob = user.dob.date;
    newUserData.age = user.dob.age;
    newUserData.postcode = user.location.postcode;
    newUserData.coordinates = user.location.coordinates.latitude + ", " + user.location.coordinates.longitude;
    newUserData.picture = user.picture;
    newUserData.email = user.email;
    newUserData.phone = user.phone;
    newUserData.cell = user.cell;
    newUserData.nat = user.nat;
    newUserData.gender = user.gender;
    newUserArray.push(newUserData);
  }
  return newUserArray;
}

// sizes include 'thumbnail', 'medium', or 'large'
function userImageTextureBySize(user, size,) {
  const textureLoader = new THREE.TextureLoader();
  // this is a proxy bypass CORS issue with the API image
  const proxyUrl = 'https://api.allorigins.win/raw?url=';
  const url = proxyUrl + user.picture[size];

  return textureLoader.load(url)
}

export { userDataGroupings, userImageTextureBySize, dataCleanup }
