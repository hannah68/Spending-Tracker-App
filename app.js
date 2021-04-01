const form = document.querySelector('.form');
const historyContainer = document.querySelector('.history-container');
const selectedItem = document.querySelector('#select');
const amount = document.querySelector('#amount');
const list = document.querySelector('#list');
const moneyPlus = document.querySelector('.money-plus');
const moneyMinus = document.querySelector('.money-minus');
const moneyBalance = document.querySelector('.money-balance');
const deleteBtn = document.querySelector('.delete-btn');


// Local storage setting and initializing=================================
const localStorageTransaction = JSON.parse(localStorage.getItem('actions'));
let actions = localStorage.getItem('actions') !== null ? localStorageTransaction : [];


//create chart js=============================================================
const spendingChart = document.querySelector('#chart').getContext('2d');


// Add transaction data to piechart******************
function addToChart(Transaction){
    pieChart.options.title.display = 'true';
    // add text to piechart label
    pieChart.data.labels.push(`${Transaction.text}`);
    // add amount to piechart data
    pieChart.data.datasets[0].data.push(Number(`${Transaction.amount}`));
    // add specific color to specific Transaction
    addColorToChart(Transaction);

    pieChart.update();  
}

// remove transaction data from the piechart***************
function removeChartData(text,amount){
    // removing text/label from the chart
    const textIndex = pieChart.data.labels.indexOf(`${text}`);
    const newLabelArr = pieChart.data.labels.splice(`${textIndex}`,1);
    // removing amount from the chart
    const amountIndex = pieChart.data.datasets[0].data.indexOf(Number(`${amount}`));
    const newAmountArr = pieChart.data.datasets[0].data.splice(Number(`${amountIndex}`),1);

    pieChart.update();
}



// Add color to each transaction item********************
function addColorToChart(Transaction){
    if(`${Transaction.text}` === 'Salary'){
        pieChart.data.datasets[0].backgroundColor.push('#ff7171') 
    }
    if(`${Transaction.text}` === 'Carry Over'){
        pieChart.data.datasets[0].backgroundColor.push('#9fd8df')
    }
    if(`${Transaction.text}` === 'Deposits'){
        pieChart.data.datasets[0].backgroundColor.push('#e4508f')  
    }
    if(`${Transaction.text}` === 'Saving'){
        pieChart.data.datasets[0].backgroundColor.push('#ffc785')  
    }
    if(`${Transaction.text}` === 'Eating Out'){
        pieChart.data.datasets[0].backgroundColor.push('#cff6cf') 
    }
    if(`${Transaction.text}` === 'Gifts'){
        pieChart.data.datasets[0].backgroundColor.push('#7189bf')
    }
    if(`${Transaction.text}` === 'Clothes'){-
        pieChart.data.datasets[0].backgroundColor.push('#fdffbc')  
    }
    if(`${Transaction.text}` === 'Entertainment'){
        pieChart.data.datasets[0].backgroundColor.push('#e4bad4')  
    }
    if(`${Transaction.text}` === 'Fuel'){
        pieChart.data.datasets[0].backgroundColor.push('#60a9a6') 
    }
    if(`${Transaction.text}` === 'Holidays'){
        pieChart.data.datasets[0].backgroundColor.push('#ffdcb8')
    }
    if(`${Transaction.text}` === 'Kids'){
        pieChart.data.datasets[0].backgroundColor.push('#532e1c')  
    }
    if(`${Transaction.text}` === 'Shopping'){
        pieChart.data.datasets[0].backgroundColor.push('#93329e')  
    }
    if(`${Transaction.text}` === 'Sports'){
        pieChart.data.datasets[0].backgroundColor.push('#a6b1e1') 
    }
    if(`${Transaction.text}` === 'Travel'){
        pieChart.data.datasets[0].backgroundColor.push('#1687a7')
    }
    if(`${Transaction.text}` === 'Car'){
        pieChart.data.datasets[0].backgroundColor.push('#ffb6b9')  
    }
    if(`${Transaction.text}` === 'Health'){
        pieChart.data.datasets[0].backgroundColor.push('#b9cced')  
    }
    if(`${Transaction.text}` === 'House'){
        pieChart.data.datasets[0].backgroundColor.push('#7868e6')  
    }
    if(`${Transaction.text}` === 'Others'){
        pieChart.data.datasets[0].backgroundColor.push('#f5b5fc')  
    }
}

// creating pie chart************************
let pieChart = new Chart(spendingChart,{
    type:'doughnut',
    data:{
        labels:[],
        
        datasets:[{
            label:'Amount',
            data:[],
            backgroundColor:[]
        }]
    },
    options:{
        title:{
            display:false,
            text:'Your Spending',
            fontSize:24,
            fontColor:'#1db4c5',
            position:'top',
            padding:20

        },
        legend:{
            display:true,
            position:'bottom',
            labels:{}
        },
        tooltips:{
            backgroundColor:'#660066',
        }
    }
})



// add new transaction and push it inside local storage**********
function addTransaction(){

    if(amount.value.trim() === ''){
        alert('Please add an amount')
    }else{
        const selectedValue = selectedItem[selectedItem.selectedIndex].value;
        const selectedAmount = amount.value;
        
        const Transaction = {
            id:generateId(),
            text:selectedValue,
            amount:Number(selectedAmount)
        }

        
        actions.push(Transaction);
        addTransactionToHistory(Transaction);
        addTransactionToBalance();
        addToChart(Transaction);
        updateLocalStorage();

        amount.value = '';
    }
}

// add transaction to history section of app(DOM)******************
function addTransactionToHistory(Transaction){
    const liElement = document.createElement('li');
    
    if(Transaction.amount > 0){
        liElement.classList.add('plus')
    }else{
        liElement.classList.add('minus')
    }

    liElement.innerHTML = `
        ${Transaction.text}<span>£${Math.abs(Transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${Transaction.id},'${Transaction.text}',${Transaction.amount})">X</button>
    `;

    list.insertAdjacentElement("beforeend",liElement);
}


// calculate balance,income and expenses and add them to DOM**********
function addTransactionToBalance(){
    const amounts = actions.map(act => act.amount);
    
    const income = amounts.filter(act => act > 0)
                          .reduce((acc,item) => (acc +=item),0)
                          .toFixed(2);
    const expense = ((amounts.filter(act => act < 0)
                           .reduce((acc,item) => (acc +=item),0)) * -1)
                           .toFixed(2);
                      
    const total = amounts.reduce((acc,item) => (acc +=item),0).toFixed(2);
    
    moneyPlus.innerText = `£${income}`;
    moneyMinus.innerText = `£${expense}`;
    moneyBalance.innerText =`£${total}`;
}

// generate random ID**********************
function generateId(){
    return Math.floor(Math.random() * 100)
}

// update localstorage transaction**********************
function updateLocalStorage(){
    localStorage.setItem('actions',JSON.stringify(actions));
}


// remove transaction from history section and local storage*************
function removeTransaction(id,text,amount){
    actions = actions.filter(act => act.id !==id);
    updateLocalStorage();
    removeChartData(text,amount);
    init()
}


// init app*****************************
function init(){
    list.innerHTML = '';
  
    actions.forEach(addTransactionToHistory);
    addTransactionToBalance();
    pieChart.update()
}
  
init();

// Add eventListener (Submit our new transactions)*********************
form.addEventListener('submit',function(e){
    e.preventDefault();
    addTransaction();
    if(localStorage.getItem('actions') !== null){
        historyContainer.classList.add('show');
    }else{
        historyContainer.classList.add('hide');
    }
});


// Sorting section ================================================
const sortBtn = document.querySelector('#sort-btn');
const dropdownMenu = document.querySelector('.menu');
const lowestBtn = document.querySelector('.item-lowest');
const highestBtn = document.querySelector('.item-highest');
const categoryAbtn = document.querySelector('.item-A');
const categoryBbtn = document.querySelector('.item-B');


// create sorted list in DOM*****************
function createSortedList(sortArr){
    list.innerHTML = '';

    for(let i=0; i< sortArr.length; i++){
        const li = document.createElement('li');
        
        if(sortArr[i].amount > 0){
            li.classList.add('plus')
        }else{
            li.classList.add('minus')
        }
        li.innerHTML = `
            ${sortArr[i].text}<span>£${Math.abs(sortArr[i].amount)}</span>
            <button class="delete-btn" onclick="removeTransaction(${sortArr[i].id},'${sortArr[i].text}',${sortArr[i].amount})">X</button>
        `;
        list.insertAdjacentElement('beforeend',li)
    }
}

// sort transactions by lowest amount***************
function sortTransactionBylowest(){
    const sortArr = actions.sort((a,b)=>{
        return a.amount - b.amount
    })
    createSortedList(sortArr)
}

// sort transactions by highest amount***************
function sortTransactionByHighest(){
    const sortArr = actions.sort((a,b)=>{
        return b.amount - a.amount
    })
    createSortedList(sortArr);
}

// sort transactions by category (A-Z)***************
function sortTransactionByCategoryA(){
    const sortArr = actions.sort((a,b)=>{
        if(a.text < b.text) { return -1; }
        if(a.text > b.text) { return 1; }
        return 0;
    })
    createSortedList(sortArr);
}

// sort transactions by category (Z-A)***************
function sortTransactionByCategoryB(){
    const sortArr = actions.sort((a,b)=>{
        if(a.text > b.text) { return -1; }
        if(a.text < b.text) { return 1; }
        return 0;
    })
    createSortedList(sortArr);
}



// All addEventListeners sort buttons========================
sortBtn.addEventListener('click',function(){
    dropdownMenu.classList.toggle('show');
})

lowestBtn.addEventListener('click',function(e){
    e.preventDefault()
    sortTransactionBylowest()
    dropdownMenu.classList.remove('show');
    dropdownMenu.classList.add('hide');
})

highestBtn.addEventListener('click',function(e){
    e.preventDefault()
    sortTransactionByHighest()
    dropdownMenu.classList.remove('show');
    dropdownMenu.classList.add('hide');
})

categoryAbtn.addEventListener('click',function(e){
    e.preventDefault()
    sortTransactionByCategoryA()
    dropdownMenu.classList.remove('show');
    dropdownMenu.classList.add('hide');
})

categoryBbtn.addEventListener('click',function(e){
    e.preventDefault()
    sortTransactionByCategoryB()
    dropdownMenu.classList.remove('show');
    dropdownMenu.classList.add('hide');
})






