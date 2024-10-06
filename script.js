const list = document.getElementById("list");
const createBtn = document.getElementById("create_btn");

let todos = [];

createBtn.addEventListener("click", createNewTodo);

function createNewTodo() {
  const item = {
    id: new Date().getTime(),
    text: "",
    complete: false,
  };

  todos.unshift(item);
  const { itemEl, inputEl } = createTodoElement(item);
  list.prepend(itemEl);
  inputEl.removeAttribute("disabled");
  inputEl.focus();
  saveToLocalStorage();
}

function createTodoElement(item) {
  const itemEl = document.createElement("div");
  itemEl.classList.add("item");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = item.complete;

  if (item.complete) {
    itemEl.classList.add("complete");
  }

  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.value = item.text;
  inputEl.setAttribute("disabled", "");

  const actionsEl = document.createElement("div");
  actionsEl.classList.add("actions");

  const editBtnEl = document.createElement("button");
  editBtnEl.classList.add("material-icons");
  editBtnEl.innerText = "edit";

  const removeBtnEl = document.createElement("button");
  removeBtnEl.classList.add("material-icons", "remove-btn");
  removeBtnEl.innerText = "remove_circle";

  actionsEl.append(editBtnEl);
  actionsEl.append(removeBtnEl);

  itemEl.append(checkbox);
  itemEl.append(inputEl);
  itemEl.append(actionsEl);

  // 완료 상태 변경
  checkbox.addEventListener("change", () => {
    item.complete = checkbox.checked;

    if (item.complete) {
      itemEl.classList.add("complete");
    } else {
      itemEl.classList.remove("complete");
    }

    saveToLocalStorage();
  });

  // 입력된 값 변경
  inputEl.addEventListener("input", () => {
    item.text = inputEl.value;
  });

  // 수정 모드 해제 시
  inputEl.addEventListener("blur", () => {
    inputEl.setAttribute("disabled", "");

    saveToLocalStorage();
  });

  // 수정 버튼 클릭 시
  editBtnEl.addEventListener("click", () => {
    inputEl.removeAttribute("disabled");
    inputEl.focus();
  });

  // 삭제 버튼 클릭 시
  removeBtnEl.addEventListener("click", () => {
    todos = todos.filter((t) => t.id != item.id);
    itemEl.remove();

    saveToLocalStorage();
  });

  return { itemEl, inputEl, editBtnEl, removeBtnEl };
}

function displayTodos() {
  loadFromLocalStorage();

  // 로컬 스토리지에서 가져온 데이터가 없을 경우 기본 아이템 추가
  if (todos.length === 0) {
    const defaultItem = {
      id: new Date().getTime(),
      text: "밥먹기",
      complete: false,
    };
    todos.push(defaultItem);
  }

  // 저장된 모든 todo 항목 생성
  todos.forEach((item) => {
    const { itemEl } = createTodoElement(item);
    list.append(itemEl);
  });
}

displayTodos();

function saveToLocalStorage() {
  const data = JSON.stringify(todos);
  localStorage.setItem("my_todos", data);
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("my_todos");

  if (data) {
    todos = JSON.parse(data);
  }
}
