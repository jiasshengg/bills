document.addEventListener('DOMContentLoaded', function () {
    const pplForm = document.querySelector('#ppl-form'); 

    pplForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
    const formData = new FormData(pplForm) ;

    const formDataObj = { 
        noOfPpl : formData.get('noOfPpl') 
    }

    try {
        const intNoOfPpl = parseInt(formDataObj.noOfPpl) ;

        if (isNaN(intNoOfPpl) || intNoOfPpl <= 0) {
            throw new Error("Enter a valid number hoe");
        }

        function createNameForm (numberOfPpl) {
            const nameFormContainer = document.querySelector('#nameFormContainer');
                if (!nameFormContainer) {
                    console.error('Form cannot be displayed due to missing container');
                    return;
                }

            nameFormContainer.innerHTML = ''; 

                const nameForm = document.createElement('form');
                nameForm.id = 'name-form';

                for (let i = 1; i <= numberOfPpl ; i++) {
                    const inputDiv = document.createElement('div');
                    inputDiv.className = 'name-input-group';
                    
                    const label = document.createElement('label');
                    label.textContent = `dumbass #${i} : `;
                    label.setAttribute('for', `person-${i}`);
                    
                    const input = document.createElement('input');

                    input.type = 'text';
                    input.name = `person-${i}`;
                    input.id = `person-${i}`;
                    input.required = true;
                
                    inputDiv.appendChild(label);
                    inputDiv.appendChild(input);
                    nameForm.appendChild(inputDiv);
                }

                const submitBtn = document.createElement('button');
                submitBtn.type = 'submit';
                submitBtn.textContent = 'Submit Names';
                submitBtn.id = 'submitNames';
                nameForm.appendChild(submitBtn);

                nameFormContainer.appendChild(nameForm);
                
                nameForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const nameFormData = new FormData(nameForm);
                    const names = [];
                    
                    for (let i = 1; i <= numberOfPpl; i++) {
                        const name = nameFormData.get(`person-${i}`);
                        if (name && name.trim()) {
                            names.push(name.trim());
                        }
                    }
                    
                    if (names.length === numberOfPpl) {
                        console.log(names);
                        window.location.href = "../second/fees.html" ;
                    } else {
                        alert('fill in all the fields hoe');
                        return;
                    }
                });
            }
            
            createNameForm(intNoOfPpl);
        
        } catch (error) {
            alert("enter a valid integer hoe");
            console.error(error.message);
            return;
    }

    });
});