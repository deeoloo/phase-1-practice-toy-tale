let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form")
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  const toyCollection = document.getElementById("toy-collection")


  fetch ("http://localhost:3000/toys",{
    method: 'GET',
    headers: {
    'Content-type': 'application/json'
    }
  })
  .then(response=>response.json())
  .then((toys)=>{
    toys.forEach((toy=> {
      const card = createToyCard(toy)
      toyCollection.appendChild(card)
      
    }));
  })

  toyForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    const name = e.target.name.value;
    const image = e.target.image.value;
   

    const newToy = {
        name: name,
        image: image,
        likes: 0
    }

    fetch ("http://localhost:3000/toys",{
      method: 'POST',
      headers: {
          'Content-Type':'application/json',
          Accept : "application/json"
      },
      body: JSON.stringify(newToy)
    })
    .then (response=>response.json())
    .then ((toy)=>{
      const card = createToyCard(toy)
      toyCollection.appendChild(card)

      toyForm.reset()
    })

    .catch((error) => {
      console.error("Error adding new toy:", error);
    });

  })


  function createToyCard(toy){
    const card = document.createElement('div')
    card.className = 'card'

    const name = document.createElement('h2')
    name.textContent = toy.name
    card.appendChild(name)

    const img = document.createElement('img')
    img.src = toy.image
    img.className = 'toy-avatar'
    card.appendChild(img)

    const likes = document.createElement('p')
    likes.textContent = `${toy.likes} Likes`
    card.appendChild(likes)

    const likesButton = document.createElement('button')
    likesButton.className = 'like-btn'
    likesButton.textContent = 'Like ❤️';
    likesButton.id= toy.id;

    likesButton.addEventListener("click", () => {
      updateLikes(toy, likes);
    })
    
    card.appendChild(likesButton)

    return card;

  }
  
   function updateLikes(toy, likesElement) {
    const newLikes = toy.likes + 1; 

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        likes: newLikes,
      }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
       
        likesElement.textContent = `${updatedToy.likes} Likes`;
      })
      .catch((error) => {
        console.error("Error updating likes:", error);
      });
  }
});

