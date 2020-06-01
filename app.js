// BUDGET CONTROLLER
var budgetController = (function() {
    
    var Expense =function(id , description, value){
        this.id =id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id , description, value){
        this.id =id;
        this.description = description;
        this.value = value;
    };


    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        }
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
        expenseContainer: '.expenses__list'
       
    };
    
    
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
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

    var ctrlAddItem = function(){

        //varibles
        var input, newItem;

        //get input feild
        input = UICtrl.getInput();

        //add new item
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //add list item
        UICtrl.addListItem(newItem, input.type); 

        //clear feilds
        UICtrl.clearFields();


         
    }
    
    return {
        init: function() {
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);


controller.init();