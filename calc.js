(function () {
    "use strict";

    // Check whether input is an operator
    function isOperator(input) {
        return input === "*" || input === "/" || input === "+" || input === "-" || input === "+/=";
    }

    // Execute the following: num1 operator(/, -, *, +) num2
    function execute(num1, num2, operator) {
        switch (operator) {
            case "-":
                num1 -= num2;
                break;
            case "+":
                num1 += num2;
                break;
            case "/":
                num1 /= num2;
                break;
            default:
                num1 *= num2;
        }
        if (num1) {
            return num1;
        } else {
            return 0;
        }
    }

    //  This class represents a 4-function calculators.
    //  You can have at most one "+" in the value.
    //           If the value already has a "+", then invoking "+" will likely 
    //           to result in the execution of the value
    //  "+" and "-" are not prioritize over "+" and "-"
    //  Diving a number / 0 will be 0
    class Calculator {
        constructor() {
            this.value = ["0"];
        }

        // Handles -, *, /
        //      Valide +, --, *, /, -
        generalOperator(operator) {
            let prev = this.value[this.value.length - 1];
            let pprev = this.value[this.value.length - 2];
            if (prev === ".") {
                return;
            }
            if (operator === "-" && prev === "-" && !isOperator(pprev)) {
                this.value.push(operator);
            }
            else if(isOperator(prev) && isOperator(pprev)) {
                return;
            }
            else if (isOperator(prev)) {
                this.value.pop();
                this.value.push(operator);
            }
            else{
                this.value.push(operator);
            }

        }

        // Returns the this.value as String 
        _toString() {
            let result = "";
            this.value.forEach(num => {
                result += num;
            })
            return result;
        }

        // Clear the value
        clear() {
            this.value = ["0"];
        }

        // Add mutiply
        mutiply() {
            this.generalOperator("*");
        }

        // Add divide
        divide() {
            this.generalOperator("/")
        }

        // Add minus 
        minus() {
            this.generalOperator("-");
        }

        // Add demical 
        addDecimal() {
            let cur = this.value[this.value.length - 1];
            if (!isOperator(cur) && !cur.includes(".")) {
                this.value[this.value.length - 1] = cur + ".";
            }
            else if (isOperator(cur)) {
                this.value.push(".");
            }
        }

        // Add a digit (num)
        addNumber(num) {
            let length = this.value.length - 1;
            let cur = this.value[length];
            if (cur === "0") {
                this.value.pop();
                this.value.push(num);
            }
            else if (!isOperator(cur) || (cur === "-" && isOperator(this.value[length - 1]))) {
                this.value[length] += num;
            }
            else {
                this.value.push(num);
            }
        }

        // If the current expression in the value array is valid for executing, then treat as "=" 
        // Else call generalOperator with "+""
        // A valid expression: contains atleast one operator and two numbers
        // As we are checking the expression, we should treat it as "=" until we find it is not valid.
        plusEnter() {
            let result = 0;
            let operators = 0;
            let numbers = 0;
            let operator = "";
            for (let i = 0; i < this.value.length; i++) {
                if (isOperator(this.value[i])) {
                    operators++;
                    operator = this.value[i];
                } else {
                    numbers++;
                    if (operator) {
                        result = execute(parseFloat(result), parseFloat(this.value[i]), operator);
                        operator = "";
                    } else {
                        result = this.value[i];
                    }
                }
            }
            if (operators >= 1 && numbers >= 2) {
                this.value = [result.toString()];
            }
            else {
                this.generalOperator("+");
            }
        }
    }

    // Instiante the calculator object
    let calculator = new Calculator();

    // Display the calculator's value to the HTML
    function displayValue() {
        // Getting the displaying div
        const display = document.getElementById("display");
        display.innerText = calculator._toString();
    }


    // Getting the td buttons
    const buttons = document.querySelectorAll("td");

    // applying event/function to each td button
    buttons.forEach(td => {
        if (isOperator(td.innerHTML)) {
            td.addEventListener("click", (event) => {
                switch (event.currentTarget.innerHTML) {
                    case "+/=":
                        calculator.plusEnter();
                        break;
                    case "-":
                        calculator.minus();
                        break;
                    case "/":
                        calculator.divide();
                        break;
                    default:
                        calculator.mutiply();
                        break;
                }
            })
        } else if (td.innerHTML === ".") {
            td.addEventListener("click", () => {
                calculator.addDecimal();
            })
        }
        else if (td.innerHTML === "C") {
            td.addEventListener("click", () => {
                calculator.clear();
            })
        }
        else {
            td.addEventListener("click", (event) => {
                calculator.addNumber(event.currentTarget.innerHTML);
            })
        }
        td.addEventListener("click", displayValue);
    })

})()