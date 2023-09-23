const $ = document
const input = $.querySelector('#input-todo')
const saveTodoBtn = $.querySelector('#saveTodoBtn')
const containerModal = $.querySelector('.containerModal')
const contentModal = $.querySelector('#contentModal')
const containerTodos = $.querySelector('#containerTodos')
const closeBtn = $.querySelector('.closeBtn')
const todoDel = $.querySelector('.todoDel')
const iconEdit = $.querySelector('.iconEdit')


async function loadPage() {
    try {
        let data = await getData('https://apptodos-2a17c-default-rtdb.firebaseio.com/apptodos/todo.json')
        templateTodo(data)
    } catch (err) {
        console.log(err)
    }


}

function creatData() {
    if (input.value) {
        let todo = {
            content: input.value,
            isDone: false
        }
        input.value = ''
        sendData(todo).then()
    } else {
        showModal('flex', 'کار روزانه ای وارد نکردید')
    }
}

//           function sendData : send todo in dataBase
async function sendData(todo) {
    try {
        await fetch('https://apptodos-2a17c-default-rtdb.firebaseio.com/apptodos/todo.json', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(todo)
        })
        let data = await getData('https://apptodos-2a17c-default-rtdb.firebaseio.com/apptodos/todo.json')
        await templateTodo(data)
        showModal('flex', 'کار روزانه ی شما ثبت شد')
    } catch (err) {
        showModal('flex', 'کار روزانه ی شما ثبت نشد')
    }
}


async function getData(api) {
    try {
        let getData = await fetch(api)
        let jsonData = await getData.json()
        return Object.entries(jsonData)
    } catch (err) {
        console.log(err)
    }
}

// function templateTodo : creat template All todos and append document
function templateTodo(listTodos) {
    containerTodos.innerHTML = ''
    let fragment = $.createDocumentFragment()
    listTodos.forEach(todo => {
        generatorTemplateTodos(todo, fragment)
    })
    containerTodos.append(fragment)
}

//
function generatorTemplateTodos(todo, fragment) {
    let {content, isDone} = todo[1]
    let boxTodo = $.createElement('div')
    boxTodo.className = 'boxTodo'
    boxTodo.id = todo[0]
    boxTodo.innerHTML = content
    let spanTag = $.createElement('span')
    spanTag.className = "iconEdit"
    spanTag.addEventListener('click', () => {
        if (iTag.className === 'icofont-ui-check') {
            editeTodo(todo[0], content, false).then()

        } else {
            editeTodo(todo[0], content, true).then()
        }
    })
    let iTag = $.createElement('i')
    if (isDone) {
        iTag.className = 'icofont-ui-check'
        iTag.style.color = 'green'
        boxTodo.classList.add('done')
    } else {
        iTag.className = 'icofont-ui-close'
    }
    spanTag.append(iTag)
    boxTodo.append(spanTag)
    fragment.append(boxTodo)
}

//
async function editeTodo(todoID, content, done) {
    try {
        await fetch(`https://apptodos-2a17c-default-rtdb.firebaseio.com/apptodos/todo/${todoID}.json`, {
            method: 'PUT',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                content: content,
                isDone: done
            })
        })
        let data = await getData('https://apptodos-2a17c-default-rtdb.firebaseio.com/apptodos/todo.json')
        await templateTodo(data)
        selectTag.value = "همه"
    } catch (err) {
        showModal('flex', 'اتصال خود را بررسی کنید')
    }
}

let boxTodo = null
containerTodos.addEventListener('click', (e) => {
    console.log(e.target)
    if (e.target.id !== 'containerTodos' && e.target.className !== 'icofont-ui-check') {
        closeBtn.innerHTML = "لغو"
        todoDel.innerHTML = 'حذف'
        todoDel.style.display = 'block'
        boxTodo = document.querySelector(`#${e.target.id}`)
        boxTodo.classList.add('delete')
        let historyScroll = window.scrollY
        showModal('flex', 'این کار روزانه حذف شود؟')
        closeBtn.onclick = () => {
            window.scrollTo(0, historyScroll)
        }
        document.querySelector('.containerModal').scrollIntoView()
        todoDel.onclick = () => {
            deleteTodo(e).then()
            closeModal()
        }
    }
})

async function deleteTodo(e) {
    try {
        if (e.target.id !== 'containerTodos') {
            let todoId = e.target.id
            let deleteTodo = await fetch(`https://apptodos-2a17c-default-rtdb.firebaseio.com/apptodos/todo/${todoId}.json`, {
                method: 'DELETE'
            })
            if (deleteTodo.status === 200) {
                let data = await getData('https://apptodos-2a17c-default-rtdb.firebaseio.com/apptodos/todo.json')
                templateTodo(data)
                showModal('flex', 'کار روزانه ی شما حذف شد')
            } else {
                showModal('flex', 'خطا..کار روزانه حدف نشد اتصال خورد را بررسی کنید ):')

            }
        }
    } catch (err) {
        console.log(err)
    }
}

function closeModal() {
    if (closeBtn.innerHTML === 'لغو') {
        boxTodo.classList.remove('delete')
        containerModal.style.display = 'none'
        todoDel.style.display = 'none'
        closeBtn.innerHTML = "متوجه شدم"
    }
    closeBtn.innerHTML = "متوجه شدم"
    containerModal.style.display = 'none'
    todoDel.style.display = 'none'
}

function showModal(display, text) {
    containerModal.style.display = display
    contentModal.innerHTML = text
}

const selectTag = $.querySelector('#selectTag')
selectTag.addEventListener('change', async () => {
    try {
        let data = await getData('https://apptodos-2a17c-default-rtdb.firebaseio.com/apptodos/todo.json')
        if (selectTag.value === 'تکمیل شده') {
            completeTodos(data, true)
        } else if (selectTag.value === 'تکمیل نشده') {
            completeTodos(data, false)
        } else {
            templateTodo(data)
        }
    } catch (err) {
        showModal('flex', 'اتصال خود را بررسی کنید')
    }
})

function completeTodos(todos, boolean) {
    containerTodos.innerHTML = ''
    let fragment = document.createDocumentFragment()
    todos.forEach(todo => {
        if (todo[1].isDone === boolean) {
            generatorTemplateTodos(todo, fragment)
        }
    })
    containerTodos.append(fragment)
}


closeBtn.addEventListener('click', closeModal)
window.addEventListener('load', loadPage)
input.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
        creatData()
    }
})
saveTodoBtn.addEventListener('click', () => {
    creatData()
})