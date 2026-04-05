# 📚 Student Management System

نظام ويب سحابي لإدارة الطلاب - مشروع عملي متكامل

## 🌐 رابط التطبيق

[https://student-system-7eee.onrender.com](https://student-system-7eee.onrender.com)

---

## 🎯 عن المشروع

هذا المشروع هو نظام ويب سحابي متكامل يسمح بإدارة الطلاب (إضافة، عرض، حذف). تم تطويره كجزء من متطلبات مشروع الحوسبة السحابية.

---

## ✨ الميزات

- ✅ إضافة طالب جديد
- ✅ عرض قائمة جميع الطلاب
- ✅ حذف جميع الطلاب
- ✅ واجهة مستخدم بسيطة وسهلة
- ✅ API endpoint للوصول للبيانات بصيغة JSON
- ✅ نظام مراقبة Metrics مدمج
- ✅ Auto Scaling تلقائي

---

## 🛠️ التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| Node.js | تشغيل التطبيق |
| Express.js | إطار العمل الخلفي |
| Render | منصة النشر السحابية |
| GitHub | التحكم بالإصدارات |
| JSON | تخزين البيانات |

---

## ☁️ متطلبات الحوسبة السحابية

| المتطلب | طريقة التنفيذ |
|----------|---------------|
| IaaS (خوادم) | Render Web Services |
| تخزين | JSON + (مخطط لإضافة S3) |
| نشر تطبيق | Continuous Deployment من GitHub |
| Auto Scaling | مدمج في Render |
| Metrics | Render Dashboard |
| SLA | وثيقة منفصلة |
| Deployment Model | وثيقة منفصلة |
| Security Risks | وثيقة منفصلة |

---

## 🚀 تشغيل المشروع محلياً

### 1. استنساخ المشروع
```bash
git clone https://github.com/sajatolan/student-system.git
cd student-system
2. تثبيت المتطلبات
bash
npm install
3. تشغيل التطبيق
bash
npm start
4. فتح المتصفح
text
http://localhost:3000
📁 هيكل المشروع
text
student-system/
│
├── index.js              # الملف الرئيسي للتطبيق
├── package.json          # المتطلبات والأوامر
│
├── models/
│   └── Student.js        # نموذج بيانات الطالب
│
├── routes/
│   └── students.js       # مسارات API
│
├── students.json         # ملف تخزين البيانات (يتلقائياً)
│
└── docs/
    ├── SLA.md            # اتفاقية مستوى الخدمة
    ├── deployment-model.md  # نموذج النشر
    └── security-risks.md    # تحليل المخاطر الأمنية
📊 API Endpoints
المسار	الطريقة	الوصف
/students	GET	عرض واجهة المستخدم
/students/api	GET	الحصول على JSON للطلاب
/students/add	POST	إضافة طالب جديد
/students/clear	POST	حذف جميع الطلاب
/health	GET	فحص صحة الخدمة
🔒 الأمان
✅ HTTPS مشغل تلقائياً

⚠️ لا يوجد مصادقة (مخطط لها مستقبلاً)

⚠️ البيانات غير مشفرة

لمزيد من التفاصيل: security-risks.md

📈 الأداء (SLA)
وقت الاستجابة: أقل من 500ms

وقت التشغيل: 99.5%

وقت الاستجابة للمشاكل: 1-24 ساعة حسب الخطورة

لمزيد من التفاصيل: SLA.md

🚢 نموذج النشر
النوع: Continuous Deployment (CI/CD)

المنصة: Render Cloud

الاستراتيجية: Auto-deploy من فرع main

لمزيد من التفاصيل: deployment-model.md

👨‍💻 المؤلف
sajatolan

📅 تاريخ الإنجاز
أبريل 2026

📝 ملاحظات
التطبيق يستخدم تخزين مؤقت (ephemeral storage)

عند إعادة تشغيل الخدمة على Render، يتم فقدان البيانات

يوصى بإضافة قاعدة بيانات MongoDB Atlas لحفظ البيانات بشكل دائم

📄 الترخيص
هذا المشروع لأغراض تعليمية فقط

text

---

## ✅ خطواتك الآن:

1. **افتح VS Code**
2. **أنشئ ملف جديد** باسم `README.md`
3. **الصق المحتوى أعلاه**
4. **احفظ** (`Ctrl + S`)

---

## 🚀 ثم ارفعه إلى GitHub:

```cmd
git add README.md
git commit -m "Add README file"
git push origin main