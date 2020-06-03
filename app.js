// BUDGET CONTROLLER
var budgetController = (function() {
    
    var Expense = function(id , description, value){
        this.id =id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id , description, value){
        this.id =id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    };


    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val){
            var newItem, ID;
            ID = 0; 

            //create new Id
            if(data.allItems[type].length > 0){
                ID  = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }

            //create new item based on icome and expenditure
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            //push into new element
            data.allItems[type].push(newItem);
            
            //then return new element
            return newItem;
        },

        calculateBudget: function(){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');


            //calculate the budget income - expenses 
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income the we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }            
        },

        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function(){
            console.log(data);
        }
    };
})();




// UI CONTROLLER
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenceLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
       
    };
    
    
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        
        addListItem: function(obj, type){
            var html, newHtml, element;
            //create html with some place holder text
           

            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = `<div class="item clearfix" id="income-%id%"> 
                <div class="item__description">%description%</div>
                <div class="right clearfix"><div class="item__value">%value%</div>
                <div class="item__delete"><button class="item__delete--btn">
                <i class="ion-ios-close-outline"></i></button></div></div></div>`;
            }else if(type === 'exp'){
                element = DOMstrings.expenseContainer;

                html = `<div class="item clearfix" id="expense-%id%">
                <divclass="item__description">%description%</divclass=>
                <div class="right clearfix"><div class="item__value">%value%</div>
                <div class="item__percentage">21%</div><div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline">
                </i></button></div></div></div>`;
            }
           
           
            //replace the place holder with some actual text
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        //clearing input fields
        clearFields: function(){
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', '+ DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.Value = "";
            });
            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenceLabel).textContent = obj.totalExp;
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
        },
        
        getDOMstrings: function() {
            return DOMstrings;
        } 
    };
    
})();




// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        
                
    };

    var updateBudget = function(){
        // calculate budget
        budgetCtrl.calculateBudget();

        // return the budget
        var budget = budgetCtrl.getBudget();

        //display budget in the UI
        UICtrl.displayBudget(budget); 
    }

    var ctrlAddItem = function(){

        //varibles
        var input, newItem;

        //get input feild
        input = UICtrl.getInput();


        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            //add new item
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //add list item
        UICtrl.addListItem(newItem, input.type); 

        //clear feilds
        UICtrl.clearFields();

        //calculate and update budget
        updateBudget();
        }
        




         
    }
    
    return {
        init: function() {
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);


controller.init();