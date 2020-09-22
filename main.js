"use strict";

const addItemBtn = document.querySelector(".add-btn");
const footerInput = document.querySelector(".footer-input");
const itemList = document.querySelector(".item-list");

/* 상품추가 버튼 클릭 및 엔터시 */
addItemBtn.addEventListener("click", () => onAddItem());
footerInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    onAddItem();
  }
});

/* input 안에 글자를 체크하는 함수 */
function onAddItem() {
  let text = footerInput.value;

  if (text.length === 0) {
    alert("추가할 상품을 입력해주세요.");
    footerInput.focus();
    return;
  } else {
    const item = createItemHTML(text);
    itemList.appendChild(item);
  }
  itemList.scrollTop = itemList.scrollHeight;
  footerInput.value = "";
  footerInput.focus();
}

/* 아이템을 추가하는 함수 */
function createItemHTML(text) {
  const itemRow = document.createElement("li");
  itemRow.setAttribute("class", "item");
  itemRow.innerHTML = `
    <span>${text}</span>
    <button type="button" class="delete-btn far fa-trash-alt">
      <span class="blind">상품삭제</span>
    </button>
  `;
  return itemRow;
}

/* 아이템 삭제 */
itemList.addEventListener("click", event => {
  const eventTarget = event.target;
  if (!eventTarget.classList.contains("delete-btn")) {
    return;
  }

  if (window.confirm("해당 상품을 삭제하시겠습니까?")) {
    eventTarget.parentNode.remove();
  }
});
