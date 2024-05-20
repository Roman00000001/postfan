const postForm = document.getElementById('post-form');
const postText = document.getElementById('post-text');
const postImage = document.getElementById('post-image');
const postsList = document.getElementById('posts-list');
const addPostButton = document.getElementById('add-post-button');

let posts = []; // Array to store posts

function displayPosts() {
  postsList.innerHTML = ''; // Clear post list

  // Calculate the number of columns based on available width
  const numColumns = calculateColumns();

  let columnElements = []; // Array to store column elements
  for (let i = 0; i < numColumns; i++) {
    const columnElement = document.createElement('div');
    columnElement.classList.add('post-column');
    columnElements.push(columnElement);
    postsList.appendChild(columnElement);
  }

  posts.forEach(post => {
    const postElement = document.createElement('li');
    postElement.classList.add('post');

    if (post.imageUrl) {
      const imageElement = document.createElement('img');
      imageElement.classList.add('post-image');
      imageElement.src = post.imageUrl;
      postElement.appendChild(imageElement);
    }

    const contentElement = document.createElement('div');
    contentElement.classList.add('post-content');
    contentElement.textContent = post.text;

    const dateElement = document.createElement('div');
    dateElement.classList.add('post-date');
    dateElement.textContent = new Date(post.timestamp).toLocaleDateString();

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Удалить';

    deleteButton.addEventListener('click', () => {
      const index = posts.indexOf(post);
      if (index !== -1) {
        posts.splice(index, 1);
        displayPosts();
        localStorage.setItem('sitePosts', JSON.stringify(posts)); // Update localStorage after deletion
      }
    });

    postElement.appendChild(contentElement);
    postElement.appendChild(dateElement);
    postElement.appendChild(deleteButton);

    // Add post to the least filled column
    let minFilledColumnIndex = 0;
    for (let i = 1; i < numColumns; i++) {
      if (columnElements[i].children.length < columnElements[minFilledColumnIndex].children.length) {
        minFilledColumnIndex = i;
      }
    }
    columnElements[minFilledColumnIndex].appendChild(postElement);
  });
}

function calculateColumns() {
  const numColumns = Math.floor(postsList.offsetWidth / 250); // Assuming max image width is 250px
  return Math.max(1, numColumns); // Ensure at least one column
}

// Load posts from local storage on page load
const storedPosts = localStorage.getItem('sitePosts');
if (storedPosts) {
  posts = JSON.parse(storedPosts);
}
displayPosts();

addPostButton.addEventListener('click', () => {
  const text = postText.value.trim();
  const image = postImage.files[0]; // Get selected image file

  if (text) {
    const newPost = {
      text: text,
      timestamp: Date.now()
    };

    if (image) {
      const reader = new FileReader();
      reader.onload = (event) => {
        newPost.imageUrl = event.target.result; // URL of the image after reading
        posts.push(newPost);
        displayPosts();
        postText.value = ''; // Clear text input
        postImage.value = ''; // Clear image input

        // Save posts to local storage
        localStorage.setItem('sitePosts', JSON.stringify(posts));
      };
      reader.readAsDataURL(image); // Read image file
    } else {
      posts.push(newPost);
      displayPosts();

      // Save posts to local storage
      localStorage.setItem('sitePosts', JSON.stringify(posts));
    }
  }
});