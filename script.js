const $ = document
const input = $.querySelector('#input-todo')
const saveTodoBtn = $.querySelector('#saveTodoBtn')
// const selectTag = $.querySelector('#selectTag')
const containerModal = $.querySelector('.containerModal')
const contentModal = $.querySelector('#contentModal')
const containerTodos = $.querySelector('#containerTodos')
const closeBtn = $.querySelector('.closeBtn')
const todoDel = $.querySelector('.todoDel')
const iconEdit = $.querySelector('.iconEdit')
//  load data in dataBase
window.addEventListener('load', () => {
    let data = get('https://apptodos-2a17c-default-rtdb.firebaseio.com/apptodos/todo.json')
    data.then(data => {
        templateTodo(data)
        showModal('flex', "کار های روزانه جمع اوری شدند")
    }).catch(() => {
        showModal('flex', "اتصال خود را بررسی کنید")
    })
})

// function creatData : creat todo send in dataBase
function creatData() {
    if (input.value) {
        let todo = {
            content: input.value,
            isDone: false
        }
        input.value = ''
        sendData(todo)
    } else {
        showModal('flex', 'کار روزانه ای وارد نکردید')
    }
}

//           function sendData : send todo in dataBase
function sendData(todo) {
    fetch('https://apptodos-2a17c-default-rtdb.firebaseio.com/apptodos/todo.json', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(todo)
    }).then(() => {
        let getTodo = get('https://apptodos-2a17c-default-rtdb.firebaseio.com/apptodos/todo.json')
        getTodo.then(data => {
            templateTodo(data)
            showModal('flex', 'کار روزانه ی شما ثبت شد')
        })
    })
        .catch(() => {
            showModal('flex', 'کار روزانه ی شما ثبت نشد')
        })
}

//  function getData : get data in dataBase
async function get(api) {
    let dataEntries = null
    await fetch(api)
        .then(res => res.json())
        .then(data => {
            if (data) {
                dataEntries = Object.entries(data)
            } else {
                showModal('flex', 'شما کار روزانه ای ندارید')
            }
        })
        .catch(err => {
            return err
        })
    return dataEntries
}

//  function showModal : showModal in document
function showModal(display, text) {
    containerModal.style.display = display
    contentModal.innerHTML = text

}

// function templateTodo : creat template todos and append document
function templateTodo(listTodos) {
    containerTodos.innerHTML = ''
    let fragment = $.createDocumentFragment()
    listTodos.forEach(todo => {
        let {content, isDone} = todo[1]
        let boxTodo = $.createElement('div')
        boxTodo.className = 'boxTodo'
        boxTodo.id = todo[0]
        boxTodo.innerHTML = content
        let spanTag = $.createElement('span')
        spanTag.className = "iconEdit"
        spanTag.addEventListener('click', () => {
            if (iTag.className === 'icofont-ui-check') {
                editeTodo(todo[0], content, false)

            } else {
                editeTodo(todo[0], content, true)
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
    })
    containerTodos.append(fragment)
}

function editeTodo(todoID, content, done) {
    fetch(`https://apptodos-2a17c-default-rtdb.firebaseio.com/apptodos/todo/${todoID}.json`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            content: content,
            isDone: done
        })
    }).then(() => {
        let getTodo = get('https://apptodos-2a17c-default-rtdb.firebaseio.com/apptodos/todo.json')
        getTodo.then((data) => {
            templateTodo(data)
        })
    }).catch(err => console.log(err))
}

//   function getData : update todos in document
function getData() {
    let getTodo = get('https://apptodos-2a17c-default-rtdb.firebaseio.com/apptodos/todo.json')
    getTodo.then(data => {
        templateTodo(data)
        showModal('flex', 'کار روزانه ی شما حذف شد')
    })
        .catch(err => console.log(err))
}

// function deleteTodo : delete todo in dataBase
function deleteTodo(e) {
    if (e.target.id !== 'containerTodos') {
        let todoId = e.target.id
        fetch(`https://apptodos-2a17c-default-rtdb.firebaseio.com/apptodos/todo/${todoId}.json`, {
            method: 'DELETE'
        }).then(() => getData())
            .catch(() => {
                showModal('flex', 'خطا..کار روزانه حدف نشد اتصال خورد را بررسی کنید ):')
            })
    }
}

let boxTodo = null
containerTodos.addEventListener('click', (e) => {
    if (e.target.id !== 'containerTodos' && e.target.className !== 'icofont-ui-check') {
        closeBtn.innerHTML = "لغو"
        todoDel.innerHTML = 'حذف'
        todoDel.style.display = 'block'
        boxTodo = document.querySelector(`#${e.target.id}`)
        boxTodo.classList.add('delete')
        showModal('flex', 'این کار روزانه حذف شود؟')
        todoDel.onclick = () => {
            deleteTodo(e)
            closeModal(boxTodo)
        }
    }
})

function closeModal() {
    if (closeBtn.innerHTML === 'لغو') {
        boxTodo.classList.remove('delete')

    }
    closeBtn.innerHTML = "متوجه شدم"
    containerModal.style.display = 'none'
    todoDel.style.display = 'none'
}

closeBtn.addEventListener('click', closeModal)
input.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
        creatData()
    }
})
saveTodoBtn.addEventListener('click', () => {
    creatData()
})