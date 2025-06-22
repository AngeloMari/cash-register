const cash = document.getElementById("cash");
const change = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");
const displayCid = document.getElementById("display-cid");
const priceDisplay = document.getElementById("price-display");

let price = 1.87;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];
const denomValues = {
  PENNY: 0.01,
  NICKEL: 0.05,
  DIME: 0.1,
  QUARTER: 0.25,
  ONE: 1.0,
  FIVE: 5.0,
  TEN: 10.0,
  TWENTY: 20.0,
  "ONE HUNDRED": 100.0,
};

priceDisplay.textContent = "Price: $" + price;

displayCid.innerHTML = cid
  .map(([name, amt]) => `<div>${name}: $${amt}</div>`)
  .join("");

const changeCalculator = (money) => {
  let changeDue = parseFloat((money - price).toFixed(2));
  let originalCid = JSON.parse(JSON.stringify(cid));
  let totalCid = parseFloat(
    originalCid.reduce((sum, [_, amt]) => sum + amt, 0).toFixed(2)
  );

  if (changeDue > totalCid) {
    change.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  } else if (changeDue === totalCid) {
    change.textContent =
      "Status: CLOSED " +
      originalCid
        .filter(([_, amt]) => amt > 0)
        .map(([name, amt]) => `${name}: $${amt}`)
        .join(" ");
    return;
  } else {
    let drawer = JSON.parse(JSON.stringify(cid)).reverse();
    let changeArr = [];

    for (let [name, total] of drawer) {
      let value = denomValues[name];
      let amount = 0;

      while (changeDue >= value && total >= value) {
        changeDue = parseFloat((changeDue - value).toFixed(2));
        total = parseFloat((total - value).toFixed(2));
        amount = parseFloat((amount + value).toFixed(2));
      }

      if (amount > 0) {
        changeArr.push([name, amount]);
      }
    }

    if (changeDue > 0) {
      change.textContent = "Status: INSUFFICIENT_FUNDS";
      return;
    } else {
      change.innerHTML =
        "Status: OPEN<br>" +
        changeArr.map(([name, amt]) => `${name}: $${amt}`).join("<br>");

      for (let [name, amt] of changeArr) {
        for (let i = 0; i < cid.length; i++) {
          if (cid[i][0] === name) {
            cid[i][1] = parseFloat((cid[i][1] - amt).toFixed(2));
            break;
          }
        }
      }

      displayCid.innerHTML = cid
        .map(([name, amt]) => `<div>${name}: $${amt}</div>`)
        .join("");
      return;
    }
  }
};

const changeChecker = () => {
  const userMoney = Number(cash.value);
  if (userMoney < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  } else if (userMoney === price) {
    change.textContent = "No change due - customer paid with exact cash";
    return;
  } else {
    changeCalculator(userMoney);
  }
};

purchaseBtn.addEventListener("click", changeChecker);
cash.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    changeChecker();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  cash.focus();
});
