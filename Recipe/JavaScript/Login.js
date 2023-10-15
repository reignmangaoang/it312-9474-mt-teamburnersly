async function userExists(){
    let users = await fetch("Data/Users.json")
    let userList = await users.json()
    for(let i = 0; i <userList.length; i++){
        var user = userList[i]
        var userName = document.getElementById("username").value
        var password = document.getElementById("password").value
        if(user.userName==userName&&user.password==password){
            localStorage.setItem("User ID",user.userid)
            window.location.href="profile.html"
            return
        }
    }
    console.log("False")    
}

function initializeLogIn(){
    if(!(localStorage.getItem("User ID")==null)){
        window.location.href = "profile.html" 
    }
}
initializeLogIn()