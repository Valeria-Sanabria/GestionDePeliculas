const API_URL = 'https://fake-api-vq1l.onrender.com/posts';


document.addEventListener('DOMContentLoaded', () => {
    const movieForm = document.getElementById('movie-form');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const imageUrlInput = document.getElementById('image-url');
    const postsContainer = document.getElementById('posts-container');
    const postIdInput = document.getElementById('post-id');
    const submitBtn = document.getElementById('submit-btn');
    
    // Cargar las películas al cargar la página
    getPosts();

    // Crear o actualizar película
    movieForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = titleInput.value;
        const description = descriptionInput.value;
        const imageUrl = imageUrlInput.value;
        const postId = postIdInput.value;

        if (postId) {
            updatePost(postId, title, description, imageUrl);
        } else {
            createPost(title, description, imageUrl);
        }
    });

    // Leer las películas (GET)
    function getPosts() {
        fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            }
        })
        .then(response => response.json())
        .then(posts => {
            postsContainer.innerHTML = '';  // Limpia el contenedor antes de cargar las nuevas películas
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <img src="${post.image}" alt="${post.title}">
                    <h3>${post.title}</h3>
                    <p>${post.description}</p>
                    <div>
                        <button onclick="editPost('${post.id}', '${post.title}', '${post.description}', '${post.image}')">Editar</button>
                        <button onclick="deletePost('${post.id}')">Eliminar</button>
                    </div>
                `;
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error al obtener posts:', error));
    }

    // Crear una película (POST)
    function createPost(title, description, imageUrl) {
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify({ title, description, image: imageUrl })
        })
        .then(response => response.json())
        .then(post => {
            // Al agregar la nueva película, recargar la lista
            getPosts();
            // Resetear el formulario después de agregar la película
            movieForm.reset();
        })
        .catch(error => console.error('Error al crear post:', error));
    }

    // Actualizar una película (PUT)
    function updatePost(id, title, description, imageUrl) {
        fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify({ title, description, image: imageUrl })
        })
        .then(response => response.json())
        .then(post => {
            getPosts();
            movieForm.reset();
            postIdInput.value = '';
            submitBtn.textContent = 'Agregar Película';
        })
        .catch(error => console.error('Error al actualizar post:', error));
    }

    // Eliminar una película (DELETE)
    window.deletePost = function(id) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            }
        })
        .then(() => {
            getPosts();
        })
        .catch(error => console.error('Error al eliminar post:', error));
    };

    // Editar un post (cargar los datos en el formulario)
    window.editPost = function(id, title, description, image) {
        titleInput.value = title;
        descriptionInput.value = description;
        imageUrlInput.value = image;
        postIdInput.value = id;
        submitBtn.textContent = 'Actualizar Película';
    };
});
