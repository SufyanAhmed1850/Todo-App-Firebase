import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
    getFirestore,
    doc,
    addDoc,
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    onSnapshot,
    orderBy,
    query,
    where,
    Timestamp,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

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

gsap.to("#loader > *", {
    y: 0,
    opacity: 1,
    ease: "power4.out",
    stagger: 0.1,
    duration: 1,
});

const disableLoader = () => {
    gsap.to("#loader > *", {
        y: -50,
        opacity: 0,
        ease: "power4.in",
        stagger: 0.1,
        duration: 1,
        onComplete: () => {
            document.getElementById("loader").style.display = "none";
            document.querySelector(".grand-container").style.display = "flex";
        },
    });
};

// -----------------------------------------------------------------------------Theme Switcher--------------------------------------------------------------------------------//
const switchTheme = (colorScheme) => {
    var themeIcon = document.getElementById("themeIcon");
    var element = document.body;
    if (colorScheme === "light") {
        element.classList.add("lightTheme");
        themeIcon.src = "./images/icon-moon.svg";
        themeIcon.style.filter = "invert(80%)";
    } else if (colorScheme === "dark") {
        element.classList.remove("lightTheme");
        themeIcon.src = "./images/icon-sun.svg";
        themeIcon.style.filter = "invert(0%)";
    }
};
// -----------------------------------------------------------------------------Check If User Does Not Prefers dark Scheme---------------------------------------------------//
const localTheme = JSON.parse(localStorage.getItem("theme"));
if (localTheme === "light") {
    switchTheme("light");
} else if (JSON.parse(localStorage.getItem("theme")) === "dark") {
    switchTheme("dark");
} else if (!localTheme) {
    if (!window.matchMedia("(prefers-color-scheme: dark)").matches) {
        switchTheme("light");
    }
}
// -----------------------------------------------------------------------------Calls Theme Switcher--------------------------------------------------------------------------------//
window.theme = function () {
    var element = document.body;
    element.classList.toggle("lightTheme");
    if (element.classList.contains("lightTheme")) {
        localStorage.setItem("theme", JSON.stringify("light"));
        switchTheme("light");
    } else {
        localStorage.setItem("theme", JSON.stringify("dark"));
        switchTheme("dark");
    }
};

const editData = async (documentId, newData) => {
    try {
        const docRef = doc(db, "todos", documentId);
        await updateDoc(docRef, newData);
        console.log("Document successfully updated!");
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};

const deleteData = async (id) => {
    console.log(id);
    try {
        await deleteDoc(doc(db, "todos", id));
        console.log("Document successfully deleted!");
    } catch (error) {
        console.error("Error deleting document: ", error);
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
// -----------------------------------------------------------------------------Set Old Todo If Todo Is Null
var oldTodo = "";
const getData = async () => {
    try {
        const dbTodos = query(
            collection(db, "todos"),
            orderBy("timestamp", "asc")
        );
        const querySnapshot = await getDocs(dbTodos);
        todoContainer.innerHTML = "";
        querySnapshot.docs.forEach((doc, index) => {
            console.log(querySnapshot.size, index);
            setTodo(doc.id, doc.data());
        });
        disableLoader();
    } catch (error) {
        console.log(error);
    }
};
getData();
const activeCount = async () => {
    try {
        // -------------------------------------------------------------------------Updates Length Of TodoList
        const dbTodos = query(
            collection(db, "todos"),
            where("isCompleted", "==", false)
        );
        const querySnapshot = await getDocs(dbTodos);
        console.log(querySnapshot.size);
        leftItems.innerHTML = querySnapshot.size + " items left";
    } catch (error) {
        console.error(error);
    }
};
activeCount();
// -----------------------------------------------------------------------------Creates A TodoItem---------------------------------------------------------------------------//
const setTodo = async (inputId, inputData) => {
    if (inputData || (!inputData && userTodo.value)) {
        var idOfInput;
        let todoValue = userTodo.value;
        userTodo.value = "";
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
        todo.setAttribute("id", "todo");
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
        // input.setAttribute("id", "todoItem");
        input.setAttribute("class", "todoItem");
        input.setAttribute("type", "text");
        input.setAttribute("disabled", "true");
        if (inputData) {
            input.setAttribute("value", inputData.todoValue);
            var val = "local";
        } else {
            input.setAttribute("value", todoValue);
            var val = "user";
        }
        input.setAttribute("onblur", "diableField(this)");
        input.setAttribute("autocomplete", "off");
        input.setAttribute("spellcheck", "false");
        input.setAttribute("disabled", "false");
        if (inputId) {
            input.setAttribute("id", inputId);
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
        // -------------------------------------------------------------------------Append Parent (Todo) To TodoContainer
        todoContainer.insertBefore(todo, todoContainer.firstChild);
        // -------------------------------------------------------------------------Set Data To Firebase
        if (!inputId && !inputData) {
            try {
                const docRef = await addDoc(collection(db, "todos"), {
                    todoValue: todoValue,
                    isCompleted: false,
                    timestamp: Timestamp.now(),
                });
                idOfInput = docRef.id;
                if (!inputId) {
                    input.setAttribute("id", idOfInput);
                }
                console.log("Document written with ID: ", docRef.id);
                await activeCount();
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
        // -------------------------------------------------------------------------Calls Function That Sets todoItem To Local

        switch (val) {
            case "user":
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
        if (!todoItem.value.trim()) {
            todoItem.value = oldTodo;
        }
        todoItem.setAttribute("disabled", "true");
        editBtn.setAttribute("src", "./images/icon-pencil.svg");
        editData(todoItem.id, {
            todoValue: todoItem.value,
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
window.del = async function (element) {
    // -------------------------------------------------------------------------Deletes A Todo Item
    var todo = element.parentElement.parentElement;
    let idPara = todo.querySelector(".todoItem").id;
    todo.remove();
    deleteData(idPara);
    await activeCount();
};
// -----------------------------------------------------------------------------Adds Checked Class On Radio------------------------------------------------------------------//
window.toggleRadio = async function (element) {
    // -------------------------------------------------------------------------Targetting Radio Btn
    var radio = element;
    var todo = radio.parentNode.parentNode;
    var input = todo.querySelector(".todoItem");
    // -------------------------------------------------------------------------Removes/Add Checked Class To Radio Btn
    if (radio.classList.contains("checked")) {
        radio.classList.remove("checked");
        input.style.textDecoration = "none";
        input.style.color = "var(--clr-txt)";
        await editData(input.id, {
            isCompleted: false,
        });
    } else {
        radio.classList.add("checked");
        input.style.textDecoration = "line-through";
        input.style.color = "var(--clr-disabled-input)";
        await editData(input.id, {
            isCompleted: true,
        });
    }
    await activeCount();
};
// -----------------------------------------------------------------------------Sets Style on todoItems if Radio Is Checked--------------------------------------------------//
const completedStyles = () => {
    let todoItems = todoContainer.children;
    let todoItemsArr = [...todoItems];
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
//! Delte Completed Todo from DB
const deleteCompDB = async () => {
    try {
        const dbTodos = query(
            collection(db, "todos"),
            where("isCompleted", "==", true)
        );
        const querySnapshot = await getDocs(dbTodos);
        querySnapshot.docs.forEach((doc, index) => {
            deleteDoc(doc.ref);
            console.log("Todo successfully deleted!");
        });
    } catch (err) {
        console.log(err);
    }
};
// -----------------------------------------------------------------------------Deletes Completed Todo Items-----------------------------------------------------------------//
window.delCompleted = async function () {
    let todoItems = [...todoContainer.children];
    todoItems.forEach((todo) => {
        if (todo.querySelector(".radio").classList.contains("checked")) {
            todo.remove();
        }
    });
    deleteCompDB();
    // -------------------------------------------------------------------------Updates Length Of TodoList
    // await activeCount();
};
// -----------------------------------------------------------------------------Allows User To Sort todoItems-------------------------------------------------------------------//
new Sortable(todoContainer, {
    animation: 350,
    handle: ".sort",
    onEnd: function () {
        console.log("Sorted");
    },
});

//? Show Active Function

window.handleTodos = async function (req, event) {
    try {
        let submit = document.querySelector("#submit");
        let btnParent = [...event.parentNode.children];
        let dbTodos;
        switch (req) {
            case "active":
                dbTodos = query(
                    collection(db, "todos"),
                    where("isCompleted", "==", false),
                    orderBy("timestamp", "asc")
                );
                break;
            case "completed":
                dbTodos = query(
                    collection(db, "todos"),
                    where("isCompleted", "==", true),
                    orderBy("timestamp", "asc")
                );
                break;
            default:
                dbTodos = query(
                    collection(db, "todos"),
                    orderBy("timestamp", "asc")
                );
        }
        const querySnapshot = await getDocs(dbTodos);
        todoContainer.innerHTML = "";
        btnParent.forEach((btn) => {
            console.log(btn);
            btn.classList.remove("focus");
        });
        event.classList.add("focus");
        querySnapshot.docs.forEach((doc, index) => {
            console.log(querySnapshot.size, index);
            setTodo(doc.id, doc.data());
        });
        if (event.id == "completed") {
            submit.classList.add("disabledBtn");
        } else {
            submit.classList.remove("disabledBtn");
        }
    } catch (error) {
        console.log(error);
    }
};
