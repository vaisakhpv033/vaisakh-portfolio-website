document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const result = document.getElementById('result');
    const load = document.getElementById('loading')

    console.log(form);



    form.addEventListener('submit', function (e) {
        e.preventDefault();


        // Clear previous validation messages
        document.querySelectorAll('.validation-message').forEach(el => el.innerHTML = '');

        // Validate form inputs
        if (!validateInputs()) {
            return; // Exit if the form is not valid
        }


        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
        load.innerHTML = "Sending..."

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    result.innerHTML = "message sent successfully";
                    load.style.display = "none";
                } else {
                    console.log(response);
                    result.innerHTML = json.message;
                }
            })
            .catch(error => {
                console.log(error);
                load.innerHTML = "Something went wrong!";
            })
            .then(function () {
                form.reset();
                setTimeout(() => {
                    result.style.display = "none";
                }, 3000);
            });
    });




    function validateInputs() {
        const name = document.querySelector('#name-field').value;
        const email = document.querySelector('#email-field').value;
        const subject = document.querySelector('#subject-field').value;
        const message = document.querySelector('#message-field').value;
        let valid = true;

        if (!validateName(name)) {
            document.querySelector('#name-field').nextElementSibling.innerHTML = "*Please enter a valid name";
            valid = false;
        }

        if (!validateEmail(email)) {
            document.querySelector('#email-field').nextElementSibling.innerHTML = "*Please enter a valid email address.";
            valid = false;
        }

        if (subject === '') {
            document.querySelector('#subject-field').nextElementSibling.innerHTML = "*Subject is required.";
            valid = false;
        }

        if (message === '') {
            document.querySelector('#message-field').nextElementSibling.innerHTML = "*Message is required.";
            valid = false;
        }

        return valid;
    }

    function validateName(name) {
        const re = /^[a-zA-Z\s]+$/;
        return re.test(String(name));
    }

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    }
});