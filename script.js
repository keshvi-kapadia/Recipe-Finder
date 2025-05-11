    // https://api.spoonacular.com/recipes/716300/information?apiKey=c8b68c986a374d3682488cd4cca7873c
    // let API_KEY="64b52d63e80c47cd802f6dca60c18028"
    let API_KEY="c8b68c986a374d3682488cd4cca7873c"
    let url=""

    function checkEnter(event)
    {
        if(event.key=="Enter")
            getRecipe();
    }

    async function generateRandomDishes() {
        let URL=`https://api.spoonacular.com/recipes/random?number=5&apiKey=${API_KEY}`

        let response=await fetch(URL);
        let data=await response.json();
        let dishes=data.recipes;
        console.log(dishes)
        generateDishes(dishes)
    }

    async function getRecipe()
    {
        event.preventDefault();
        document.getElementById("modal").classList.add("hidden");
        document.getElementById("recipe-container").classList.remove("hidden");
        let dish=document.getElementById("search");
        let dish_val=dish.value;
        let container=document.getElementById("recipe-container");

        if(!dish_val)
        {
            dish.focus();
            return;
        }

        container.innerHTML="<h5 style='text-align:center;'>Searching for Recipes...</h5>"
        
        url="https://api.spoonacular.com/recipes/complexSearch?query="+dish_val+"&apiKey="+API_KEY
        applyFilter()
        hideFilter()
        let response=await fetch(url);
        let data=await response.json();
        let dishes=data.results;
        console.log(dishes);
    
        dish.value="";
        if(dishes.length==0)
        {
            container.innerHTML="<h3 style='text-align:center;'> No Recipes Found!!</h3>";
            
            return;
        }

        generateDishes(dishes)
    }

    async function generateDishes(dishes)
    {
        let container=document.getElementById("recipe-container");
        container.innerHTML="";
        for(let i=0;i<dishes.length;i++)  //dishes.length
        {
            let main_div=document.createElement("div");
            main_div.setAttribute("class","m-2 bg-white text-teal-800 border border-black text-sm flex-col w-60 text-center")
            let dish_name=document.createElement("div");
            dish_name.innerText=dishes[i].title;
            let img_desc_div=document.createElement("div");
            img_desc_div.setAttribute("class","flex m-2")
            let img=document.createElement("img");
            img.setAttribute("src",dishes[i].image);
            img.setAttribute("class","h-30 w-20 rounded ml-2 mr-2")
            let desc=document.createElement("div");
            let desc_API="https://api.spoonacular.com/recipes/"+dishes[i].id+"/information?apiKey="+API_KEY;
            let response=await fetch(desc_API);
            let data=await response.json();
            desc.innerHTML = `${data.summary.slice(0, 250)} <a style="color:blue; cursor:pointer; font-weight:normal" onclick="openModal(${dishes[i].id});"> ..Read More</a>`;


            console.log(data.summary)

            img_desc_div.appendChild(img);
            img_desc_div.appendChild(desc);

            main_div.appendChild(dish_name);
            main_div.appendChild(img_desc_div);
            container.appendChild(main_div);
        }
    }

    function closeModal()
    {
        document.getElementById("modal").classList.add("hidden");
        document.getElementById("recipe-container").classList.remove("hidden");
    }

    async function openModal(id)
    {
        let desc_API="https://api.spoonacular.com/recipes/"+id+"/information?apiKey="+API_KEY;
        let response=await fetch(desc_API);
        let data=await response.json();

        document.getElementById("modal").classList.remove("hidden");
        document.getElementById("recipe-container").classList.add("hidden");
        let title=document.getElementById("modal-title");
        title.innerText=data.title;
        document.getElementById("img-dish").setAttribute("src",data.image);
        let prep_div=document.getElementById("preparation");

        prep_div.innerText="Ready in : "+data.readyInMinutes+" minutes\n"+
                        "Servings : "+data.servings+"\n"+
                        "Health Score : "+data.healthScore+"/100\n"+
                        "Weight Watcher Points : "+data.weightWatcherSmartPoints;

        let ingredients=data.extendedIngredients;
        console.log(ingredients)           
        
        let ing_div=document.getElementById("ingredients");
        ing_div.innerText="";
        
        for(let i=0;i<ingredients.length;i++)
        {
            ing_div.innerText+="\n"+ingredients[i].original;
            // console.log(ingredients[i].original);
        }

        let ins_div=document.getElementById("instruction");
        ins_div.innerText="";
        let instructions=data.analyzedInstructions[0].steps;
        console.log(instructions)
        
        for(let i=0;i<instructions.length;i++)
        {
            let num_div = document.createElement("div");
            num_div.innerText = i+1;
            num_div.setAttribute("class", "m-4 w-10 h-10 bg-teal-400 rounded-xl text-white font-semibold p-4 shadow-lg flex items-center justify-center");


            let step_div = document.createElement("div");
            step_div.innerText = instructions[i].step;
            step_div.setAttribute("class","m-4")

            let num_step_div=document.createElement("div");

            num_step_div.appendChild(num_div);
            num_step_div.appendChild(step_div);

            num_step_div.setAttribute("class","flex bg-white m-2 rounded")

            ins_div.appendChild(num_step_div);
        }
        console.log(data.analyzedInstructions[0].steps[0].step)
    }

function hideFilter()
{
    let filter=document.getElementById("filter-container")
    
    filter.classList.add("hidden")
}

function showFilter()
{
    let filter=document.getElementById("filter-container")

    if(filter.classList.contains("hidden"))
        filter.classList.remove("hidden")
    else filter.classList.add("hidden")
}

function applyFilter()
{
    hideFilter()
    let diet_box=document.getElementsByName("diet")
    let diet=new Array()
    for(let i=0;i<diet_box.length;i++)
    {
        if(diet_box[i].checked)
        {
            diet.push(diet_box[i].value)
        }
    }
    
    let diet_val=diet.join(",")
    if(diet_val)
        url+="&diet="+diet_val

    let cuisine_box=document.getElementsByName("cuisine")
    let cuisine=new Array()
    for(let i=0;i<cuisine_box.length;i++)
    {
        if(cuisine_box[i].checked)
        {
            cuisine.push(cuisine_box[i].value)
        }
    }
    
    let cuisine_val=cuisine.join(",")
    // console.log(cuisine_val)

    if(cuisine_val)
        url+="&cuisine="+cuisine_val

    let int_box=document.getElementsByName("intolerances")
    let int=new Array()
    for(let i=0;i<int_box.length;i++)
    {
        if(int_box[i].checked)
        {
            int.push(int_box[i].value)
        }
    }
    
    let int_val=int.join(",")
    // console.log(int_val)
    if(int_val)
        url+="&intolerances="+int_val

    let meal_box=document.getElementsByName("type")
    let meal=new Array()
    for(let i=0;i<meal_box.length;i++)
    {
        if(meal_box[i].checked)
        {
            meal.push(meal_box[i].value)
        }
    }
    
    let meal_val=meal.join(",")
    //  console.log(meal_val)
    if(meal_val)
        url+="&type="+meal_val

    console.log(url)
}