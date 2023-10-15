async function getAllRecipes(){
    let recipes = await fetch("data/Recipes.json")
    let recipeList = await recipes.json()
    return recipeList
}

async function getUserById(id){
    let users = await fetch("data/Users.json")
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

async function getRecipeById(id){
    let recipes = await fetch("data/Recipes.json")
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