let picked = "own"

async function showOwnRecipes(id){
    picked = "own"
    var allRecipes = await getAllRecipes()
    var chosenRecipes = await getRecipeByUserId(allRecipes,id)
    await clearAllRecipes()
    showRecipeInList(chosenRecipes)
}

async function showSavedRecipes(id){
    picked = "saved"
    var allRecipes = await getAllRecipes()
    var finalList = await getSavedRecipes(allRecipes,id)
    await clearAllRecipes()
    showRecipeInList(finalList)
}

async function showAllRecipes(){
    picked = "all"
    var allRecipes = await getAllRecipes()
    await clearAllRecipes()
    showRecipeInList(allRecipes)
}
async function showAllRecipes2(){
    var currentList = await getAllRecipes()
    if (picked == "own"){
        currentList = await getRecipeByUserId(currentList,userId)
    } else if (picked == "saved"){
        currentList = await getSavedRecipes(currentList,userId)
    }
    await clearAllRecipes()
    showRecipeInList(currentList)
}
async function showRecipeByType(type){
    var currentList = await getAllRecipes()
    if (picked == "own"){
        currentList = await getRecipeByUserId(currentList,userId)
    } else if (picked == "saved"){
        currentList = await getSavedRecipes(currentList,userId)
    }
    currentList = await getRecipeByType(currentList,type)
    await clearAllRecipes()
    showRecipeInList(currentList)
}

async function showRecipeById(id){
    var recipe = await getRecipeById(id) 
    var chosenUser = await getUserById(recipe.recipeAuthor)
    var div = document.createElement("div")
    div.setAttribute("class","recipeTab")
    var pic = document.createElement("img")
    pic.src = (recipe.recipePicture)
    div.appendChild(pic)
    var title = document.createElement("div")
    title.setAttribute("class","recipeTabTitle")
    var desc = document.createElement("p")
    var descText = document.createTextNode(recipe.recipeDesc)
    desc.appendChild(descText)
    title.appendChild(desc)
    var author = document.createElement("p")
    var authorText = document.createTextNode(chosenUser.firstName+" "+chosenUser.lastName)
    author.appendChild(authorText)
    title.appendChild(author)
    var recipeName = document.createElement("h2")
    var recipeNameText = document.createTextNode(recipe.recipeName)
    recipeName.appendChild(recipeNameText)
    title.appendChild(recipeName)
    div.appendChild(title)
    document.getElementById("recipeBox").appendChild(div)
}
/*Displays all the recipes in a list in the recipe box*/
async function showRecipeInList(chosenRecipes){
    if (chosenRecipes.length == 0){
        var noRecipe = document.createElement("h1")
        var noRecipeText = document.createTextNode("You have no recipes")
        noRecipe.appendChild(noRecipeText)
        noRecipe.setAttribute("id","noRecipe")
        document.getElementById("recipeBox").appendChild(noRecipe)
    } else{
        for (var i = 0;i<chosenRecipes.length;i++){
            var chosenUser = await getUserById(chosenRecipes[i].recipeAuthor)
            var div = document.createElement("div")
            div.setAttribute("class","recipeTab")
            var pic = document.createElement("img")
            pic.src = (chosenRecipes[i].recipePicture)
            div.appendChild(pic)
            var title = document.createElement("div")
            title.setAttribute("class","recipeTabTitle")
            var desc = document.createElement("p")
            var descText = document.createTextNode(chosenRecipes[i].recipeDesc)
            desc.appendChild(descText)
            title.appendChild(desc)
            var author = document.createElement("p")
            var authorText = document.createTextNode(chosenUser.firstName+" "+chosenUser.lastName)
            author.appendChild(authorText)
            title.appendChild(author)
            var recipeName = document.createElement("h2")
            var recipeNameText = document.createTextNode(chosenRecipes[i].recipeName)
            recipeName.appendChild(recipeNameText)
            title.appendChild(recipeName)
            div.appendChild(title)
            document.getElementById("recipeBox").appendChild(div)
        }
    }
}
/*Clears all the recipes in the content box*/
async function clearAllRecipes(){
    var noRecipe = document.getElementById("noRecipe")
    if(noRecipe!=null){
        noRecipe.remove()
    } else{
        const recipeTab = Array.from(document.getElementsByClassName('recipeTab'))
        recipeTab.forEach(recipeTab => {
            recipeTab.remove();
        });
    }
}
/*Gets all the saved recipe of a user*/
async function getSavedRecipes(recipeList,userId){
    var user = await getUserById(userId)
    var favoriteRecipes = user.favoriteRecipes
    var filteredList = []
    for (var i = 0;i<recipeList.length;i++){
        for (var p = 0;p<favoriteRecipes.length;p++){
            if(favoriteRecipes[p]==recipeList[i].recipeId){
                filteredList.push(recipeList[i])
                break
            }
        }
    }
    return filteredList
}
/*Gets all the recipes made by a user*/
async function getRecipeByUserId(recipeList,userId){
    let chosenRecipe = []
    for(let i = 0; i < recipeList.length; i++){
        if(recipeList[i].recipeAuthor==userId){
            chosenRecipe.push(recipeList[i])
        }
    }
    return chosenRecipe
}
/*Filters the recipe list based on the recipe type*/
async function getRecipeByType(recipeList,type){
    let chosenRecipe = []
    for(let i = 0; i < recipeList.length; i++){
        if(recipeList[i].recipeType==type){
            chosenRecipe.push(recipeList[i])
        }
    }
    return chosenRecipe 
}
/*Gets the recipe using its id*/
async function getRecipeById(id){
    let recipes = await fetch("Data/Recipes.json")
    let recipeList = await recipes.json()
    let chosenRecipe
    for(let i = 0; i < recipeList.length; i++){
        if(recipeList[i].recipeId==id){
            chosenRecipe = recipeList[i]
            break
        }
    }
    return chosenRecipe 
}
/*Gets all the recipes*/
async function getAllRecipes(){
    let recipes = await fetch("Data/Recipes.json")
    let recipeList = await recipes.json()
    return recipeList
}

async function getUserById(id){
    let users = await fetch("Data/Users.json")
    let userList = await users.json()
    let chosenUser
    for(let i = 0; i <userList.length; i++){
        if(userList[i].userid==id){
            chosenUser = userList[i]
            break
        }
    }
    return chosenUser
}

function initializePage(id){
    (async () => {
        var chosenUser = await getUserById(id)
        var recipesMade = await getRecipeByUserId(id)
        document.getElementById("fullName").innerHTML = chosenUser.firstName+" "+chosenUser.lastName
        document.getElementById("userName").innerHTML = "@"+chosenUser.userName
        document.getElementById("submitted").innerHTML = "Submitted Recipes: "+recipesMade.length
        document.getElementById("saved").innerHTML = "Saved recipes: "+chosenUser.favoriteRecipes.length
        var profilePictures = document.querySelectorAll("[id=profilePicture]")
        for (var i = 0;i<profilePictures.length;i++){
            profilePictures[i].src=chosenUser.profilePic
        }
        showOwnRecipes(id)
     })()
}

var userId = localStorage.getItem("User ID");
initializePage(userId)