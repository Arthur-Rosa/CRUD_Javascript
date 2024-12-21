// URL da API fake do json-server
const apiUrl = "http://localhost:3000/foods";

// Seleciona elementos do DOM
const foodForm = document.getElementById("foodForm");
const foodNameInput = document.getElementById("foodName");
const foodDescInput = document.getElementById("foodDescription");
const foodImageInput = document.getElementById("foodImageURL");
const foodList = document.getElementById("foodList");
const submitBtn = document.getElementById("submitBtn");

// Variável para controlar o modo edição
let editMode = false;
let editId = null;

/**
 * Função para carregar todas as comidas da API
 */
async function loadFoods() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayFoods(data);
  } catch (error) {
    console.error("Erro ao carregar comidas:", error);
  }
}

/**
 * Função para exibir as comidas na tela
 * @param {Array} foods
 */
function displayFoods(foods) {
  foodList.innerHTML = ""; // Limpa a lista antes de renderizar

  foods.forEach((food) => {
    const foodItem = document.createElement("div");
    foodItem.classList.add("food-item");

    foodItem.innerHTML = `
      <img src="${food.imageURL}" alt="${food.name}" />
      <div class="food-details">
        <h2>${food.name}</h2>
        <p>${food.description}</p>
        <div class="actions">
          <button class="edit-btn" data-id="${food.id}">Editar</button>
          <button class="delete-btn" data-id="${food.id}">Deletar</button>
        </div>
      </div>
    `;

    foodList.appendChild(foodItem);
  });

  // Adiciona eventos de clique nos botões Editar e Deletar
  const editButtons = document.querySelectorAll(".edit-btn");
  const deleteButtons = document.querySelectorAll(".delete-btn");

  editButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      editFood(id);
    });
  });

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteFood(id);
    });
  });
}

/**
 * Função para adicionar nova comida (POST) ou atualizar comida existente (PUT)
 */
foodForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Obtém valores dos inputs
  const name = foodNameInput.value.trim();
  const description = foodDescInput.value.trim();
  const imageURL = foodImageInput.value.trim();

  if (!name || !description || !imageURL) {
    alert("Preencha todos os campos!");
    return;
  }

  // Se estiver em modo de edição, atualiza o item
  if (editMode) {
    try {
      await fetch(`${apiUrl}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, imageURL }),
      });
      alert("Comida atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar comida:", error);
    }

    // Reseta o modo de edição
    editMode = false;
    editId = null;
    submitBtn.textContent = "Adicionar";
  } else {
    // Caso contrário, adiciona um novo item
    try {
      await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, imageURL }),
      });
      alert("Comida adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar comida:", error);
    }
  }

  // Limpa o formulário e recarrega a lista
  foodForm.reset();
  loadFoods();
});

/**
 * Função para preparar a edição de uma comida
 * @param {number} id
 */
function editFood(id) {
    // Faz um GET na API para pegar os dados
    fetch(`${apiUrl}/${id}`)
      .then((response) => response.json())
      .then((food) => {
        // Preenche o formulário
        foodNameInput.value = food.name;
        foodDescInput.value = food.description;
        foodImageInput.value = food.imageURL;
  
        // Ativa o modo de edição
        editMode = true;
        editId = id;
        submitBtn.textContent = "Atualizar";
      })
      .catch((error) => console.error("Erro ao buscar comida:", error));
  }
/**
 * Função para deletar uma comida
 * @param {number} id
 */
async function deleteFood(id) {
  const confirma = confirm("Tem certeza que deseja deletar esta comida?");
  if (!confirma) return;

  try {
    await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    });
    alert("Comida deletada com sucesso!");
    loadFoods();
  } catch (error) {
    console.error("Erro ao deletar comida:", error);
  }
}

// Ao carregar a página, busca os dados da API
document.addEventListener("DOMContentLoaded", loadFoods);
