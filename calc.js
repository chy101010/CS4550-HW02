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

    // Checking whether the current value can be executed
    function isExecutable(value) {
        let numbers = 0;
        let operators = 0;
        const prev = value[value.length - 1];
        if(isOperator(prev) || prev === "." || prev === "-.") {
            return false;
        }
        for (let i = 0; i < value.length; i++) {
            if (isOperator(value[i])) {
                operators++;
            } else {
                numbers++;
            }
            if (numbers >= 2 && operators == 1) {
                return true;
            }
        }
        return false;
    }

    // 1+1*1*1- =
    function executeOperators(value, operators) {
        let pointer = -1;
        let processed = [];
        for (let i = 0; i < value.length; i++) {
            const cur = value[i];
            if(!isOperator(cur)) {
                if(operators.includes(processed[pointer])) {
                    processed[pointer - 1] = execute(parseFloat(processed[pointer - 1]), parseFloat(cur), processed[pointer]);
                    processed.pop();
                    pointer--;
                }else{
                    processed.push(cur);
                    pointer++;
                }
            }else {
                processed.push(cur);
                pointer++;
            }
        }
        return processed;
    }

    //  This class represents a 4-function calculators.
    //  You can have at most one "+" in the value.
    //           If the value already has a "+", then invoking "+" will likely 
    //           to result in the execution of the value
    //  "*" and "/" are prioritized over "+" and "-"
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
            if (prev === "-." || prev === "." || (isOperator(prev) && isOperator(pprev))) {
                return;
            }
            else if (operator === "-") {
                this.value.push(operator);
            }
            else if (isOperator(prev)) {
                this.value.pop();
                this.value.push(operator);
            }
            else {
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
            let prev = this.value[this.value.length - 1];
            let pprev = this.value[this.value.length - 2];
            if ((!isOperator(prev) && !prev.includes(".")) || (prev === "-" && isOperator(pprev))) {
                this.value[this.value.length - 1] = prev + ".";
            }
            else if(isOperator(prev)){
                this.value.push(".");
            }
        }

        // Add a digit (num)
        addNumber(num) {
            let length = this.value.length - 1;
            let cur = this.value[length];
            if (cur === "0" || cur === 0) {
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

        // Implemented Prioritizing / and * over + and -
        plusEnter() {
            if(isExecutable(this.value)) {
                const processed = executeOperators(this.value, ["*", "/"]);
                this.value = [executeOperators(processed, ["-", "+"])[0].toString()];
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
