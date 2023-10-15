function myFunction() {
  document.getElementById("miniMenu").classList.toggle("show");
}
  
  // Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.headerProfile')) {
    var dropdowns = document.getElementsByClassName("miniMenu");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

async function initializeHeader(){
  var user = await getUserById(localStorage.getItem("User ID"))
  var profilePictures = document.getElementById("profilePicture")
  profilePictures.src = user.profilePic
}

function logOut(){
  localStorage.removeItem("User ID")
}

initializeHeader()