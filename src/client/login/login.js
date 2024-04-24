const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const container = document.getElementById("container");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  // send data for authentication, to be implemented
  console.log("Login submitted:", { username, password });
  container.innerHTML = `Successfully Logged In! 
        <a href="../index.html">Home</a>`;
});

signupForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;
  // send data to authentication, to be implemented
  console.log("Sign Up submitted:", { username, password });
});
