"use strict";
// Deduplicate (إزالة التكرار)
// الهدف: التأكد من أن الطلبية لم تُستقبل مسبقًا أو مشابهة لطلب آخر.
// مثال: نفس العميل طلب نفس المنتج مرتين عن طريق الخطأ → دمج الطلبات لتجنب شحن مزدوج.
// duplicated order items -> cause extra cost
// [
//   { name: "Burger", qty: 1 },
//   { name: "Burger", qty: 2 },
// ];
// ||
// [
//  { "name": "Burger", "qty": 3 }
// ]
