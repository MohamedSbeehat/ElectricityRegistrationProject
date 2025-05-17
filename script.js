// index.html: حفظ بيانات المشترك
function saveUser() {
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const date = document.getElementById("date").value;
    const problem = document.getElementById("problem").value.trim();
    const subscription = document.getElementById("subscription").value.trim();
    const meter = document.getElementById("meter").value.trim();
    const meterType = document.getElementById("meterType").value;
    const visits = parseInt(document.getElementById("visits").value);

    if (!name || !address || !date || !subscription || !meter || !meterType) {
        alert("يرجى تعبئة جميع الحقول المطلوبة.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    // إذا كان موجود مسبقاً، حدث البيانات
    const existingIndex = users.findIndex(u => u.subscription === subscription);
    if (existingIndex !== -1) {
        users[existingIndex] = { name, address, date, problem, subscription, meter, meterType, visits };
    } else {
        users.push({ name, address, date, problem, subscription, meter, meterType, visits });
    }

    localStorage.setItem("users", JSON.stringify(users));
    alert("✅ تم حفظ بيانات المشترك بنجاح.");
    document.getElementById("userForm").reset();
    document.getElementById("results").innerHTML = "";
}

// عرض بيانات المشترك والحسابات داخل الصفحة (index.html)
function searchData() {
    const sub = prompt("أدخل الاسم أو رقم الاشتراك أو رقم العداد:");
    if (!sub) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.name === sub || u.subscription === sub || u.meter === sub);
    if (!user) {
        alert("❌ لا يوجد نتائج");
        return;
    }

    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]")
        .filter(a => a.subscription === user.subscription);

    let totalAmount = accounts.reduce((acc, cur) => acc + cur.amount, 0);

    let html = `<h2>بيانات المشترك:</h2><table>
        <tr><th>العنصر</th><th>القيمة</th></tr>
        <tr><td>الاسم</td><td>${user.name}</td></tr>
        <tr><td>العنوان</td><td>${user.address}</td></tr>
        <tr><td>التاريخ</td><td>${user.date}</td></tr>
        <tr><td>المشكلة</td><td>${user.problem || "-"}</td></tr>
        <tr><td>رقم الاشتراك</td><td>${user.subscription}</td></tr>
        <tr><td>رقم العداد</td><td>${user.meter}</td></tr>
        <tr><td>نوع العداد</td><td>${user.meterType}</td></tr>
        <tr><td>عدد الزيارات</td><td>${user.visits}</td></tr>
    </table>`;

    html += `<h3>الحسابات المالية (المجموع: ${totalAmount.toFixed(2)} ₪):</h3><table>
        <tr><th>المبلغ (₪)</th><th>التاريخ</th></tr>`;
    accounts.forEach(a => {
        html += `<tr><td>${a.amount.toFixed(2)}</td><td>${a.date || "-"}</td></tr>`;
    });
    html += `</table>`;

    document.getElementById("results").innerHTML = html;
}

// طباعة بيانات المشترك والحسابات
function printBySubscription() {
    const sub = prompt("أدخل رقم الاشتراك للطباعة:");
    if (!sub) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.subscription === sub);
    if (!user) {
        alert("❌ لا يوجد مشترك بهذا الرقم");
        return;
    }

    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]")
        .filter(a => a.subscription === user.subscription);
    const totalAmount = accounts.reduce((acc, cur) => acc + cur.amount, 0);

    const now = new Date().toLocaleString();

    let printContent = `
    <html lang="ar" dir="rtl"><head><title>طباعة بيانات المشترك</title>
    <style>
        body {font-family: Tahoma, sans-serif; direction: rtl; padding: 20px; color: #333;}
        table {width: 100%; border-collapse: collapse; margin-bottom: 20px;}
        th, td {border: 1px solid #333; padding: 10px; text-align: center;}
        th {background: #007ea7; color: #fff;}
        h2, h3 {color: #007ea7;}
    </style>
    </head><body>
    <h2>بيانات المشترك</h2>
    <table>
        <tr><th>العنصر</th><th>القيمة</th></tr>
        <tr><td>الاسم</td><td>${user.name}</td></tr>
        <tr><td>العنوان</td><td>${user.address}</td></tr>
        <tr><td>التاريخ</td><td>${user.date}</td></tr>
        <tr><td>المشكلة</td><td>${user.problem || '-'}</td></tr>
        <tr><td>رقم الاشتراك</td><td>${user.subscription}</td></tr>
        <tr><td>رقم العداد</td><td>${user.meter}</td></tr>
        <tr><td>نوع العداد</td><td>${user.meterType}</td></tr>
        <tr><td>عدد الزيارات</td><td>${user.visits}</td></tr>
    </table>
    <h3>الحسابات المالية</h3>
    <table>
        <tr><th>المبلغ (₪)</th><th>التاريخ</th></tr>`;

    accounts.forEach(a => {
        printContent += `<tr><td>${a.amount.toFixed(2)}</td><td>${a.date || '-'}</td></tr>`;
    });

    printContent += `<tr><th>المجموع</th><th>${totalAmount.toFixed(2)} ₪</th></tr>`;
    printContent += `</table><p>تاريخ الطباعة: ${now}</p></body></html>`;

    const newWin = window.open("");
    newWin.document.write(printContent);
    newWin.document.close();
    newWin.focus();
    newWin.print();
    newWin.close();
}

// accounts.html: إضافة حساب مالي
function addAccount() {
    const subscription = document.getElementById("subscriptionAcc").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("dateAcc").value;

    if (!subscription || isNaN(amount)) {
        alert("يرجى إدخال رقم الاشتراك والمبلغ بشكل صحيح.");
        return;
    }

    let accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    accounts.push({ subscription, amount, date });
    localStorage.setItem("accounts", JSON.stringify(accounts));
    alert("✅ تم إضافة الحساب بنجاح.");
    document.getElementById("accountForm").reset();
    document.getElementById("accountsResults").innerHTML = "";
}

// عرض جميع الحسابات مع أسماء المشتركين
function showAllAccounts() {
    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (accounts.length === 0) {
        document.getElementById("accountsResults").innerHTML = "<p>لا توجد حسابات حالياً.</p>";
        return;
    }

    let html = `<h2>جميع الحسابات</h2>
    <table>
    <tr><th>الاسم</th><th>رقم الاشتراك</th><th>المبلغ (₪)</th><th>التاريخ</th></tr>`;

    accounts.forEach(acc => {
        const user = users.find(u => u.subscription === acc.subscription);
        const name = user ? user.name : "غير معروف";
        html += `<tr><td>${name}</td><td>${acc.subscription}</td><td>${acc.amount.toFixed(2)}</td><td>${acc.date || '-'}</td></tr>`;
    });

    html += `</table>`;
    document.getElementById("accountsResults").innerHTML = html;
}

// البحث عن حسابات برقم الاشتراك فقط
function searchAccounts() {
    const subscription = document.getElementById("subscriptionAcc").value.trim();
    if (!subscription) {
        alert("يرجى إدخال رقم الاشتراك للبحث.");
        return;
    }

    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]")
        .filter(a => a.subscription === subscription);
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.subscription === subscription);

    if (!user) {
        alert("❌ لا يوجد مشترك بهذا الرقم");
        return;
    }
    if (accounts.length === 0) {
        document.getElementById("accountsResults").innerHTML = "<p>لا توجد حسابات لهذا المشترك.</p>";
        return;
    }

    const totalAmount = accounts.reduce((acc, cur) => acc + cur.amount, 0);

    let html = `<h2>حسابات المشترك: ${user.name}</h2>
    <table>
    <tr><th>المبلغ (₪)</th><th>التاريخ</th></tr>`;

    accounts.forEach(a => {
        html += `<tr><td>${a.amount.toFixed(2)}</td><td>${a.date || '-'}</td></tr>`;
    });
    html += `<tr><th>المجموع</th><th>${totalAmount.toFixed(2)} ₪</th></tr></table>`;

    document.getElementById("accountsResults").innerHTML = html;
}

// حذف جميع الحسابات (اختياري)
function clearAccounts() {
    if (confirm("هل أنت متأكد من حذف جميع الحسابات؟")) {
        localStorage.removeItem("accounts");
        document.getElementById("accountsResults").innerHTML = "";
        alert("✅ تم حذف جميع الحسابات.");
    }
}

// تصدير بيانات المستخدمين إلى ملف JSON (نسخة محفوظة)
function exportUsers() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.length === 0) {
        alert("لا توجد بيانات للتصدير.");
        return;
    }
    const dataStr = JSON.stringify(users, null, 4);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "users_export.json";
    a.click();
    URL.revokeObjectURL(url);
}

// تحميل ملف JSON واستخدامه لاستيراد بيانات المستخدمين
function downloadUsers() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const importedUsers = JSON.parse(event.target.result);
                if (!Array.isArray(importedUsers)) throw new Error("تنسيق غير صالح.");

                localStorage.setItem("users", JSON.stringify(importedUsers));
                alert("✅ تم تحميل البيانات بنجاح.");
                document.getElementById("results").innerHTML = "";
            } catch (error) {
                alert("❌ حدث خطأ أثناء تحميل البيانات: " + error.message);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}
