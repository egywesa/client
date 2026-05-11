import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ClientLookup {
  id: number | string;
  name: string;
}

interface ContractTemplate {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  available: boolean;
  pages: ContractPage[];
}

interface ContractPage {
  rows: ContractRow[];
}

interface ContractRow {
  en?: string;
  ar?: string;
  full?: string;
  head?: boolean;
  title?: boolean;
}

@Component({
  selector: 'app-contract-templates',
  templateUrl: './contract-templates.component.html',
  styleUrls: ['./contract-templates.component.scss']
})
export class ContractTemplatesComponent implements OnInit {
  private baseUrl = environment.baseUrl;
  isEditorOpen = false;
  isExporting = false;
  isClientsLoading = false;

  clients: ClientLookup[] = [];
  selectedClientId: number | string | null = null;
  selectedTemplateId = 'vat';
  contractDate = this.getTodayDate();

  contractTemplates: ContractTemplate[] = [
    {
      id: 'vat',
      title: 'خطاب تعيين — ضريبة القيمة المضافة',
      subtitle: 'VAT Services Engagement Letter',
      tags: ['VAT', 'ع / EN'],
      available: true,
      pages: [
        {
          rows: [
            {
              title: true,
              en: 'LETTER OF ENGAGEMENT',
              ar: 'خطـاب تعييـن'
            },
            {
              en: 'Subject: Letter of Engagement for VAT Services to {{clientName}} Company for the year ended 31 December {{year}}.',
              ar: 'الموضوع: خطاب تعيين بخصوص خدمات ضريبة القيمة المضافة لشركة {{clientName}} للسنة المنتهية في 31 ديسمبر {{year}}م.'
            },
            {
              en: 'We thank you for choosing "Al Shalahi Chartered Accountants" to perform the professional services of {{clientName}} Company from providing VAT services and we confirm our office’s willingness to work with your company as a consultant on matters related to VAT, and we provide in this letter our perspective of the contract with you.',
              ar: 'نشكركم على اختيار "مكتب الشلاحي محاسبون قانونيون" لأداء الخدمات المهنية لشركة {{clientName}} وذلك من تقديم خدمات ضريبة القيمة المضافة، ونؤكد استعداد مكتبنا العمل مع شركتكم كمستشار في الأمور المتعلقة بضريبة القيمة المضافة، ونورد في هذا الخطاب فهمنا لتعاقدنا معكم.'
            }
          ]
        },
        {
          rows: [
            {
              head: true,
              en: 'Scope of work',
              ar: 'نطاق العمل'
            },
            {
              en: '<b>A - Preparation of VAT return:</b><ol><li>Prepare and provide training courses for the employees of the facility on how to deal with inputs and outputs and everything related to VAT.</li><li>Equipping and adapting the enterprise accounting systems to fit the tax system applicable in Saudi Arabia and its implementing regulations.</li><li>Field visits to see detailed procedures for processing the facility and supervising the pilot application.</li><li>Supervise the processing of accounting records or book collection required for the application of VAT.</li><li>Supervise the design and processing of the necessary tax invoice and its returns.</li><li>Training accountants on the daily restrictions necessary to prove tax processing.</li><li>Training of specialists in disclosures to be printed when preparing a tax return.</li><li>Documentation of all the reported balances and supporting files.</li><li>Systematic audit of inputs and outputs and their revenues and classification into tax return taxable, zero tax, or exempt.</li><li>Submit VAT returns monthly or quarterly in accordance with the provisions of the VAT Regulations.</li></ol>',
              ar: '<b>إعداد إقرار ضريبة القيمة المضافة:</b><ol><li>إعداد وتقديم دورات تدريبية لمنسوبي المنشأة حول كيفية التعامل مع المدخلات والمخرجات وكل ما يتعلق بضريبة القيمة المضافة.</li><li>تجهيز وتهيئة النظم المحاسبية بالمنشأة لتناسب نظام الضريبة المطبق في المملكة العربية السعودية ولائحته التنفيذية.</li><li>عمل زيارات ميدانية للاطلاع على الإجراءات التفصيلية لتجهيز المنشأة والإشراف على التطبيق التجريبي.</li><li>الإشراف على تجهيز السجلات المحاسبية أو المجموعة الدفترية اللازمة لتطبيق ضريبة القيمة المضافة.</li><li>الإشراف على تصميم وتجهيز الفاتورة الضريبية اللازمة ومردوداتها.</li><li>تدريب المحاسبين على القيود اليومية اللازمة لإثبات المعالجة الضريبية.</li><li>تدريب المختصين على الكشوفات الواجب طباعتها عند إعداد الإقرار الضريبي.</li><li>توثيق كل ما ذكر بالإقرار من أرصدة ومستندات وملفات مؤيدة.</li><li>مراجعة الحسابات النظامية من المدخلات والمخرجات ومردوداتها وتصنيفها.</li><li>تقديم إقرارات ضريبة القيمة المضافة شهرياً أو ربع سنوياً طبقاً للائحة التنفيذية.</li></ol>'
            }
          ]
        },
        {
          rows: [
            {
              head: true,
              en: 'B - Follow-up to the evaluation process',
              ar: 'متابعة عملية التقييم'
            },
            {
              en: '<ul><li>Study questions received from the Authority.</li><li>Report the company on the nature of the inquiries and agree on a plan of action to respond.</li><li>Prepare the reply letter to Authority inquiries and take the company approval.</li><li>Checking supporting documents as appropriate to the nature of queries.</li><li>Provide a response to the Authority inquiries within the prescribed period or request an extension if needed.</li><li>Follow-up with the Authority when there is an examination for one or more financial years.</li></ul>',
              ar: '<ul><li>دراسة الاستفسارات الواردة من الهيئة.</li><li>إفادة الشركة عن طبيعة الاستفسارات والاتفاق على خطة عمل للرد عليها.</li><li>إعداد خطاب الرد على استفسارات الهيئة وأخذ موافقة الشركة عليه.</li><li>تدقيق المستندات المؤيدة من حيث ملائمتها لطبيعة الاستفسارات.</li><li>تقديم الرد على الاستفسارات للهيئة خلال المدة الزمنية المحددة أو طلب تمديد للمدة عند الحاجة.</li><li>المتابعة مع الهيئة عند وجود فحص عن سنة مالية أو أكثر.</li></ul>'
            }
          ]
        },
        {
          rows: [
            {
              head: true,
              en: 'C - Follow-up of the linkage process',
              ar: 'ج – متابعة عملية الربط'
            },
            {
              en: '<ul><li>Study the objection clauses and present our views.</li><li>Meeting with the company to determine objection items and strategy.</li><li>Prepare a memorandum clarifying the company view on differences arising from the evaluation process.</li><li>Meeting with the Authority if possible to clarify the company view.</li><li>Follow-up with the Authority in an attempt to reach an acceptable settlement.</li></ul>',
              ar: '<ul><li>دراسة بنود الاعتراض وتقديم مرئياتنا حولها.</li><li>الاجتماع مع الشركة لتحديد بنود الاعتراض واستراتيجية تقديمها للهيئة.</li><li>إعداد مذكرة نوضح من خلالها وجهة نظر الشركة حول الفروقات الناتجة عن عملية التقييم.</li><li>الاجتماع مع الهيئة إذا أمكن لتوضيح وجهة نظر الشركة.</li><li>المتابعة مع الهيئة في محاولة للوصول إلى تسوية مقبولة.</li></ul>'
            }
          ]
        },
        {
          rows: [
            {
              head: true,
              en: 'Fees',
              ar: 'الأتعاب'
            },
            {
              en: 'The estimates of our fees for the provision of the services described above are as follows: SAR <span class="f" contenteditable="true">………</span> per annum. In accordance with our policy, an advance payment of 50% will be requested upon signing the contract and 50% upon submission.',
              ar: 'نورد أدناه تقديرات أتعابنا عن تقديم الخدمات المبينة أعلاه كما يلي: <span class="f" contenteditable="true">………………</span> ريال سعودي سنوياً. وطبقاً للسياسة المتبعة لدينا، سيتم طلب دفعة مقدمة بواقع 50% عند توقيع العقد و50% عند التقديم.'
            }
          ]
        },
        {
          rows: [
            {
              head: true,
              en: 'Approval of the contract letter',
              ar: 'الموافقة على خطاب التعاقد'
            },
            {
              en: 'We appreciate the opportunity you gave us to provide our services to the company. If this agreement reflects the terms and conditions under which the Company agreed to our appointment, we hope to kindly sign below on behalf of the Company and return it to us.<br><br>By <b>Al-Shalahi Chartered Accountants</b><br><br><b>Khaled bin Al-Hamidi Al-Shalahi</b><br>Chartered Accountant<br>Register of Chartered Accountants (538)<br><br>We agree to the above terms:<br><br>On behalf of {{clientName}}<br><br>Signature: ___________________________<br>Name: ___________________________<br>Stamp: ___________________________',
              ar: 'نقدر الفرصة التي أعطيتمونا لتقديم خدماتنا للشركة. إذا كانت هذه الاتفاقية تعكس الشروط والأحكام التي وافقت بموجبها الشركة على تعييننا، فنأمل التكرم بالتوقيع أدناه نيابة عن الشركة على هذه النسخة من الخطاب وإعادتها إلينا.<br><br>عن <b>مكتب الشلاحي محاسبون قانونيون</b><br><br><b>خالد بن الحميدي الشلاحي</b><br>محاسب قانوني<br>قيد سجل المحاسبين القانونيين (538)<br><br>نوافق على الشروط أعلاه:<br><br>نيابةً عن {{clientName}}<br><br>التوقيع: ___________________________<br>الاسم: ___________________________<br>الختم: ___________________________'
            }
          ]
        }
      ]
    },

    {
      id: 'zakat',
      title: 'خطاب تعيين — إقرار زكوي',
      subtitle: 'Zakat Services Engagement Letter',
      tags: ['ZAKAT', 'ع / EN'],
      available: true,
      pages: [
        {
          rows: [
            {
              title: true,
              en: 'LETTER OF ENGAGEMENT',
              ar: 'خطـاب تعييـن'
            },
            {
              en: 'Subject: Letter of Engagement regarding Zakat Services for {{clientName}} for the financial year ended 31 December {{year}}.',
              ar: 'الموضوع: خطاب تعيين بخصوص خدمات زكوية لشركة {{clientName}} للسنة المالية المنتهية في 31 ديسمبر {{year}}م.'
            },
            {
              en: 'We thank you for choosing "Al Shalahi Chartered Accountants" to perform the professional services regarding Zakat services and we confirm our office’s willingness to work with your company as a consultant on matters related to Zakat.',
              ar: 'نشكركم على اختيار "مكتب الشلاحي محاسبون قانونيون" لأداء الخدمات المهنية الخاصة بالخدمات الزكوية، ونؤكد استعداد مكتبنا للعمل مع شركتكم كمستشار في الأمور المتعلقة بالزكاة.'
            }
          ]
        },
        {
          rows: [
            {
              head: true,
              en: 'Scope of work',
              ar: 'نطاق العمل'
            },
            {
              en: '<b>Zakat Declaration:</b><ol><li>Review the Zakat allotment calculated by the company.</li><li>Coordinate with the Accounting and Finance Department on the preparation of Zakat declaration.</li><li>Prepare and review the Zakat Declaration and supporting schedules.</li><li>Submit the Zakat declaration on your behalf after approval and payment of due amounts.</li><li>Routine follow-up to obtain Zakat certificates.</li></ol>',
              ar: '<b>إقرار زكوي:</b><ol><li>مراجعة مخصص الإقرار الزكوي المحتسب من قبل الشركة.</li><li>التنسيق مع إدارة المحاسبة والمالية بالشركة بشأن إعداد إقرار الزكاة.</li><li>إعداد ومراجعة إقرار الزكاة والجداول التفصيلية المؤيدة للإقرار.</li><li>تقديم إقرار الزكاة نيابة عنكم بعد الحصول على موافقة الشركة وسداد المستحق بموجبه.</li><li>المتابعة الروتينية للحصول على الشهادات الزكوية.</li></ol>'
            }
          ]
        },
        {
          rows: [
            {
              head: true,
              en: 'Fees',
              ar: 'الأتعاب'
            },
            {
              en: 'Our fees for the above services are estimated as shown in the table below. An advance payment of 50% will be requested at the time of signing and 50% upon completion of submission.',
              ar: 'تقدر أتعابنا لقاء الخدمات المشار إليها أعلاه كما هو مبين، وسيتم طلب دفعة مقدمة بواقع 50% من الأتعاب عند توقيع خطاب التعيين و50% عند اكتمال تقديم الإقرارات.'
            }
          ]
        },
        {
          rows: [
            {
              head: true,
              en: 'Approval of the Engagement letter',
              ar: 'الموافقة على خطاب التعاقد'
            },
            {
              en: 'We appreciate the opportunity you gave us to provide our services to the company. Please sign below on behalf of the Company and return it to us.<br><br>Signature: ___________________________<br>Name: ___________________________<br>Stamp: ___________________________',
              ar: 'نقدر الفرصة التي أعطيتمونا لتقديم خدماتنا للشركة. نأمل التكرم بالتوقيع أدناه نيابة عن الشركة وإعادة الخطاب إلينا.<br><br>التوقيع: ___________________________<br>الاسم: ___________________________<br>الختم: ___________________________'
            }
          ]
        }
      ]
    },

    {
      id: 'income-tax',
      title: 'خطاب تعيين — ضريبة الدخل',
      subtitle: 'Income Tax Engagement Letter',
      tags: ['INCOME TAX', 'ع / EN'],
      available: true,
      pages: [
        {
          rows: [
            {
              title: true,
              en: 'LETTER OF ENGAGEMENT',
              ar: 'خطـاب تعييـن'
            },
            {
              en: 'Subject: Letter of Engagement regarding Income Tax Services for {{clientName}} for the financial year ended {{year}}.',
              ar: 'الموضوع: خطاب تعيين بخصوص خدمات ضريبة الدخل لشركة {{clientName}} للسنة المالية المنتهية في {{year}}.'
            },
            {
              en: 'We thank you for choosing "Al Shalahi Chartered Accountants" to perform the professional services regarding income tax services and we confirm our office’s willingness to work with your company as a consultant on matters related to Income Tax.',
              ar: 'نشكركم على اختيار "مكتب الشلاحي محاسبون قانونيون" لأداء الخدمات المهنية الخاصة بضريبة الدخل، ونؤكد استعداد مكتبنا للعمل مع شركتكم كمستشار في الأمور المتعلقة بضريبة الدخل.'
            }
          ]
        },
        {
          rows: [
            {
              head: true,
              en: 'Scope of work',
              ar: 'نطاق العمل'
            },
            {
              en: '<b>Income Tax Declaration:</b><ol><li>Review the income tax allotment calculated by the company.</li><li>Coordinate with the Accounting and Finance Department on the preparation of income tax declaration.</li><li>Prepare and review the income tax declaration and supporting schedules.</li><li>Submit the declaration through the authorization provided to our office.</li><li>Routine follow-up to obtain the final certificate.</li><li>The contract is automatically renewed unless either party is notified of amendment or cancellation.</li></ol>',
              ar: '<b>إقرار ضريبة دخل:</b><ol><li>مراجعة مخصص ضريبة الدخل المحتسب من قبل الشركة.</li><li>التنسيق مع إدارة المحاسبة والمالية بالشركة بشأن إعداد إقرار ضريبة الدخل.</li><li>إعداد ومراجعة إقرار ضريبة الدخل والجداول التفصيلية المؤيدة للإقرار.</li><li>تقديم الإقرارات نيابة عنكم من خلال التفويض المقدم لمكتبنا.</li><li>المتابعة الروتينية للحصول على الشهادة النهائية.</li><li>يجدد العقد تلقائياً ما لم يخطر أحد الطرفين بتعديله أو إلغائه.</li></ol>'
            }
          ]
        },
        {
          rows: [
            {
              head: true,
              en: 'Fees',
              ar: 'الأتعاب'
            },
            {
              en: 'Our fees for the above services are estimated as shown in the table below. An advance payment of 50% of fees will be requested at the time of signing and 50% upon completion.',
              ar: 'تقدر أتعابنا لقاء الخدمات المشار إليها أعلاه كما هو مبين، وسيتم طلب دفعة مقدمة بواقع 50% من الأتعاب عند توقيع خطاب التعيين و50% عند اكتمال تقديم الإقرارات.'
            }
          ]
        },
        {
          rows: [
            {
              head: true,
              en: 'Approval of the Engagement letter',
              ar: 'الموافقة على خطاب التعاقد'
            },
            {
              en: 'We appreciate the opportunity you gave us to provide our services to the company. Please sign below and return it to us.<br><br>Signature: ___________________________<br>Name: ___________________________<br>Stamp: ___________________________',
              ar: 'نقدر الفرصة التي أعطيتمونا لتقديم خدماتنا للشركة. نأمل التكرم بالتوقيع أدناه وإعادة الخطاب إلينا.<br><br>التوقيع: ___________________________<br>الاسم: ___________________________<br>الختم: ___________________________'
            }
          ]
        }
      ]
    },

    {
      id: 'audit',
      title: 'خطاب تعيين — مراجعة القوائم المالية',
      subtitle: 'Audit Engagement Letter',
      tags: ['AUDIT', 'ع / EN'],
      available: true,
      pages: [
        {
          rows: [
            {
              title: true,
              en: 'LETTER OF ENGAGEMENT',
              ar: 'خطـاب تعييـن'
            },
            {
              en: 'This Engagement Letter confirms the terms under which we have been engaged to audit and report on the financial statements of {{clientName}} for the year {{year}}.',
              ar: 'يؤكد خطاب التعيين هذا الشروط التي تم بموجبها تعييننا لمراجعة وإصدار تقرير حول القوائم المالية لشركة {{clientName}} للسنة المالية {{year}}.'
            },
            {
              en: 'Should conditions not now anticipated preclude us from completing our audit and issuing a report, we will advise you and those charged with governance promptly.',
              ar: 'إذا حالت الظروف دون قيامنا بإتمام أعمال المراجعة أو إصدار التقرير كما هو متوقع، فسوف نقوم بإبلاغكم وإبلاغ المسؤولين عن الحوكمة بأسرع وقت.'
            }
          ]
        },
        {
          rows: [
            {
              head: true,
              en: 'Audit Responsibilities and Limitations',
              ar: 'مسئوليات وقيود المراجعة'
            },
            {
              en: '<ol><li>We will conduct the audit in accordance with International Standards on Auditing endorsed in the Kingdom of Saudi Arabia.</li><li>The objective of our audit is to obtain reasonable assurance about whether the financial statements are free of material misstatement.</li><li>Reasonable assurance is a high level of assurance but is not a guarantee that an audit will always detect a material misstatement.</li><li>As part of an audit, we exercise professional judgment and maintain professional skepticism throughout the audit.</li></ol>',
              ar: '<ol><li>سنقوم بأعمال المراجعة وفقاً للمعايير الدولية للمراجعة المعتمدة في المملكة العربية السعودية.</li><li>تتمثل أهدافنا في الحصول على تأكيد معقول فيما إذا كانت القوائم المالية خالية من تحريف جوهري.</li><li>إن التأكيد المعقول هو مستوى عالٍ من التأكيد، إلا أنه لا يمثل ضماناً بأن المراجعة ستكشف دائماً عن تحريف جوهري.</li><li>كجزء من المراجعة، فإننا نمارس الحكم المهني ونحافظ على نزعة الشك المهني خلال المراجعة.</li></ol>'
            }
          ]
        },
        {
          rows: [
            {
              head: true,
              en: 'Management’s Responsibilities and Representations',
              ar: 'مسئوليات وتأكيدات الإدارة'
            },
            {
              en: '<ol><li>Management is responsible for the preparation and fair presentation of the financial statements.</li><li>Management is responsible for internal control necessary to enable preparation of financial statements free from material misstatement.</li><li>Management shall provide us with access to all information relevant to preparation of financial statements.</li></ol>',
              ar: '<ol><li>الإدارة مسئولة عن إعداد وعرض القوائم المالية عرضاً عادلاً.</li><li>الإدارة مسئولة عن نظام الرقابة الداخلية اللازم لإعداد قوائم مالية خالية من التحريفات الجوهرية.</li><li>تلتزم الإدارة بتمكيننا من الوصول إلى كافة المعلومات ذات الصلة بإعداد القوائم المالية.</li></ol>'
            }
          ]
        },
        {
          rows: [
            {
              head: true,
              en: 'Fees and Billings',
              ar: 'الأتعاب والفواتير'
            },
            {
              en: 'Our estimated fees for audit services are SAR <span class="f" contenteditable="true">35,000</span>. The fees do not include VAT. An advance payment of 50% will be requested upon signing and 50% upon issuance of the draft report.',
              ar: 'تقدر أتعابنا لقاء خدمات المراجعة بمبلغ <span class="f" contenteditable="true">35,000</span> ريال سعودي. الأتعاب لا تشمل ضريبة القيمة المضافة. سيتم طلب دفعة مقدمة بواقع 50% عند توقيع الخطاب و50% عند إصدار مسودة التقرير.'
            }
          ]
        },
        {
          rows: [
            {
              head: true,
              en: 'Confidentiality, Limitations and Other Matters',
              ar: 'المحافظة على السرية والقيود والأمور الأخرى'
            },
            {
              en: 'We follow professional standards of confidentiality and will treat client information as confidential. Limitations of liability and other engagement terms shall apply in accordance with this agreement.',
              ar: 'نحن نتبع المعايير المهنية بشأن المحافظة على السرية واعتبار معلومات العميل سرية. وتطبق حدود المسؤولية والأحكام الأخرى وفقاً لهذه الاتفاقية.'
            }
          ]
        },
        {
          rows: [
            {
              head: true,
              en: 'Approval',
              ar: 'الموافقة'
            },
            {
              en: 'We appreciate the opportunity to be of assistance to the Company. If this Agreement accurately reflects the terms and conditions, please sign below.<br><br>By Al-Shalahi Chartered Accountants<br><br>Khaled Bin Alhumaidi Al-Shalahi<br>Certified Public Accountant<br>Registration no. 538<br><br>Signature: ___________________________<br>Name: ___________________________<br>Stamp: ___________________________',
              ar: 'نقدر الفرصة التي أعطيتمونا لتقديم خدماتنا للشركة. إذا كانت هذه الاتفاقية تعكس الشروط والأحكام، نأمل التوقيع أدناه.<br><br>عن مكتب الشلاحي محاسبون قانونيون<br><br>خالد بن الحميدي الشلاحي<br>محاسب قانوني<br>قيد سجل المحاسبين القانونيين رقم 538<br><br>التوقيع: ___________________________<br>الاسم: ___________________________<br>الختم: ___________________________'
            }
          ]
        }
      ]
    },

    {
      id: 'agreed-procedures',
      title: 'خطاب ارتباط — إجراءات متفق عليها',
      subtitle: 'Agreed-Upon Procedures Engagement',
      tags: ['AUP', 'عربي'],
      available: true,
      pages: [
        {
          rows: [
            {
              full: 'خطاب ارتباط لمهمة تنفيذ إجراءات متفق عليها'
            },
            {
              full: 'طلبت شركة {{clientName}} تنفيذ مهمة إجراءات متفق عليها بشأن كميات خام رمل السيلكا عالي النسبة، وذلك لغرض تقديم النتائج للجهات المختصة. وإننا نرسل هذا الخطاب تأكيداً لفهمنا لشروط وأهداف وطبيعة وحدود الخدمات التي سنقدمها.'
            },
            {
              full: 'سنقوم بأداء مهمتنا وفقًا للمعيار الدولي للخدمات ذات الصلة 4400 المعدل، والمعتمد في المملكة العربية السعودية. وعند تنفيذ الإجراءات المتفق عليها، سوف نلتزم بالمعايير الدولية لأخلاقيات المحاسبين المحترفين.'
            }
          ]
        },
        {
          rows: [
            {
              full: '<b>نطاق العمل</b><ol><li>الحصول على بيان من الشركة يفيد بعدم وجود أي إنتاج خلال الفترة إذا كان الموقع في مرحلة التجهيز.</li><li>مطابقة البيان مع سجلات الشركة والقوائم المالية المعتمدة.</li><li>الحصول على نموذج التقرير السنوي لحامل رخصة استغلال لكل الخامات.</li><li>مطابقة المقابل المالي للطن الواحد المستغل مع الرسوم المحددة من الجهة المختصة.</li></ol>'
            }
          ]
        },
        {
          rows: [
            {
              full: '<b>تقرير الإجراءات المتفق عليها</b><br>سنصدر تقريرنا الذي سيتم توجيهه إلى الشركة، ويصف الإجراءات المتفق عليها ونتائج الإجراءات التي تم تنفيذها.'
            },
            {
              full: '<b>الأتعاب</b><br>يتم احتساب أتعابنا على أساس الوقت المستغرق والمصروفات المتكبدة مع مراعاة درجة المسؤولية والخبرة والمهارة المطلوبة. نقدر إجمالي أتعابنا بمبلغ <span class="f" contenteditable="true">5,000</span> ريال سعودي غير شاملة ضريبة القيمة المضافة.'
            }
          ]
        },
        {
          rows: [
            {
              full: 'يعكس هذا الخطاب الاتفاق الكامل بين الشركة ومكتب الشلاحي محاسبون قانونيون فيما يتعلق بالخدمات الموضحة طيه. وسنكون ممتنين في حال قمتم بتأكيد موافقتكم على شروط تعاقدنا من خلال التوقيع على النسخة المرفقة من هذه الرسالة وإعادتها إلينا.<br><br>تفضلوا بقبول فائق الاحترام،<br>نيابةً عن الشلاحي محاسبون قانونيون<br><br>خالد بن الحميدي الشلاحي<br>محاسب قانوني<br>قيد سجل المحاسبين القانونيين رقم 538<br><br>نؤكد نحن شركة {{clientName}}<br><br>التوقيع: ___________________________<br>التاريخ: ___________________________<br>الاسم: ___________________________<br>المسمى الوظيفي: ___________________________'
            }
          ]
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadClients();
  }

  constructor(private http: HttpClient) {}

  get selectedTemplate(): ContractTemplate {
    return this.contractTemplates.find(t => t.id === this.selectedTemplateId) || this.contractTemplates[0];
  }

  get selectedClient(): ClientLookup | null {
    return this.clients.find(c => String(c.id) === String(this.selectedClientId)) || null;
  }

  get clientName(): string {
    return this.selectedClient?.name || '..............................';
  }

  get year(): string {
    if (!this.contractDate) return '2024';

    const d = new Date(this.contractDate);
    if (isNaN(d.getTime())) return '2024';

    return String(d.getFullYear());
  }

  private getTodayDate(): string {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  private loadClients(): void {
    this.isClientsLoading = true;

    this.http.get<any>(`${this.baseUrl}api/Clients/Lookup?language=ar`).subscribe({
      next: (res) => {
        this.clients = this.normalizeClients(res);

        if (this.clients.length && !this.selectedClientId) {
          this.selectedClientId = this.clients[0].id;
        }

        this.isClientsLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.clients = [];
        this.isClientsLoading = false;
      }
    });
  }

  private normalizeClients(res: any): ClientLookup[] {
    const list =
      Array.isArray(res) ? res :
      Array.isArray(res?.data) ? res.data :
      Array.isArray(res?.items) ? res.items :
      Array.isArray(res?.result) ? res.result :
      [];

    return list
      .map((item: any) => ({
        id: item.id ?? item.value ?? item.clientId ?? item.Id,
        name: item.name ?? item.text ?? item.nameAr ?? item.clientName ?? item.Name ?? ''
      }))
      .filter((x: ClientLookup) => x.id !== undefined && x.name);
  }

  openDoc(templateId?: string): void {
    if (templateId) {
      this.selectedTemplateId = templateId;
    }

    this.isEditorOpen = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showGallery(): void {
    this.isEditorOpen = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  applyVariables(value: string | undefined): string {
    if (!value) return '';

    return value
      .replace(/\{\{clientName\}\}/g, this.clientName)
      .replace(/\{\{date\}\}/g, this.contractDate || '')
      .replace(/\{\{year\}\}/g, this.year);
  }

  trackByTemplateId(index: number, item: ContractTemplate): string {
    return item.id;
  }

  handleSave(): void {
    const fields = document.querySelectorAll<HTMLElement>('.f');
    const data: string[] = [];

    fields.forEach((field) => {
      const value = field.innerText.replace(/[.…]/g, '').trim();

      if (value.length > 0) {
        field.classList.add('ok');
      } else {
        field.classList.remove('ok');
      }

      data.push(field.innerText.trim());
    });

    localStorage.setItem('contractFields', JSON.stringify(data));
    alert('تم حفظ البيانات بنجاح');
  }

  async exportContractAsPdf(): Promise<void> {
    if (this.isExporting) {
      return;
    }

    this.isExporting = true;

    try {
      await this.waitForRender(300);

      const pages = document.querySelectorAll<HTMLElement>('.doc-page');

      if (!pages || pages.length === 0) {
        alert('لم يتم العثور على صفحات العقد');
        return;
      }

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        page.classList.add('export-page');

        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: 0,
          windowWidth: page.scrollWidth,
          windowHeight: page.scrollHeight
        });

        page.classList.remove('export-page');

        const imgData = canvas.toDataURL('image/png', 1.0);

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      }

      const safeClient = this.clientName.replace(/[\\/:*?"<>|]/g, '-');
      const safeTemplate = this.selectedTemplate.title.replace(/[\\/:*?"<>|]/g, '-');

      pdf.save(`${safeTemplate}-${safeClient}.pdf`);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء تجهيز ملف PDF');
    } finally {
      this.isExporting = false;
    }
  }

  async exportContractAsImages(): Promise<void> {
    if (this.isExporting) {
      return;
    }

    this.isExporting = true;

    try {
      await this.waitForRender(300);

      const pages = document.querySelectorAll<HTMLElement>('.doc-page');

      if (!pages || pages.length === 0) {
        alert('لم يتم العثور على صفحات العقد');
        return;
      }

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        page.classList.add('export-page');

        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: 0,
          windowWidth: page.scrollWidth,
          windowHeight: page.scrollHeight
        });

        page.classList.remove('export-page');

        const link = document.createElement('a');
        link.download = `${this.selectedTemplate.id}-page-${i + 1}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();

        await this.waitForRender(250);
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء تجهيز الصور');
    } finally {
      this.isExporting = false;
    }
  }

  private waitForRender(delay: number = 300): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), delay);
    });
  }
}
