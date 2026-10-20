const registrationForm = document.getElementById("registrationForm");
const studentsList = document.getElementById("studentsList");

let students = JSON.parse(localStorage.getItem("students")) || [];

function displayStudents() {
    studentsList.innerHTML = "";

    students.forEach(function(student) {
        const row = document.createElement("tr");

        [student.name, student.id, student.course].forEach(function(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        studentsList.appendChild(row);
    });
}

registrationForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const id = document.getElementById("studentId").value.trim();
    const course = document.getElementById("course").value.trim();

    if (students.some(function(student) {
        return student.id.toLowerCase() === id.toLowerCase();
    })) {
        alert("This Student ID is already registered!");
        return;
    }

    students.push({ name: name, id: id, course: course });

    localStorage.setItem("students", JSON.stringify(students));

    displayStudents();
    registrationForm.reset();

    alert("Student registered successfully!");
});

displayStudents();

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const loginId = document.getElementById("loginStudentId").value.trim();

    const student = students.find(function(student) {
        return student.id.toLowerCase() === loginId.toLowerCase();
    });

    if (student) {
        loginMessage.textContent = "Login successful! Welcome, " + student.name + "!";
        loginMessage.style.color = "green";
    } else {
        loginMessage.textContent = "Student ID not found. Please register first.";
        loginMessage.style.color = "red";
    }
});

const profileForm = document.getElementById("profileForm");
const profileDetails = document.getElementById("profileDetails");

profileForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const profileId = document.getElementById("profileStudentId").value.trim();

    const student = students.find(function(student) {
        return student.id.toLowerCase() === profileId.toLowerCase();
    });

    if (student) {
        profileDetails.innerHTML = "";

        const heading = document.createElement("h3");
        heading.textContent = "Student Profile";

        const name = document.createElement("p");
        name.textContent = "Name: " + student.name;

        const id = document.createElement("p");
        id.textContent = "Student ID: " + student.id;

        const course = document.createElement("p");
        course.textContent = "Course: " + student.course;

        profileDetails.append(heading, name, id, course);
    } else {
        profileDetails.textContent = "Student not found. Please check the Student ID.";
    }
});

let attendanceRecords = JSON.parse(
    localStorage.getItem("attendanceRecords")
) || [];

const attendanceForm = document.getElementById("attendanceForm");
const attendanceMessage = document.getElementById("attendanceMessage");

attendanceForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const studentId = document.getElementById("attendanceStudentId").value.trim();
    const status = document.getElementById("attendanceStatus").value;

    const student = students.find(function(student) {
        return student.id.toLowerCase() === studentId.toLowerCase();
    });

    if (!student) {
        attendanceMessage.textContent = "Student ID not found. Register the student first.";
        attendanceMessage.style.color = "red";
        return;
    }

    const today = new Date().toLocaleDateString();

    attendanceRecords.push({
        studentId: student.id,
        name: student.name,
        date: today,
        status: status
    });

    localStorage.setItem(
        "attendanceRecords",
        JSON.stringify(attendanceRecords)
    );

    attendanceMessage.textContent =
        "Attendance marked: " + student.name + " — " + status;

    attendanceMessage.style.color = "green";
    attendanceForm.reset();
});

let marksRecords = JSON.parse(localStorage.getItem("marksRecords")) || [];

const marksForm = document.getElementById("marksForm");
const marksMessage = document.getElementById("marksMessage");

marksForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const studentId = document.getElementById("marksStudentId").value.trim();
    const subjectName = document.getElementById("subject").value.trim();
    const mark = Number(document.getElementById("marks").value);

    const student = students.find(function(student) {
        return student.id.toLowerCase() === studentId.toLowerCase();
    });

    if (!student) {
        marksMessage.textContent = "Student ID not found. Register the student first.";
        marksMessage.style.color = "red";
        return;
    }

    if (mark < 0 || mark > 100) {
        marksMessage.textContent = "Marks must be between 0 and 100.";
        marksMessage.style.color = "red";
        return;
    }

    marksRecords.push({
        studentId: student.id,
        name: student.name,
        subject: subjectName,
        marks: mark
    });

    localStorage.setItem("marksRecords", JSON.stringify(marksRecords));

    marksMessage.textContent =
        "Marks saved for " + student.name + ": " + subjectName + " — " + mark + "/100";

    marksMessage.style.color = "green";
    marksForm.reset();
});

let feesRecords = JSON.parse(localStorage.getItem("feesRecords")) || [];

const feesForm = document.getElementById("feesForm");
const feesMessage = document.getElementById("feesMessage");

feesForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const studentId = document.getElementById("feesStudentId").value.trim();
    const amount = Number(document.getElementById("feeAmount").value);
    const status = document.getElementById("feeStatus").value;

    const student = students.find(function(student) {
        return student.id.toLowerCase() === studentId.toLowerCase();
    });

    if (!student) {
        feesMessage.textContent = "Student ID not found. Register the student first.";
        feesMessage.style.color = "red";
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        feesMessage.textContent = "Enter a valid fee amount greater than zero.";
        feesMessage.style.color = "red";
        return;
    }

    feesRecords.push({
        studentId: student.id,
        name: student.name,
        amount: amount,
        status: status
    });

    localStorage.setItem("feesRecords", JSON.stringify(feesRecords));

    feesMessage.textContent =
        "Fee record saved for " + student.name +
        ": ₹" + amount.toFixed(2) + " — " + status;

    feesMessage.style.color = "green";
    feesForm.reset();
});

const generateReportButton = document.getElementById("generateReport");
const reportOutput = document.getElementById("reportOutput");

generateReportButton.addEventListener("click", function() {
    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
        alert("Please allow pop-ups to generate the report.");
        return;
    }

    const report = document.createElement("div");
    const heading = document.createElement("h1");
    heading.textContent = "Student Management Report";
    report.appendChild(heading);

    const summary = document.createElement("p");
    summary.textContent =
        "Total Registered Students: " + students.length;
    report.appendChild(summary);

    function addSection(title, records, fields) {
        const sectionHeading = document.createElement("h2");
        sectionHeading.textContent = title;
        report.appendChild(sectionHeading);

        const table = document.createElement("table");
        table.border = "1";
        table.cellPadding = "8";

        const header = document.createElement("tr");
        fields.forEach(function(field) {
            const th = document.createElement("th");
            th.textContent = field.label;
            header.appendChild(th);
        });
        table.appendChild(header);

        records.forEach(function(record) {
            const row = document.createElement("tr");
            fields.forEach(function(field) {
                const td = document.createElement("td");
                td.textContent = record[field.key] ?? "";
                row.appendChild(td);
            });
            table.appendChild(row);
        });

        report.appendChild(table);
    }

    addSection("Students", students, [
        { key: "name", label: "Name" },
        { key: "id", label: "Student ID" },
        { key: "course", label: "Course" }
    ]);

    addSection("Attendance", attendanceRecords, [
        { key: "name", label: "Name" },
        { key: "studentId", label: "Student ID" },
        { key: "date", label: "Date" },
        { key: "status", label: "Status" }
    ]);

    addSection("Marks", marksRecords, [
        { key: "name", label: "Name" },
        { key: "studentId", label: "Student ID" },
        { key: "subject", label: "Subject" },
        { key: "marks", label: "Marks" }
    ]);

    addSection("Fees", feesRecords, [
        { key: "name", label: "Name" },
        { key: "studentId", label: "Student ID" },
        { key: "amount", label: "Fee Amount" },
        { key: "status", label: "Payment Status" }
    ]);

    reportWindow.document.body.appendChild(report);
    reportWindow.document.title = "Student Management Report";
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
});
