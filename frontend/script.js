const API_URL = "http://localhost:5000";


// Load students when page opens
window.onload = function () {
    getStudents();
};


// Get students from backend
function getStudents() {

    fetch(`${API_URL}/students`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not load students.");
            }
            return response.json();
        })
        .then(data => {

            let table = document.getElementById("studentTable");

            table.innerHTML = "";


            data.forEach(student => {

                table.innerHTML += `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.roll_no}</td>
                        <td>${student.department}</td>
                    </tr>
                `;

            });

        })
        .catch(error => {

            console.log("Backend connection error:", error);

        });

}



// Add student
function addStudent() {


    let name = document.getElementById("name").value;

    let roll_no = document.getElementById("roll").value;

    let department = document.getElementById("department").value;



    let student = {

        name: name,
        roll_no: roll_no,
        department: department

    };



    fetch(`${API_URL}/students`, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(student)

    })

    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || "Could not add student.");
            });
        }
        return response.json();
    })

    .then(data => {


        alert("Student Added Successfully");


        getStudents();


        document.getElementById("name").value = "";
        document.getElementById("roll").value = "";
        document.getElementById("department").value = "";


    })


    .catch(error => {

        alert(error.message);

    });


}