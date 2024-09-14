const list = document.getElementById("list");
const createBtn = document.getElementById("create_btn");

let todos = loadFromLocalStorage() || [];

// 초기 렌더링
displayTodos();

// 새로운 todo 추가
createBtn.addEventListener("click", () => {
  const newItem = { id: Date.now(), text: "", complete: false };
  todos.unshift(newItem);
  renderTodoItem(newItem, true);
  saveToLocalStorage();
});

function renderTodoItem(item, focus = false) {
  const itemEl = document.createElement("div");
  itemEl.classList.add("item");
  if (item.complete) itemEl.classList.add("complete");

  const checkbox = createCheckbox(item);
  const inputEl = createTextInput(item, focus);
  const actionsEl = createActions(item, itemEl);

  itemEl.append(checkbox, inputEl, actionsEl);
  list.prepend(itemEl);
}

function createCheckbox(item) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = item.complete;
  checkbox.addEventListener("change", () => {
    item.complete = checkbox.checked;
    saveToLocalStorage();
  });
  return checkbox;
}

function createTextInput(item, focus) {
  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.value = item.text;
  inputEl.disabled = !focus;

  inputEl.addEventListener("input", () => {
    item.text = inputEl.value;
  });

  inputEl.addEventListener("blur", () => {
    inputEl.disabled = true;
    saveToLocalStorage();
  });

  if (focus) inputEl.focus();
  return inputEl;
}

function createActions(item, itemEl) {
  const actionsEl = document.createElement("div");
  actionsEl.classList.add("actions");

  const editBtn = document.createElement("button");
  editBtn.classList.add("material-icons");
  editBtn.innerText = "edit";
  editBtn.addEventListener("click", () => {
    const inputEl = itemEl.querySelector("input[type='text']");
    inputEl.disabled = false;
    inputEl.focus();
  });

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("material-icons", "remove-btn");
  removeBtn.innerText = "remove_circle";
  removeBtn.addEventListener("click", () => {
    todos = todos.filter((t) => t.id !== item.id);
    itemEl.remove();
    saveToLocalStorage();
  });

  actionsEl.append(editBtn, removeBtn);
  return actionsEl;
}

function displayTodos() {
  todos.forEach((item) => renderTodoItem(item));
}

function saveToLocalStorage() {
  localStorage.setItem("my_todos", JSON.stringify(todos));
}

function loadFromLocalStorage() {
  return JSON.parse(localStorage.getItem("my_todos"));
}
