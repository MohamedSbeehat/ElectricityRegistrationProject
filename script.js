document.getElementById('dataForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const record = {
    name: document.getElementById('name').value.trim(),
    address: document.getElementById('address').value.trim(),
    date: document.getElementById('date').value,
    issue: document.getElementById('issue').value.trim(),
    subscription: document.getElementById('subscription').value.trim(),
    meterNumber: document.getElementById('meterNumber').value.trim(),
    meterType: document.getElementById('meterType').value
  };

  let records = JSON.parse(localStorage.getItem('electricData')) || [];
  records.push(record);
  localStorage.setItem('electricData', JSON.stringify(records));
  alert('✅ تم حفظ البيانات بنجاح');
  this.reset();
});

function searchData() {
  const searchTerm = prompt("أدخل الاسم أو رقم الاشتراك أو رقم العداد للبحث:");
  if (!searchTerm) return;

  const records = JSON.parse(localStorage.getItem('electricData')) || [];
  const found = records.filter(r =>
    r.name.includes(searchTerm) ||
    r.subscription.includes(searchTerm) ||
    r.meterNumber.includes(searchTerm)
  );

  const resultDiv = document.getElementById('result');
  if (found.length === 0) {
    resultDiv.textContent = '❌ لا توجد نتائج مطابقة.';
  } else {
    resultDiv.innerHTML = found.map(r => 
      `👤 الاسم: ${r.name}
🏠 العنوان: ${r.address}
📅 التاريخ: ${r.date}
📝 المشكلة: ${r.issue}
🔢 رقم الاشتراك: ${r.subscription}
⚡ رقم العداد: ${r.meterNumber}
🔌 نوع العداد: ${r.meterType}
----------------------------`
    ).join('\n');
  }
}