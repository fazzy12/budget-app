// BUDGET CONTROLLER
var budgetController = (function() {
    
    var Expense = function(id , description, value){
        this.id =id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){

        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);  
        }else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
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

        deleteItem: function(type, id){
            var ids, index; 

            var ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }
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

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
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
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type){
        var numSplit, int, dec, type;
        
        num = Math.abs(num);
        num = num.toFixed(2)

        numSplit = num.split('.');

        int = numSplit[0];

        if(int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

       

        return  (type === 'exp' ? '-' : '+') + '' + int + '.' +  dec;

    }; 

    var nodeListForEach = function(list, callback){
        for(var i = 0; i < list.length; i++){
            callback(list[i], i);
        }
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
                html = `<div class="item clearfix" id="inc-%id%"> 
                <div class="item__description">%description%</div>
                <div class="right clearfix"><div class="item__value">%value%</div>
                <div class="item__delete"><button class="item__delete--btn">
                <i class="ion-ios-close-outline"></i></button></div></div></div>`;
            }else if(type === 'exp'){
                element = DOMstrings.expenseContainer;

                html = `<div class="item clearfix" id="exp-%id%">
                <div class="item__description">%description%</div>
                <div class="right clearfix">
                    <div class="item__value">%value%</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>`;
            }
           
           
            //replace the place holder with some actual text
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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
            var type;

            obj.budget > 0 ? type = 'inc' : type = 'exp';  

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenceLabel).textContent = formatNumber(obj.totalExp, 'exp');
             
 
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'; 
            }
        },

        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);
        

            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }
               
            });
       
        },

        displayMonth: function(){
            var now, year, month, months;

            now = new Date();
            
            months = ['january',  'febuary', 'march', 'april',
                        'may', 'june', 'july', 'August', 'september', 'october',
                    'november', 'december'];
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        
        changeType: function(){

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);

            
                

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });   
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
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
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);        


        document.querySelector(DOM.inputType).addEventListener('change',  UICtrl.changeType);
    };

    var updateBudget = function(){
        // calculate budget
        budgetCtrl.calculateBudget();

        // return the budget
        var budget = budgetCtrl.getBudget();

        //display budget in the UI
        UICtrl.displayBudget(budget); 
    };

    var updatePercentages = function(){
        // calculate percentages
        budgetCtrl.calculatePercentages();

        //read them from the budet controller
        var percentages = budgetCtrl.getPercentages();

        //update the ui with the new percentage
        UICtrl.displayPercentages(percentages);
    };

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

        //calc add percentages
        updatePercentages();
         
        }
        




         
    };

    var ctrlDeleteItem = function(event){

        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // delete item from data-structure
            budgetCtrl.deleteItem(type, ID);

            //delete the item from the UI
            UICtrl.deleteListItem(itemID);

            //update and show the new budget
            updateBudget();

            //calc add percentages
             updatePercentages();
         
        }
    };
    
    return {
        init: function() {
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);


controller.init();