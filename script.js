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
  ["ONE HUNDRED", 100]
];

//Parallel array to keep track of $ values at each index of the cid array
const cidValues = [0.01, 0.05, 0.10, 0.25, 1, 5, 10, 20, 100];

const moneyInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDue = document.getElementById("change-due");
const registerDiv = document.getElementById("register-money");
const priceDisplay = document.getElementById("price");
const outputDiv = document.getElementById("output-div");

let statusText = "OPEN";

priceDisplay.textContent = "Money Due: $" + price;

/**
 * Handles purchase button being pressed
 */
const handlePurchaseButton = () => {

  //How much is in the register currently
  const moneyInRegister = cid.map(item => item[1]).reduce((acc,val) => acc+val,0);
  const inputValue = Number(moneyInput.value);

  if(inputValue < price) {
    alert("Customer does not have enough money to purchase the item");
  }
  else if(inputValue === price) {
    outputDiv.style.display = "flex";
    changeDue.innerHTML = "<p>No change due - customer paid with exact cash</p>";
  }
  else if((parseFloat((inputValue - price).toFixed(2))) > moneyInRegister) {
    outputDiv.style.display = "flex";
    changeDue.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`
  }
  else {
    outputDiv.style.display = "flex";
    let change = getChange(parseFloat((inputValue - price).toFixed(2)), cid.length - 1);
    changeDue.innerHTML = `<p>Status: ${statusText} ${change}</p>`

  }

}

function getChange(inputNum, index) {

  let output = "";

  for(let i = index; i >= 0; i--) {
    
    let removed = 0;
    while(cid[i][1] != 0 && cidValues[i] <= inputNum) {

      //console.log(`Result of ${cidValues[i]} <= ${inputNum}: ` + (cidValues[i] <= inputNum))

      removed = parseFloat((removed + cidValues[i]).toFixed(2));
      //console.log("inputNum currently: " + inputNum);
      inputNum = parseFloat((inputNum - cidValues[i]).toFixed(2));
      //console.log(`inputNum is now: ${inputNum} after previous value minus ${cidValues[i]} `)
      cid[i][1] = parseFloat((cid[i][1] - cidValues[i]).toFixed(2));

      //console.log("Removed: " + removed + " a " + cid[i][0]);
    }
    if(removed != 0) {
      output += `<p>${cid[i][0]}: $${removed}</p>`;
    }
  }

  if(cid.map(item => item[1]).reduce((acc,val) => acc+val,0) === 0) {
    statusText = "CLOSED";
  }
  else if(inputNum != 0) {
    statusText = "";
    return "INSUFFICIENT_FUNDS";
  }
  
  return output;
}

purchaseBtn.addEventListener("click", handlePurchaseButton);

moneyInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handlePurchaseButton();
  }
});
