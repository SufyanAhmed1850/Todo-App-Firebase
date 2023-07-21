import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAOICRpZWicoK_6BW1gl4MtAeNpLKdE_kE",
    authDomain: "todo-253a5.firebaseapp.com",
    projectId: "todo-253a5",
    storageBucket: "todo-253a5.appspot.com",
    messagingSenderId: "375693282485",
    appId: "1:375693282485:web:6e50779db0703ceb3842fc",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.editData = async function (documentId, newData) {
    try {
        const docRef = doc(db, "todos", documentId); // Replace "todos" with your collection name
        await updateDoc(docRef, newData);
        console.log("Document successfully updated!");
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};
window.deleteData = async function (documentId) {
    console.log(documentId);
    try {
        const docRef = doc(db, "todos", documentId); // Replace "todos" with your collection name
        await deleteDoc(docRef);
        console.log("Document successfully deleted!");
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
};
// -----------------------------------------------------------------------------Check If User Does Not Prefers dark Scheme---------------------------------------------------//
if (!window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.classList.toggle("lightTheme");
    themeIcon.src = "./images/icon-moon.svg";
    themeIcon.style.filter = "invert(80%)";
}
// -----------------------------------------------------------------------------Toggles Theme--------------------------------------------------------------------------------//
window.theme = function () {
    var element = document.body;
    var themeIcon = document.getElementById("themeIcon");
    element.classList.toggle("lightTheme");
    if (element.classList.contains("lightTheme")) {
        themeIcon.src = "./images/icon-moon.svg";
        themeIcon.style.filter = "invert(80%)";
    } else {
        themeIcon.src = "./images/icon-sun.svg";
        themeIcon.style.filter = "invert(0%)";
    }
};
// -----------------------------------------------------------------------------Get Todo Container
var todoContainer = document.getElementById("todoContainer");
// -----------------------------------------------------------------------------Get User Input
var userTodo = document.getElementById("userTodo");
// -----------------------------------------------------------------------------Get Submit Btn
var submit = document.getElementById("submit");
// -----------------------------------------------------------------------------Get left Count Element
var leftItems = document.getElementById("leftItems");
// -----------------------------------------------------------------------------Get All TodoItem
var allTodo = [];
// -----------------------------------------------------------------------------Get Active TodoItem
var activeTodo = [];
// -----------------------------------------------------------------------------Get Completed TodoItem
var completedTodo = [];
// -----------------------------------------------------------------------------Set Old Todo If Todo Is Null
var oldTodo = "";
window.getData = async function () {
    try {
        const storedData = await getDocs(collection(db, "todos"));
        storedData.forEach((doc) => {
            // if(doc.data() && doc.data() !== ""){
            setTodo(doc.id, doc.data());
            // }
            // console.log("Doc ID ==>", doc.id);
            // console.log("Doc ==>", doc.data());
        });
    } catch (error) {
        console.log(error.message);
    }
};
getData();

// -----------------------------------------------------------------------------Creates A TodoItem---------------------------------------------------------------------------//
window.setTodo = async function (inputId, inputData) {
    if (inputData || (!inputData && userTodo.value)) {
        var idOfInput;
        if (!inputId && !inputData) {
            try {
                const docRef = await addDoc(collection(db, "todos"), {
                    todoValue: userTodo.value,
                    isCompleted: false,
                });
                idOfInput = docRef.id;
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
        // -------------------------------------------------------------------------Create Parent Todo
        var todo = document.createElement("div");
        // -------------------------------------------------------------------------Create Parent Raido
        var radioP = document.createElement("div");
        // -------------------------------------------------------------------------Create Raido
        var radio = document.createElement("div");
        // -------------------------------------------------------------------------Create Input Field
        var input = document.createElement("input");
        // -------------------------------------------------------------------------Create Parent Img Btn
        var edits = document.createElement("div");
        // -------------------------------------------------------------------------Create Img Pencil
        var img1 = document.createElement("img");
        // -------------------------------------------------------------------------Create Img Cross
        var img2 = document.createElement("img");
        // -------------------------------------------------------------------------Create Sort Div
        var sort = document.createElement("div");
        // -------------------------------------------------------------------------Create Sort Img
        var sortImg = document.createElement("img");
        // -------------------------------------------------------------------------Set Parent Todo Attributes
        // todo.setAttribute("id", "todo");
        todo.className = "todo todoCtnr";
        todo.setAttribute("onmouseover", "changesBtn(this, 'over')");
        todo.setAttribute("onmouseout", "changesBtn(this, 'out')");
        // -------------------------------------------------------------------------Set Radio Attributes
        radioP.setAttribute("class", "radioParent");
        // -------------------------------------------------------------------------Set Radio Attributes
        if (inputData) {
            if (inputData.isCompleted) {
                radio.classList.add("checked");
            }
        }
        radio.classList.add("class", "radio");
        radio.setAttribute("onclick", "toggleRadio(this)");
        // -------------------------------------------------------------------------Set Input Field Attributes
        input.setAttribute("id", "todoItem");
        input.setAttribute("class", "todoItem");
        input.setAttribute("type", "text");
        input.setAttribute("disabled", "true");
        if (inputData) {
            input.setAttribute("value", inputData.todoValue);
            var val = "local";
        } else {
            input.setAttribute("value", userTodo.value);
            var val = "user";
        }
        input.setAttribute("onblur", "diableField(this)");
        input.setAttribute("autocomplete", "off");
        input.setAttribute("spellcheck", "false");
        input.setAttribute("disabled", "false");
        if (inputId) {
            input.setAttribute("id", inputId);
        } else {
            input.setAttribute("id", idOfInput);
        }
        // -------------------------------------------------------------------------Set Parent Img Attributes
        edits.setAttribute("id", "edits");
        edits.setAttribute("class", "edits");
        // -------------------------------------------------------------------------Set Pencil Attributes
        img1.setAttribute("id", "editBtn");
        img1.setAttribute("src", "./images/icon-pencil.svg");
        img1.setAttribute("width", "20px");
        img1.setAttribute("onclick", "runEdit(this)");
        // -------------------------------------------------------------------------Set Cross Attributes
        img2.setAttribute("id", "delBtn");
        img2.setAttribute("src", "./images/icon-cross.svg");
        img2.setAttribute("width", "26px");
        img2.setAttribute("onclick", "del(this)");
        // -------------------------------------------------------------------------Set Sort Attribute
        sort.setAttribute("class", "sort");
        // -------------------------------------------------------------------------Set SortImg Src
        sortImg.setAttribute("src", "./images/sort.svg");
        // -------------------------------------------------------------------------Append SortImg To Sort
        sort.appendChild(sortImg);
        // -------------------------------------------------------------------------Append Sort To Parent (Todo)
        radioP.appendChild(sort);
        // -------------------------------------------------------------------------Append Radio To RadioP
        radioP.appendChild(radio);
        // -------------------------------------------------------------------------Append Img1 To edits
        edits.appendChild(img1);
        // -------------------------------------------------------------------------Append Img2 To edits
        edits.appendChild(img2);
        // -------------------------------------------------------------------------Append radioP To Parent (Todo)
        todo.appendChild(radioP);
        // -------------------------------------------------------------------------Append Input To Parent (Todo)
        todo.appendChild(input);
        // -------------------------------------------------------------------------Append Edits To Parent (Todo)
        todo.appendChild(edits);
        // -------------------------------------------------------------------------Reset Value Of UserInput
        userTodo.value = "";
        // -------------------------------------------------------------------------Append Parent (Todo) To TodoContainer
        todoContainer.insertBefore(todo, todoContainer.firstChild);
        // -------------------------------------------------------------------------Set Length Of TodoList
        leftItems.innerHTML = activeTodo.length + " items left";
        // -------------------------------------------------------------------------Calls Function That Sets todoItem To Local
        switch (val) {
            case "user":
                // to();
                break;
            default:
                completedStyles();
                break;
        }
    } else if (!userTodo.value) {
        return;
    }
};
// -----------------------------------------------------------------------------Calls setTodo Function On Click
submit.addEventListener("click", function () {
    setTodo();
});
// -----------------------------------------------------------------------------Calls setTodo Function On Pressing Enter
userTodo.addEventListener("keydown", function (event) {
    if (event.key == "Enter") {
        setTodo();
    }
});
// -----------------------------------------------------------------------------Handles Img On Hover (Pencil <---> Check)----------------------------------------------------//
window.changesBtn = function (element, mouse) {
    // -------------------------------------------------------------------------Targets Parent Of Edits Div Of Hovered Todo Item
    var edits = element.querySelector(".edits");
    // -------------------------------------------------------------------------Targets Edit Btn Of Hovered Todo Item
    var editBtn = element.querySelector("#editBtn");
    // -------------------------------------------------------------------------If Todo Input Is Disabled
    if (element.querySelector(".todoItem").hasAttribute("disabled")) {
        if (mouse === "over") {
            edits.style.display = "flex";
        } else {
            edits.style.display = "none";
        }
        // ---------------------------------------------------------------------If Todo Input Is Enabled
    } else {
        if (mouse === "over") {
            edits.style.display = "flex";
            editBtn.setAttribute("src", "./images/icon-check.svg");
        } else {
            edits.style.display = "none";
        }
    }
};
// -----------------------------------------------------------------------------Enables/Disables Editing On Todo Item--------------------------------------------------------//
window.runEdit = function (editBtn) {
    // -------------------------------------------------------------------------Targets Todo Item Input
    var todoItem =
        editBtn.parentElement.parentElement.querySelector(".todoItem");
    // -------------------------------------------------------------------------If Todo Input Is Disabled
    if (editBtn.src.includes("/images/icon-pencil.svg")) {
        oldTodo = todoItem.value;
        todoItem.removeAttribute("disabled");
        todoItem.focus();
        todoItem.setSelectionRange(
            todoItem.value.length,
            todoItem.value.length
        );
        editBtn.setAttribute("src", "./images/icon-check.svg");
        // ---------------------------------------------------------------------If Todo Input Is Enabled
    } else {
        if (!todoItem.value) {
            todoItem.value = oldTodo;
            todoItem.setAttribute("disabled", "true");
        } else {
            todoItem.setAttribute("disabled", "true");
        }
        editBtn.setAttribute("src", "./images/icon-pencil.svg");
        editData(todoItem.id, {
            todoValue: todoItem.value,
            isCompleted: false,
        });
    }
};
// -----------------------------------------------------------------------------On Blur Enables/Disables Editing On Todo Item------------------------------------------------//
window.diableField = function (element) {
    var todoItem = element;
    var Todo = element.parentNode;
    var editBtn = Todo.querySelector("#editBtn");
    if (!todoItem.value) {
        todoItem.value = oldTodo;
    }
    // -------------------------------------------------------------------------Delay Added To Prevent Calling Both runEdit & diableField Run At The Same Time
    setTimeout(function disableAndSrc() {
        todoItem.setAttribute("disabled", "true");
        editBtn.src = "./images/icon-pencil.svg";
    }, 100);
};
// -----------------------------------------------------------------------------Deletes A Todo Item & Updates Length Of Todo Items-------------------------------------------//
window.del = function (element) {
    // -------------------------------------------------------------------------Deletes A Todo Item
    var todo = element.parentElement.parentElement;
    let idPara = todo.querySelector(".todoItem").id;
    todo.remove();
    deleteData(idPara);
};
// -----------------------------------------------------------------------------Adds Checked Class On Radio------------------------------------------------------------------//
window.toggleRadio = function (element) {
    // -------------------------------------------------------------------------Targetting Radio Btn
    var radio = element;
    var todo = radio.parentNode.parentNode;
    var input = todo.querySelector(".todoItem");
    console.log();
    // -------------------------------------------------------------------------Removes/Add Checked Class To Radio Btn
    if (radio.classList.contains("checked")) {
        radio.classList.remove("checked");
        input.style.textDecoration = "none";
        input.style.color = "var(--clr-txt)";
        editData(input.id, {
            todoValue: input.value,
            isCompleted: false,
        });
    } else {
        radio.classList.add("checked");
        input.style.textDecoration = "line-through";
        input.style.color = "var(--clr-disabled-input)";
        editData(input.id, {
            todoValue: input.value,
            isCompleted: true,
        });
    }
    // -------------------------------------------------------------------------Updates Length Of TodoList
    leftItems.innerHTML = activeTodo.length + " items left";
    // -------------------------------------------------------------------------Calls Function That Sets todoItem To Local
    // toLocal();
};
// -----------------------------------------------------------------------------Sets Style on todoItems if Radio Is Checked--------------------------------------------------//
window.completedStyles = function () {
    var todoItems = todoContainer.children;
    var todoItemsArr = [...todoItems];
    for (var i = 0; i < todoItemsArr.length; i++) {
        var checkedRadio = todoItemsArr[i].querySelector(".radio");
        if (checkedRadio.className.includes("checked")) {
            var parentOfChecked = checkedRadio.parentNode.parentNode;
            var inputToStyle = parentOfChecked.querySelector(".todoItem");
            inputToStyle.style.textDecoration = "line-through";
            inputToStyle.style.color = "var(--clr-disabled-input)";
        } else {
            continue;
        }
    }
};
// -----------------------------------------------------------------------------Deletes Completed Todo Items-----------------------------------------------------------------//
window.delCompleted = function () {
    for (i = 0; i < completedTodo.length; i++) {
        completedTodo[i].parentNode.remove();
    }
    // -------------------------------------------------------------------------Updates Length Of TodoList
    leftItems.innerHTML = activeTodo.length + " items left";
    // -------------------------------------------------------------------------Calls Function That Sets todoItem To Local
    // toLocal();
};
// -----------------------------------------------------------------------------Shows Only Completed TodoItems---------------------------------------------------------------//
// window.showCompleted = function () {
//     var all = document.getElementById("all");
//     var active = document.getElementById("active");
//     var completed = document.getElementById("completed");
//     all.classList.remove("focus");
//     active.classList.remove("focus");
//     completed.classList.add("focus");
//     todoContainer.innerHTML = "";
//     for (var i = 0; i < completedTodo.length; i++) {
//         var completedTodoParent = completedTodo[i].parentNode;
//         todoContainer.appendChild(completedTodoParent);
//     }
//     // -------------------------------------------------------------------------Updates Length Of TodoList
//     leftItems.innerHTML = activeTodo.length + " items left";
// };
// // -----------------------------------------------------------------------------Shows Only Active TodoItems------------------------------------------------------------------//
// window.showActive = function () {
//     var all = document.getElementById("all");
//     var active = document.getElementById("active");
//     var completed = document.getElementById("completed");
//     all.classList.remove("focus");
//     active.classList.add("focus");
//     completed.classList.remove("focus");
//     todoContainer.innerHTML = "";
//     for (var i = 0; i < activeTodo.length; i++) {
//         var activeTodoParent = activeTodo[i].parentNode;
//         todoContainer.appendChild(activeTodoParent);
//     }
//     // -------------------------------------------------------------------------Updates Length Of TodoList
//     leftItems.innerHTML = activeTodo.length + " items left";
// };
// // -----------------------------------------------------------------------------Shows All TodoItems--------------------------------------------------------------------------//
// window.showAll = function () {
//     var all = document.getElementById("all");
//     var active = document.getElementById("active");
//     var completed = document.getElementById("completed");
//     all.classList.add("focus");
//     active.classList.remove("focus");
//     completed.classList.remove("focus");
//     todoContainer.innerHTML = "";
//     for (var i = 0; i < allTodo.length; i++) {
//         var allTodoParent = allTodo[i].parentNode;
//         todoContainer.appendChild(allTodoParent);
//     }
//     // -------------------------------------------------------------------------Updates Length Of TodoList
//     leftItems.innerHTML = activeTodo.length + " items left";
// };
// -----------------------------------------------------------------------------Allows User To Sort todoItems-------------------------------------------------------------------//
new Sortable(todoContainer, {
    animation: 150,
    handle: ".sort",
    onEnd: function () {
        // toLocal();
    },
});
