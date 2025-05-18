let editingSubscription = null;

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    if (params.has("edit")) {
        const sub = params.get("edit");
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(u => u.subscription === sub);
        if (user) {
            document.getElementById("name").value = user.name;
            document.getElementById("address").value = user.address;
            document.getElementById("date").value = user.date;
            document.getElementById("problem").value = user.problem || "";
            document.getElementById("subscription").value = user.subscription;
            document.getElementById("meter").value = user.meter;
            document.getElementById("meterType").value = user.meterType;
            document.getElementById("meterBrand").value = user.meterBrand;
            document.getElementById("visits").value = user.visits;
            editingSubscription = sub;
            document.querySelector("h1").textContent = "تعديل بيانات المشترك";
        }
    }
};

function saveUser() {
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const date = document.getElementById("date").value;
    const problem = document.getElementById("problem").value.trim();
    const subscription = document.getElementById("subscription").value.trim();
    const meter = document.getElementById("meter").value.trim();
    const meterType = document.getElementById("meterType").value;
    const visits = parseInt(document.getElementById("visits").value);
    const meterBrand = document.getElementById("meterBrand").value;

    if (!name || !address || !date || !subscription || !meter || !meterType || !meterBrand) {
        alert("يرجى تعبئة جميع الحقول المطلوبة.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    if (editingSubscription !== null) {
        const index = users.findIndex(u => u.subscription === editingSubscription);
        if (index !== -1) {
            users[index] = { name, address, date, problem, subscription, meter, meterType, visits, meterBrand };
            editingSubscription = null;
            document.querySelector("h1").textContent = "نموذج إدخال بيانات المشترك";
        }
    } else {
        const existingIndex = users.findIndex(u => u.subscription === subscription);
        if (existingIndex !== -1) {
            users[existingIndex] = { name, address, date, problem, subscription, meter, meterType, visits, meterBrand };
        } else {
            users.push({ name, address, date, problem, subscription, meter, meterType, visits, meterBrand });
        }
    }

    localStorage.setItem("users", JSON.stringify(users));
    alert("✅ تم حفظ بيانات المشترك بنجاح.");
    document.getElementById("userForm").reset();
    document.getElementById("results").innerHTML = "";
}

function editUser() {
    const sub = prompt("أدخل رقم الاشتراك للتعديل:");
    if (!sub) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.subscription === sub);
    if (!user) {
        alert("❌ لا يوجد مشترك بهذا الرقم.");
        return;
    }

    window.location.href = window.location.pathname + "?edit=" + encodeURIComponent(sub);
}

function deleteUser() {
    const sub = prompt("أدخل رقم الاشتراك للحذف:");
    if (!sub) return;

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    const index = users.findIndex(u => u.subscription === sub);
    if (index === -1) {
        alert("❌ لا يوجد مشترك بهذا الرقم.");
        return;
    }

    if (confirm("⚠️ هل أنت متأكد أنك تريد حذف هذا المشترك؟")) {
        users.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(users));
        alert("🗑️ تم حذف المشترك بنجاح.");
    }
}

function searchData() {
    const sub = prompt("أدخل رقم الاشتراك للبحث:");
    if (!sub) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.subscription === sub);
    if (!user) {
        alert("❌ لا يوجد مشترك بهذا الرقم.");
        return;
    }

    const resultDiv = document.getElementById("results");
    resultDiv.innerHTML = `
        <h3>بيانات المشترك:</h3>
        <ul>
            <li><strong>الاسم:</strong> ${user.name}</li>
            <li><strong>العنوان:</strong> ${user.address}</li>
            <li><strong>التاريخ:</strong> ${user.date}</li>
            <li><strong>المشكلة:</strong> ${user.problem}</li>
            <li><strong>رقم الاشتراك:</strong> ${user.subscription}</li>
            <li><strong>رقم العداد:</strong> ${user.meter}</li>
            <li><strong>عدد الأوجه:</strong> ${user.meterType}</li>
            <li><strong>ماركة العداد:</strong> ${user.meterBrand}</li>
            <li><strong>عدد الزيارات:</strong> ${user.visits}</li>
        </ul>
    `;
}

function showAllUsers() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const resultDiv = document.getElementById("results");
    if (users.length === 0) {
        resultDiv.innerHTML = "<p>لا يوجد مشتركين مسجلين.</p>";
        return;
    }

    let html = "<h3>جميع المشتركين:</h3><table border='1'><tr><th>الاسم</th><th>رقم الاشتراك</th><th>العنوان</th><th>التاريخ</th><th>المشكلة</th><th>رقم العداد</th><th>عدد الأوجه</th><th>ماركة العداد</th><th>عدد الزيارات</th></tr>";
    users.forEach(user => {
        html += `<tr>
            <td>${user.name}</td>
            <td>${user.subscription}</td>
            <td>${user.address}</td>
            <td>${user.date}</td>
            <td>${user.problem}</td>
            <td>${user.meter}</td>
            <td>${user.meterType}</td>
            <td>${user.meterBrand}</td>
            <td>${user.visits}</td>
        </tr>`;
    });
    html += "</table>";
    resultDiv.innerHTML = html;
}

function printBySubscription() {
    const sub = prompt("أدخل رقم الاشتراك للطباعة:");
    if (!sub) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.subscription === sub);
    if (!user) {
        alert("❌ لا يوجد مشترك بهذا الرقم.");
        return;
    }

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write("<html><head><title>طباعة بيانات المشترك</title></head><body>");
    printWindow.document.write(`<h2>بيانات المشترك رقم ${user.subscription}</h2>`);
    printWindow.document.write("<ul>");
    printWindow.document.write(`<li><strong>الاسم:</strong> ${user.name}</li>`);
    printWindow.document.write(`<li><strong>العنوان:</strong> ${user.address}</li>`);
    printWindow.document.write(`<li><strong>التاريخ:</strong> ${user.date}</li>`);
    printWindow.document.write(`<li><strong>المشكلة:</strong> ${user.problem}</li>`);
    printWindow.document.write(`<li><strong>رقم العداد:</strong> ${user.meter}</li>`);
    printWindow.document.write(`<li><strong>عدد الأوجه:</strong> ${user.meterType}</li>`);
    printWindow.document.write(`<li><strong>ماركة العداد:</strong> ${user.meterBrand}</li>`);
    printWindow.document.write(`<li><strong>عدد الزيارات:</strong> ${user.visits}</li>`);
    printWindow.document.write("</ul>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
}

function exportUsers() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.length === 0) {
        alert("لا يوجد بيانات لتصديرها.");
        return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "users_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function downloadUsers() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedUsers = JSON.parse(e.target.result);
                if (!Array.isArray(importedUsers)) throw new Error("Invalid data");

                const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
                const mergedUsers = [...existingUsers];

                importedUsers.forEach(importedUser => {
                    const existingIndex = mergedUsers.findIndex(
                        u => u.subscription === importedUser.subscription
                    );
                    if (existingIndex === -1) {
                        mergedUsers.push(importedUser);
                    } else {
                        // تحديث البيانات الحالية
                        mergedUsers[existingIndex] = importedUser;
                    }
                });

                localStorage.setItem("users", JSON.stringify(mergedUsers));
                alert("✅ تم تحميل البيانات بنجاح.");
            } catch (error) {
                alert("❌ حدث خطأ أثناء قراءة الملف: " + error.message);
            }
        };

        reader.readAsText(file);
    };

    input.click();
}
function printBySubscription() {
    const subscription = prompt("📌 أدخل رقم الاشتراك للطباعة:");
    if (!subscription) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.subscription === subscription);
    if (!user) {
        alert("❌ لم يتم العثور على مشترك بهذا الرقم.");
        return;
    }

    // إنشاء نافذة جديدة للطباعة
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html lang="ar" dir="rtl">
        <head>
            <title>طباعة بيانات المشترك</title>
            <style>
                body { font-family: Arial, sans-serif; direction: rtl; padding: 20px; }
                h2 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                td { padding: 8px; border: 1px solid #000; }
            </style>
        </head>
        <body>
            <h2>بيانات المشترك</h2>
            <table>
                <tr><td><strong>الاسم:</strong></td><td>${user.name}</td></tr>
                <tr><td><strong>العنوان:</strong></td><td>${user.address}</td></tr>
                <tr><td><strong>التاريخ:</strong></td><td>${user.date}</td></tr>
                <tr><td><strong>المشكلة:</strong></td><td>${user.problem}</td></tr>
                <tr><td><strong>رقم الاشتراك:</strong></td><td>${user.subscription}</td></tr>
                <tr><td><strong>رقم العداد:</strong></td><td>${user.meter}</td></tr>
                <tr><td><strong>عدد الأوجه:</strong></td><td>${user.meterType}</td></tr>
                <tr><td><strong>ماركة العداد:</strong></td><td>${user.meterBrand}</td></tr>
                <tr><td><strong>عدد الزيارات:</strong></td><td>${user.visits}</td></tr>
            </table>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}