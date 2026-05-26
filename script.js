// 할 일 글자들이랑 완료 체크 여부 저장할 배열 2개 만들기
// (나중에 매칭하기 편하게 인덱스 번호를 똑같이 맞춰서 쓸 예정)
let todoArray = []; 
let doneArray = []; 

// 브라우저 켜지면 로컬스토리지에 예전에 저장해둔 데이터 있는지 확인
const savedTodo = localStorage.getItem("todos");
const savedDone = localStorage.getItem("dones");

// 저장된 데이터가 있으면 날아가지 않게 다시 배열에 집어넣고 화면에 띄우기
if (savedTodo !== null && savedDone !== null) {
    todoArray = JSON.parse(savedTodo);
    doneArray = JSON.parse(savedDone);
    render(); // 화면 새로고침 및 최신화
}

//  추가 누르면 실행됨
function addTodo() {
    const input = document.querySelector("#input-box");
    const text = input.value;

    // 아무것도 입력 안 하고 추가 누르면 창 뜨게
    if (text === "") {
        alert("글자를 입력하세요");
        return;
    }

    // 인덱스 맞춰서 텍스트 배열이랑 완료 여부 배열에 각각 넣어주기
    todoArray.push(text);
    doneArray.push(false); // 처음 만들었을 때는 완료 상태가 아니니까 일단 false로

    save();   // 로컬스토리지에 저장하고
    render(); // 화면 새로고침하기
    
    input.value = ""; // 다음 입력을 위해 입력창은 깨끗하게 비워주기
}

//  매번 배열 바뀌는거 로컬스토리지에 동기화해서 저장ㅇ
function save() {
    localStorage.setItem("todos", JSON.stringify(todoArray));
    localStorage.setItem("dones", JSON.stringify(doneArray));
}

// 배열 데이터 바탕으로 화면에 리스트 쫙 그려주는 함수 (DOM 제어)
function render() {
    const ul = document.querySelector("#todo-list");
    let html = ""; // li 태그들 누적해서 쌓아둘 변수

    // 가장 기본적이고 안전한 for문으로 배열 크기만큼 반복 돌리기
    for (let i = 0; i < todoArray.length; i++) {
        let text = todoArray[i];
        const isCompleted = doneArray[i];
        
        // 완료 상태(true)라면 글자 앞에 체크 이미지 태그를 강제로 붙여
        // 이미지 크기 가로세로 20픽셀 가운데정렬
        if (isCompleted === true) {
            text = "<img src='check.png' width='20' height='20' style='margin-right: 5px; vertical-align: middle;'> " + text;
        }

        //버튼 누를 때 현재 인덱스i를 함수로 넘겨줌
        html += `
            <li>
                ${text}
                <div>
                    <button onclick="toggleComplete(${i})">완료</button>
                    <button onclick="editMode(${i})">수정</button>
                    <button onclick="deleteTodo(${i})">삭제</button>
                </div>
            </li>
        `;
    }

    ul.innerHTML = html; // html를 ul 안에 집어넣어서 내 눈에 보이게 해줌
}

// 완료 버튼 누르면 상태 반전시켜 주는 함수
function toggleComplete(index) {
    // true면 false로 바꾸고, false면 true로 뒤집기 (토글 방식)
    if (doneArray[index] === true) {
        doneArray[index] = false;
    } else {
        doneArray[index] = true;
    }
    save();   // 바뀐 상태 저장
    render(); // 화면 다시 그리기
}

// 삭제 버튼 누르면 지워주는 함수
function deleteTodo(index) {
    // splice 써서 두 배열의 똑같은 인덱스 위치 데이터를 딱 1개만 삭제
    todoArray.splice(index, 1);
    doneArray.splice(index, 1);
    
    save();   // 지워졌으니 다시 저장하고
    render(); // 화면 갱신
}

//수정하면 그 줄만 input으로 변하게 ㅎ람수
function editMode(index) {
    const ul = document.querySelector("#todo-list");
    const liList = ul.querySelectorAll("li");
    
    
   
    liList[index].innerHTML = `
        <input type="text" id="edit-box" value="${todoArray[index]}">
        <button onclick="saveEdit(${index})">저장</button>
    `;
}

// 수정 다 하고 저장 누르면 최종 반영하는 함수
function saveEdit(index) {
    const editInput = document.querySelector("#edit-box");
    const newText = editInput.value;

    
    if (newText === "") {
        alert("내용을 입력하세요.");
        return;
    }

    todoArray[index] = newText;
    
    save();   // 로컬스토리지 최신화하고
    render(); // 다시 화면 새로고침
}