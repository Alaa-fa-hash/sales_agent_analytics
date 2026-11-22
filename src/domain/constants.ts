export const REQUIRED_FIELDS = ["date", "invoiceNo", "materialCode", "quantity"] as const;

export const FIELD_ALIASES: Record<string, string[]> = {
  date: ["تاريخ", "التاريخ", "تاريخ الفاتوره", "date", "تاريخ العمليه"],
  invoiceNo: ["رقم الفاتوره", "الفاتوره", "الفاتورة", "فاتوره", "رقم الفاتورة/الحركة", "invoice", "bill"],
  customerName: ["اسم الزبون", "الزبون", "العميل", "اسم العميل", "customer", "customer name", "client", "اسم المتجر", "المركز"],
  materialCode: ["رمز الماده", "رمز المادة", "كود الماده", "كود المادة", "رمز الصنف", "كود الصنف", "material code", "code", "sku"],
  materialName: ["اسم الماده", "اسم المادة", "الماده", "المادة", "اسم الصنف", "الصنف", "material name", "product"],
  quantity: ["الكميه", "الكمية", "كميه", "qty", "quantity"],
  unit: ["الوحده", "الوحدة", "وحده", "unit"],
  unitPrice: ["السعر", "سعر الوحده", "سعر الوحدة", "unit price", "price"],
  totalValue: ["القيمه", "القيمة", "القيمه الاجماليه", "القيمة الإجمالية", "الاجمالي", "الإجمالي", "total", "value"],
  agentName: ["المندوب", "اسم المندوب", "agent", "salesman", "مركز الكلفه", "مركز الكلفة", "cost center"],
  regionName: ["المنطقه", "المنطقة", "اسم المنطقه", "اسم المنطقة", "المنطقه الافتراضي", "المنطقة (الافتراضي)", "region", "area"],
};

export const FIELD_LABELS: Record<string, string> = {
  date: "التاريخ",
  invoiceNo: "الفاتورة",
  customerName: "اسم الزبون",
  materialCode: "رمز المادة",
  materialName: "اسم المادة",
  quantity: "الكمية",
  unit: "الوحدة",
  unitPrice: "السعر",
  totalValue: "القيمة",
  agentName: "المندوب / مركز الكلفة",
  regionName: "المنطقة",
};
