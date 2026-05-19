import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ClientLookup  { id: number | string; name: string; }
interface ContractTemplate { id: string; title: string; pages: ContractPage[]; }
interface ContractPage  { rows: ContractRow[]; }
interface ContractRow   { en?: string; ar?: string; full?: string; head?: boolean; title?: boolean; }

@Component({
  selector: 'app-contract-templates',
  templateUrl: './contract-templates.component.html',
  styleUrls: ['./contract-templates.component.scss']
})
export class ContractTemplatesComponent implements OnInit {
  private baseUrl = environment.baseUrl;

  isEditorOpen     = false;
  isExporting      = false;
  isClientsLoading = false;
  isClientDropdownOpen = false;
  clientSearchTerm     = '';

  clients: ClientLookup[]                  = [];
  selectedClientId: number | string | null = null;
  selectedTemplateId = 'vat';
  contractDate       = this.getTodayDate();
  refNumber          = '202';

  contractTemplates: ContractTemplate[] = [

    /* ══════════════════════════════════════════════════════════
       1. VAT  — 6 pages matching نموذج_خطاب_القيمة_المضافة
    ══════════════════════════════════════════════════════════ */
    {
      id: 'vat',
      title: 'خطاب تعيين — ضريبة القيمة المضافة',
      pages: [
/* PAGE 1 — Intro */
        {
          rows: [
            { title: true, en: 'LETTER OF ENGAGEMENT', ar: 'خطـاب تعييـن' },
            {
              en: '<strong>Subject:</strong> Letter of Engagement for VAT Services to {{clientName}} Company for the year ended 31 December {{year}}.',
              ar: '<strong>الموضوع:</strong> خطاب تعيين بخصوص خدمات ضريبة القيمة المضافة لشركة {{clientName}} للسنة المنتهية في 31 ديسمبر {{year}}م.'
            },
            {
              en: 'We thank you for choosing "Al Shalahi Chartered Accountants" to perform the professional services of {{clientName}} Company from providing VAT services and we confirm our office\'s willingness to work with your company as a consultant on matters related to VAT, and we provide in this letter our perspective of the contract with you.',
              ar: 'نشكركم على اختيار "مكتب الشلاحي محاسبون قانونيون" لأداء الخدمات المهنية لشركة {{clientName}} وذلك من تقديم خدمات ضريبة القيمة المضافة، ونؤكد استعداد مكتبنا العمل مع شركتكم كمستشار في الأمور المتعلقة بضريبة القيمة المضافة، ونورد في هذا الخطاب فهمنا لتعاقدنا معكم.'
            }
          ]
        },
/* PAGE 2 — Scope A (English) */
        {
          rows: [
            { head: true, en: 'Scope of work', ar: 'نطاق العمل' },
            {
              en: '<strong>A - Preparation of VAT return:</strong><ol><li>Prepare and provide training courses for the employees of the facility on how to deal with inputs and outputs and everything related to VAT.</li><li>Equipping and adapting the enterprise\'s accounting systems to fit the tax system applicable in Saudi Arabia and its implementing regulations.</li><li>Field visits to see detailed procedures for processing the facility and supervising the pilot application.</li><li>Supervise the processing of accounting records or book collection required for the application of VAT.</li><li>Supervise the design and processing of the necessary tax invoice and its returns.</li><li>Training accountants on the daily restrictions necessary to prove tax processing.</li><li>Training of specialists in disclosures to be printed when preparing a tax return.</li><li>Documentation of all the reported balances of the accounting programme, the invoice preservation programme and suppliers\' data, as well as support for sales of statements and files.</li><li>Systematic audit of inputs and outputs and their revenues and classification into tax return (taxable – zero tax – exempt) to determine their validity for the preparation of tax returns.</li><li>Submit VAT returns (monthly – quarterly) in accordance with the provisions of Article 62 of the VAT Regulations.</li></ol>',
              ar: '<strong>أ - إعداد إقرار ضريبة القيمة المضافة:</strong><ol><li>إعداد وتقديم دورات تدريبية لمنسوبي المنشأة حول كيفية التعامل مع المدخلات والمخرجات وكل ما يتعلق بضريبة القيمة المضافة.</li><li>تجهيز وتهيئة النظم المحاسبية بالمنشأة لتناسب نظام الضريبة المطبق في المملكة العربية السعودية ولائحته التنفيذية.</li><li>عمل زيارات ميدانية للاطلاع على الإجراءات التفصيلية لتجهيز المنشأة والإشراف على التطبيق التجريبي.</li><li>الإشراف على تجهيز السجلات المحاسبية أو المجموعة الدفترية اللازمة لتطبيق ضريبة القيمة المضافة.</li><li>الإشراف على تصميم وتجهيز الفاتورة الضريبية اللازمة ومردوداتها.</li><li>تدريب المحاسبين على القيود اليومية اللازمة لإثبات المعالجة الضريبية.</li><li>تدريب المختصين على الكشوفات الواجب طباعتها عند إعداد الإقرار الضريبي.</li><li>توثيق كل ما ذكر بالإقرار من أرصدة من البرنامج المحاسبي وبرنامج حفظ فواتير المدخلات وبيانات الموردين وكذلك ما يؤيد المبيعات من كشوف وملفات.</li><li>مراجعة الحسابات النظامية من المدخلات والمخرجات ومردوداتها وتصنيفها إلى ما ورد بالإقرار الضريبي من (خاضعة للضريبة – خاضعة لنسبة الصفر – معفاة).</li><li>تقديم إقرارات ضريبة القيمة المضافة (شهرياً – ربع سنوياً) طبقاً لأحكام المادة الثانية والستون من اللائحة التنفيذية.</li></ol>'
            }
          ]
        },
/* PAGE 3 — Scope B + C */
        {
          rows: [
            { head: true, en: 'B - Follow-up to the evaluation process (examination)', ar: 'ب – متابعة عملية التقييم (الفحص)' },
            {
              en: 'Reply to queries submitted by the General Authority for Zakat and Income, including the following scope of work:<ul><li>Study questions received from the Authority.</li><li>Report the company on the nature of the inquiries and agree on a plan of action to respond.</li><li>Prepare the reply letter to Authority inquiries and take the company approval.</li><li>Checking supporting documents as appropriate to the nature of queries and their impact on the examiner.</li><li>Provide a response to the Authority inquiries within the prescribed period or request an extension if needed.</li><li>Follow-up with the General Authority for Zakat and Income when there is an examination for one or more financial years in accordance with the provisions of Article 64.</li></ul>We will do the following:<ul><li>Processing the documents and analyses required for the evaluation process by the Authority.</li><li>Attend the evaluation process until its completion.</li><li>Receipt and review of the Authority\'s links and submit our views thereon.</li><li>After obtaining your consent regarding the links issued by the Authority, we will prepare and submit a letter on your behalf informing the Authority of your consent and pay the differences due under it if any.</li></ul>',
              ar: 'الرد على الاستفسارات المقدمة من جانب الهيئة العامة للزكاة والدخل، ويتضمن نطاق العمل التالي:<ul><li>دراسة الاستفسارات الواردة من الهيئة.</li><li>إفادة الشركة عن طبيعة الاستفسارات والاتفاق على خطة عمل للرد عليها.</li><li>إعداد خطاب الرد على استفسارات هيئة الزكاة وأخذ موافقة الشركة عليه.</li><li>تدقيق المستندات المؤيدة من حيث ملائمتها لطبيعة الاستفسارات وأثرها على الفاحص.</li><li>تقديم الرد على الاستفسارات للهيئة خلال المدة الزمنية المحددة، أو طلب تمديد للمدة عند الحاجة.</li><li>المتابعة مع الهيئة العامة للزكاة والدخل عند وجود فحص عن سنة مالية أو أكثر طبقاً لأحكام المادة الرابعة والستون.</li></ul>سنقوم بالآتي:<ul><li>تجهيز المستندات والتحليلات المطلوبة لعملية التقييم من الهيئة.</li><li>حضور عملية الفحص حتى انتهائها.</li><li>استلام ومراجعة الربوط الصادرة من الهيئة وتقديم مرئياتنا بشأنها.</li><li>بعد الحصول على موافقتكم بشأن الربوط الصادرة من الهيئة، سوف نقوم بإعداد وتقديم خطاب نيابة عنكم يفيد الهيئة بموافقتكم على الربط وسداد الفروق المستحقة بموجبه إن وجدت.</li></ul>'
            },
            { head: true, en: 'C - Follow-up of the linkage process', ar: 'ج – متابعة عملية الربط' },
            {
              en: 'In case you disagree with the Authority\'s link, we will:<ul><li>Study the objection clauses and present our views.</li><li>Meeting with the company to determine objection items and strategy for submitting them to the Authority.</li><li>Prepare a memorandum clarifying the company view on the differences arising from the evaluation process and take the company approval before submitting to the Authority.</li><li>Meeting with the Authority if possible to clarify the company view and submit the objection memorandum within the regular period.</li><li>Follow-up with the Authority in an attempt to reach an acceptable settlement to end all or certain items of dispute.</li></ul>',
              ar: 'أما في حال عدم موافقتكم على الربط الصادر من الهيئة سوف نقوم بالتالي:<ul><li>دراسة بنود الاعتراض وتقديم مرئياتنا حولها.</li><li>الاجتماع مع الشركة لتحديد بنود الاعتراض واستراتيجية تقديمها للهيئة.</li><li>إعداد مذكرة نوضح من خلالها وجهة نظر الشركة حول الفروقات الناتجة عن عملية التقييم، وأخذ موافقة الشركة عليها قبل تقديمها إلى الهيئة.</li><li>الاجتماع مع الهيئة إذا أمكن لتوضيح وجهة نظر الشركة وتقديم مذكرة الاعتراض خلال المدة النظامية.</li><li>المتابعة مع الهيئة في محاولة للوصول إلى تسوية مقبولة لإنهاء جميع أو بعض بنود الخلاف مع الهيئة.</li></ul>'
            }
          ]
        },
/* PAGE 4 — Scope D (Tax Committees) */
        {
          rows: [
            { head: true, en: 'D - Services related to tax committees', ar: 'د – الخدمات المتعلقة باللجان الضريبية' },
            {
              en: 'If the company does not agree to the result of the objection before the General Authority for Zakat and Income in relation to (Zakat Linkage – VAT Linkage – Real Estate Transactions Tax), we will:<br><br><strong>1. Objection before the General Secretariat of Tax Committees (Committee on Tax Irregularities and Disputes)</strong><ul><li>Obtaining authorization from the company to represent it before the Committee.</li><li>Coordinate with the company to prepare and submit a memorandum of objection to the terms of the tax link within the regular period.</li><li>Representing you in the objection hearing before the Committee on the Determination of Tax Irregularities and Disputes.</li></ul><strong>2. Objection before the Tax Irregularities and Disputes Appeals Committee</strong><ul><li>Meeting with the company to clarify our opinion on the grounds the first committee relied upon.</li><li>Prepare and submit an appeal memorandum to the Appeals Committee during the regular period.</li><li>Seek the earliest possible date for an objection hearing before the Appeals Committee.</li><li>Representing you at the objection hearing before the Appeals Committee.</li></ul>',
              ar: 'حال عدم موافقة الشركة على نتيجة الاعتراض أمام الهيئة العامة للزكاة والدخل فيما يخص (الربط الزكوي – ربط ضريبة القيمة المضافة – ضريبة التصرفات العقارية) سوف نقوم بالآتي:<br><br><strong>1. الاعتراض أمام الأمانة العامة للجان الضريبية (لجنة الفصل في المخالفات والمنازعات الضريبية)</strong><ul><li>الحصول على تفويض من الشركة لتمثيلها أمام لجنة الفصل في المخالفات والمنازعات الضريبية.</li><li>التنسيق مع الشركة لإعداد وتقديم مذكرة الاعتراض على بنود الربط الضريبي خلال المدة النظامية.</li><li>تمثيلكم في جلسة مناقشة الاعتراض أمام لجنة الفصل في المخالفات والمنازعات الضريبية.</li></ul><strong>2. الاعتراض أمام لجنة الاستئناف في المخالفات والمنازعات الضريبية</strong><ul><li>الاجتماع مع الشركة لتوضيح رأينا حول الأسس التي اعتمدت عليها اللجنة الأولى.</li><li>إعداد وتقديم مذكرة الاستئناف إلى اللجنة الاستئنافية خلال المدة النظامية بالتنسيق مع الشركة.</li><li>السعي للحصول على أقرب موعد ممكن لعقد جلسة مناقشة الاعتراض.</li><li>تمثيلكم في جلسات مناقشة الاعتراض أمام لجنة الاعتراض الاستئنافية.</li></ul>'
            },
{ head: true, en: 'Fees', ar: 'الأتعاب' },
            {
              en: 'The estimates of our fees for the provision of the services described above are as follows:<br><ul><li>Items (a)(b)(c): SAR <span class="f" contenteditable="true" spellcheck="false">………</span> per annum for the services contained in the said items.</li><li>Services under item (d) as agreed with the client for each financial year.</li><li>VAT legal consulting: calculated based on the number of working hours at SAR 650 per working hour.</li></ul>In estimating these fees, it was assumed that your staff would provide us with appropriate assistance in preparing schedules and other matters on a regular basis.<br>In accordance with our policy, an advance payment of 50% will be requested upon signing the contract, and 50% upon submission of declarations for the first half of {{year}}.',
              ar: 'نورد أدناه تقديرات أتعابنا عن تقديم الخدمات المبينة أعلاه كما يلي:<br><ul><li>البنود رقم (أ)(ب)(ج): <span class="f" contenteditable="true" spellcheck="false">………………</span> ريال سعودي سنوياً عن الخدمات الواردة بالبنود المذكورة.</li><li>الخدمات الواردة بالبند رقم (د) حسب الاتفاق مع العميل لكل سنة مالية.</li><li>حالة الاستشارات القانونية الخاصة بضريبة القيمة المضافة يتم احتساب أتعابنا بناءً على عدد ساعات العمل المبذولة بواقع 650 ريال لكل ساعة عمل.</li></ul>وعند تقدير هذه الأتعاب، تم الافتراض بأن يقدم موظفيكم لنا المساعدة الملائمة في إعداد الجداول والأمور الأخرى بصورة منتظمة.<br>وطبقاً للسياسة المتبعة لدينا، سيتم طلب دفعة مقدمة بواقع 50% عند توقيع العقد، و50% عند تقديم إقرارات النصف الأول من العام {{year}}م.'
            }
          ]
        },
/* PAGE 6 — Approval */
        {
          rows: [
            { head: true, en: 'Approval of the contract letter', ar: 'الموافقة على خطاب التعاقد' },
            {
              en: 'We appreciate the opportunity you gave us to provide our services to the company. If this agreement reflects the terms and conditions under which the Company agreed to our appointment, we hope to kindly sign below on behalf of the Company on this copy of the letter and return it to us.<br><br>And your special greetings,<br><br>By <strong>Al-Shalahi Chartered Accountants</strong><br><br><strong>Khaled bin Al-Hamidi Al-Shalahi</strong><br>Chartered Accountant<br>Register of Chartered Accountants (538)<br><br><br>We agree to the above terms:<br><br>On behalf of <strong>{{clientName}}</strong><br><br>Signature: &nbsp;&nbsp;_______________________________<br>Name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_______________________________<br>Stamp: &nbsp;&nbsp;&nbsp;&nbsp;_______________________________',
              ar: 'نقدر الفرصة التي أعطيتمونا لتقديم خدماتنا للشركة. إذا كانت هذه الاتفاقية تعكس الشروط والأحكام التي وافقت بموجبها الشركة على تعييننا، فأننا نأمل التكرم بالتوقيع أدناه نيابة عن الشركة على هذه النسخة من الخطاب وإعادتها إلينا.<br><br>ولكم خاص تحياتنا ،،،،<br><br>عن <strong>مكتب الشلاحي محاسبون قانونيون</strong><br><br><strong>خالد بن الحميدي الشلاحي</strong><br>محاسب قانوني<br>قيد سجل المحاسبين القانونيين (538)<br><br><br>نوافق على الشروط أعلاه:<br><br>نيابةً عن <strong>{{clientName}}</strong><br><br>التوقيع: &nbsp;&nbsp;_______________________________<br>الاسم: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_______________________________<br>الختم: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_______________________________'
            }
          ]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       2. ZAKAT  — 4 pages matching نموذج_خطاب_اقرار_زكوي
    ══════════════════════════════════════════════════════════ */
    {
      id: 'zakat',
      title: 'خطاب تعيين — إقرار زكوي',
      pages: [
{
          rows: [
            { title: true, en: 'LETTER OF ENGAGEMENT', ar: 'خطـاب تعييـن' },
            {
              en: '<strong>Subject:</strong> Letter of Engagement regarding Zakat Services for {{clientName}} for the financial year ended December 31, {{year}}.',
              ar: '<strong>الموضوع:</strong> خطاب تعيين بخصوص خدمات زكوية لشركة {{clientName}} للسنة المالية المنتهية في 31 ديسمبر {{year}}م.'
            },
            {
              en: 'We thank you for choosing "Al Shalahi Chartered Accountants" to perform the professional services of {{clientName}} Company for the financial year ended December 31, {{year}}, regarding Zakat services and we confirm our office\'s willingness to work with your company as a consultant on matters related to Zakat, and we provide in this letter our perspective of the contract with you.',
              ar: 'نشكركم على اختيار "مكتب الشلاحي محاسبون قانونيون" لأداء الخدمات المهنية لشركة {{clientName}} للسنة المالية المنتهية في 31 ديسمبر {{year}}م، وذلك من تقديم خدمات زكوية، ونؤكد استعداد مكتبنا العمل مع شركتكم كمستشار في الأمور المتعلقة بالزكاة، ونورد في هذا الخطاب فهمنا لتعاقدنا معكم.'
            }
          ]
        },
{
          rows: [
            { head: true, en: 'Scope of work', ar: 'نطاق العمل' },
            {
              en: '<strong>Zakat Declaration:</strong><ol><li>Review the Zakat Allotment calculated by the company by viewing the elements and clarifications of the draft financial statements before issuing the legal accountant\'s report about it.</li><li>Coordination with the company\'s Accounting and Finance Department on the preparation of Zakat declaration.</li><li>Prepare and review the Zakat Declaration and the detailed tables supporting the acknowledgement and inform you of our observations about it before submitting it on your behalf to the General Authority for Zakat and Income.</li><li>Submit the Zakat declaration on your behalf to the General Authority for Zakat and Income tax after obtaining the company\'s approval and payment of the due under it and follow up with the Authority to obtain either a certificate, a restricted certificate, or a letter of facilitation.</li><li>Routine follow-up to obtain one of the Zakat certificates mentioned in paragraph (4) above in the absence of inquiries from the General Authority for Zakat and Income.</li></ol>',
              ar: '<strong>إقرار زكوي:</strong><ol><li>مراجعة مخصص الاقرار الزكوي المحتسب من قبل الشركة من خلال الاطلاع على عناصر وإيضاحات مسودة القوائم المالية قبل إصدار تقرير المحاسب القانوني حولها.</li><li>التنسيق مع إدارة المحاسبة والمالية بالشركة بشأن إعداد إقرار الزكاة.</li><li>إعداد ومراجعة إقرار الزكاة والجداول التفصيلية المؤيدة للإقرار وإفادتكم بملاحظاتنا حوله قبل تقديمه نيابة عنكم للهيئة العامة للزكاة والدخل.</li><li>تقديم إقرار الزكاة نيابة عنكم للهيئة العامة للزكاة والدخل بعد الحصول على موافقة الشركة وسداد المستحق بموجبه والمتابعة مع الهيئة للحصول إما على شهادة أو شهادة مقيدة أو خطاب تسهيل.</li><li>المتابعة الروتينية للحصول على إحدى الشهادات الزكوية المذكورة في فقرة (4) أعلاه وذلك في حال عدم وجود استفسارات من الهيئة العامة للزكاة والدخل.</li></ol>'
            },
{ head: true, en: 'Fees', ar: 'الأتعاب' },
            {
              en: 'Our fees for the above services are estimated as shown in the table below. When assessing these fees, it has been assumed that your staff will provide us with appropriate assistance in preparing schedules and other matters on a regular basis. In accordance with our policy, an advance payment of 50% of fees will be requested at the time of signing the letter of appointment and 50% upon completion of submission of statements to the Authority.<br><br><table style="width:100%;border-collapse:collapse;direction:ltr"><tr><th style="border:1px solid #333;padding:4px 8px;text-align:left">Company\'s name</th><th style="border:1px solid #333;padding:4px 8px;text-align:left">Fees</th></tr><tr><td style="border:1px solid #333;padding:4px 8px"><span class="f" contenteditable="true" spellcheck="false">{{clientName}}</span></td><td style="border:1px solid #333;padding:4px 8px">SAR <span class="f" contenteditable="true" spellcheck="false">……,000</span></td></tr></table>',
              ar: 'تقدر أتعابنا لقاء الخدمات المشار إليها أعلاه كما هو مبين في الجدول أدناه، وعند تقدير هذه الأتعاب، تم الافتراض بأن يقدم موظفيكم لنا المساعدة الملائمة في إعداد الجداول والأمور الأخرى بصورة منتظمة. وطبقاً للسياسة المتبعة لدينا، سيتم طلب دفعة مقدمة بواقع 50% من الأتعاب عند توقيع خطاب التعيين و50% عند اكتمال تقديم الاقرارات للمصلحة.<br><br><table style="width:100%;border-collapse:collapse;direction:rtl"><tr><th style="border:1px solid #333;padding:4px 8px;text-align:right">اسم الشركة</th><th style="border:1px solid #333;padding:4px 8px;text-align:right">الإجمالي</th></tr><tr><td style="border:1px solid #333;padding:4px 8px;text-align:right"><span class="f" contenteditable="true" spellcheck="false">{{clientName}}</span></td><td style="border:1px solid #333;padding:4px 8px;text-align:right"><span class="f" contenteditable="true" spellcheck="false">……,000</span> ريال</td></tr></table>'
            }
          ]
        },
{
          rows: [
            { head: true, en: 'Approval of the Engagement letter', ar: 'الموافقة على خطاب التعاقد' },
            {
              en: 'We appreciate the opportunity you gave us to provide our services to the company. If this agreement reflects the terms and conditions under which the Company agreed to our appointment, we hope to kindly sign below on behalf of the Company on this copy of the letter and return it to us.<br><br>special greetings,<br><br>By <strong>Al-Shalahi Chartered Accountants</strong><br><br><strong>Khaled bin Al-Hamidi Al-Shalahi</strong><br>Chartered Accountant<br>Register of Chartered Accountants (538)<br><br><br>We agree to the above terms:<br><br>On behalf of <strong>{{clientName}}</strong><br><br>Signature: &nbsp;&nbsp;_______________________________<br>Name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_______________________________<br>Stamp: &nbsp;&nbsp;&nbsp;&nbsp;_______________________________',
              ar: 'نقدر الفرصة التي أعطيتمونا لتقديم خدماتنا للشركة. إذا كانت هذه الاتفاقية تعكس الشروط والأحكام التي وافقت بموجبها الشركة على تعييننا، فأننا نأمل التكرم بالتوقيع أدناه نيابة عن الشركة على هذه النسخة من الخطاب وإعادتها إلينا.<br><br>ولكم خاص تحياتنا ،،،،<br><br>عن <strong>مكتب الشلاحي محاسبون قانونيون</strong><br><br><strong>خالد بن الحميدي الشلاحي</strong><br>محاسب قانوني<br>قيد سجل المحاسبين القانونيين (538)<br><br><br>نوافق على الشروط أعلاه:<br><br>نيابةً عن <strong>{{clientName}}</strong><br><br>التوقيع: &nbsp;&nbsp;_______________________________<br>الاسم: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_______________________________<br>الختم: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_______________________________'
            }
          ]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       3. INCOME TAX  — 4 pages matching خطاب_اقرار_ضريبة
    ══════════════════════════════════════════════════════════ */
    {
      id: 'income-tax',
      title: 'خطاب تعيين — ضريبة الدخل',
      pages: [
{
          rows: [
            { title: true, en: 'LETTER OF ENGAGEMENT', ar: 'خطـاب تعييـن' },
            {
              en: '<strong>Subject:</strong> Letter of Engagement regarding Income Tax Services for {{clientName}} the financial year ended {{year}}.',
              ar: '<strong>الموضوع:</strong> خطاب تعيين بخصوص خدمات ضريبة الدخل لشركة {{clientName}} للسنة المنتهية في {{year}}.'
            },
            {
              en: 'We thank you for choosing "Al Shalahi Chartered Accountants" to perform the professional services of {{clientName}} for the financial year ended {{year}}, regarding income tax services and we confirm our office\'s willingness to work with your company as a consultant on matters related to Income Tax, and we provide in this letter our perspective of the contract with you.',
              ar: 'نشكركم على اختيار "مكتب الشلاحي محاسبون قانونيون" لأداء الخدمات المهنية لشركة {{clientName}} للسنة المنتهية في {{year}}، وذلك من تقديم خدمات ضريبة الدخل، ونؤكد استعداد مكتبنا العمل مع شركتكم كمستشار في الأمور المتعلقة بضريبة الدخل، ونورد في هذا الخطاب فهمنا لتعاقدنا معكم.'
            }
          ]
        },
{
          rows: [
            { head: true, en: 'Scope of work', ar: 'نطاق العمل' },
            {
              en: '<strong>Income Tax Declaration:</strong><ol><li>Review the income tax Allotment calculated by the company by viewing the elements and clarifications of the draft financial statements before issuing the legal accountant\'s report about it.</li><li>Coordination with the company\'s Accounting and Finance Department on the preparation of income tax declaration.</li><li>Prepare and review the income tax declaration and the detailed tables supporting the acknowledgement and inform you of our observations before submitting it on your behalf to the Zakat, Tax and Customs Authority.</li><li>Submission of income tax declaration on your behalf only through the authorization provided to our office on number 1000000482 and acceptance of authorization by us.</li><li>Routine follow-up to obtain the final zakat certificate in the absence of inquiries or any entitlements to the Zakat, Tax and Customs Authority.</li><li>The contract is automatically renewed unless either party is notified of its amendment or cancellation.</li></ol>',
              ar: '<strong>إقرار ضريبة دخل:</strong><ol><li>مراجعة مخصص ضريبة الدخل المحتسب من قبل الشركة من خلال الاطلاع على عناصر وإيضاحات مسودة القوائم المالية قبل إصدار تقرير المحاسب القانوني حولها.</li><li>التنسيق مع إدارة المحاسبة والمالية بالشركة بشأن إعداد إقرار ضريبة الدخل.</li><li>إعداد ومراجعة إقرار ضريبة الدخل والجداول التفصيلية المؤيدة للإقرار وإفادتكم بملاحظاتنا حوله قبل تقديمه نيابة عنكم لهيئة الزكاة والضريبة والجمارك.</li><li>تقديم الإقرارات نيابة عنكم فقط من خلال تفويض يقدم من قبلكم إلى مكتبنا على الرقم 1000000482 وقبول التفويض من طرفنا.</li><li>المتابعة الروتينية للحصول على شهادة الزكاة النهائية وذلك في حال عدم وجود استفسارات أو أي مستحقات لهيئة الزكاة والضريبة والجمارك.</li><li>يجدد العقد تلقائياً مالم يخطر أحد الطرفين بتعديله أو إلغائه.</li></ol>'
            },
{ head: true, en: 'Fees', ar: 'الأتعاب' },
            {
              en: 'Our fees for the above services are estimated as shown in the table below. When assessing these fees, it has been assumed that your staff will provide us with appropriate assistance on a regular basis. In accordance with our policy, an advance payment of 50% of fees will be requested at the time of signing the letter of appointment and 50% upon completion of submission of statements.<br><br><table style="width:100%;border-collapse:collapse;direction:ltr"><tr><th style="border:1px solid #333;padding:4px 8px;text-align:left">Company\'s name</th><th style="border:1px solid #333;padding:4px 8px;text-align:left">Fees</th></tr><tr><td style="border:1px solid #333;padding:4px 8px"><span class="f" contenteditable="true" spellcheck="false">{{clientName}}</span></td><td style="border:1px solid #333;padding:4px 8px">SAR <span class="f" contenteditable="true" spellcheck="false">……,000</span></td></tr></table>',
              ar: 'تقدر أتعابنا لقاء الخدمات المشار إليها أعلاه كما هو مبين في الجدول أدناه، وعند تقدير هذه الأتعاب تم الافتراض بأن يقدم موظفيكم لنا المساعدة الملائمة بصورة منتظمة. وطبقاً للسياسة المتبعة لدينا، سيتم طلب دفعة مقدمة بواقع 50% من الأتعاب عند توقيع خطاب التعيين و50% عند اكتمال تقديم الاقرارات للمصلحة.<br><br><table style="width:100%;border-collapse:collapse;direction:rtl"><tr><th style="border:1px solid #333;padding:4px 8px;text-align:right">اسم الشركة</th><th style="border:1px solid #333;padding:4px 8px;text-align:right">الإجمالي</th></tr><tr><td style="border:1px solid #333;padding:4px 8px;text-align:right"><span class="f" contenteditable="true" spellcheck="false">{{clientName}}</span></td><td style="border:1px solid #333;padding:4px 8px;text-align:right"><span class="f" contenteditable="true" spellcheck="false">……,000</span> ريال</td></tr></table>'
            }
          ]
        },
{
          rows: [
            { head: true, en: 'Approval of the Engagement letter', ar: 'الموافقة على خطاب التعاقد' },
            {
              en: 'We appreciate the opportunity you gave us to provide our services to the company. If this agreement reflects the terms and conditions under which the Company agreed to our appointment, we hope to kindly sign below on behalf of the Company and return it to us.<br><br>special greetings,<br><br>By <strong>Al-Shalahi Chartered Accountants</strong><br><br><strong>Khaled bin Al-Hamidi Al-Shalahi</strong><br>Chartered Accountant<br>Register of Chartered Accountants (538)<br><br><br>We agree to the above terms:<br><br>On behalf of <strong>{{clientName}}</strong><br><br>Signature: &nbsp;&nbsp;_______________________________<br>Name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_______________________________<br>Stamp: &nbsp;&nbsp;&nbsp;&nbsp;_______________________________',
              ar: 'نقدر الفرصة التي أعطيتمونا لتقديم خدماتنا للشركة. إذا كانت هذه الاتفاقية تعكس الشروط والأحكام التي وافقت بموجبها الشركة على تعييننا، فأننا نأمل التكرم بالتوقيع أدناه نيابة عن الشركة وإعادتها إلينا.<br><br>ولكم خاص تحياتنا ،،،،<br><br>عن <strong>مكتب الشلاحي محاسبون قانونيون</strong><br><br><strong>خالد بن الحميدي الشلاحي</strong><br>محاسب قانوني<br>قيد سجل المحاسبين القانونيين (538)<br><br><br>نوافق على الشروط أعلاه:<br><br>نيابةً عن <strong>{{clientName}}</strong><br><br>التوقيع: &nbsp;&nbsp;_______________________________<br>الاسم: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_______________________________<br>الختم: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_______________________________'
            }
          ]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       4. AUDIT  — 6 pages matching خطاب_تعيين (audit)
    ══════════════════════════════════════════════════════════ */
    {
      id: 'audit',
      title: 'خطاب تعيين — مراجعة القوائم المالية',
      pages: [
{
          rows: [
            { title: true, en: 'LETTER OF ENGAGEMENT', ar: 'خطـاب تعييـن' },
            {
              en: 'This Engagement Letter confirms the terms under which we have been engaged to audit and report on the financial statements of <strong>{{clientName}}</strong> for the year {{year}}. The services described in this paragraph may hereafter be referred to as either the "Audit Services" or the "Services."',
              ar: 'يؤكد خطاب التعيين هذا الشروط التي تم بموجبها تعييننا لمراجعة وإصدار تقرير حول القوائم المالية لشركة <strong>{{clientName}}</strong> للسنة المالية المنتهية في {{year}}. يشار إلى الخدمات المبينة في هذه الفقرة لاحقاً بـ "خدمات المراجعة" أو "الخدمات".'
            },
            {
              en: 'Should conditions not now anticipated preclude us from completing our audit and issuing a report (the "Report") as contemplated by this Agreement, we will advise you and those charged with governance promptly and take such action as we deem appropriate.',
              ar: 'وإذا ما حالت الظروف دون قيامنا بإتمام أعمال المراجعة أو إصدار تقرير ("التقرير") حسبما هو متوقع في هذه الاتفاقية، عندئذ سنقوم بإبلاغكم وإبلاغ المسئولين عن الحوكمة بأسرع وقت، واتخاذ الإجراء الذي نراه ملائماً.'
            }
          ]
        },
{
          rows: [
            { head: true, en: 'Audit Responsibilities and Limitations', ar: 'مسئوليات وقيود المراجعة' },
            {
              en: '<ol><li>We will conduct the audit in accordance with International Standards on Auditing that are endorsed in the Kingdom of Saudi Arabia. Those standards require that we are independent and that we fulfil our other ethical responsibilities that are relevant to our audit.</li><li>The objective of our audit is to obtain reasonable assurance about whether the Financial statements as a whole are free of material misstatement, whether due to fraud or error, and to express an opinion on whether the financial statements present fairly, in all material respects, the financial position of the Company in accordance with International Financial Reporting Standards endorsed in the Kingdom of Saudi Arabia.</li><li>Reasonable assurance is a high level of assurance, but it is not a guarantee that an audit will always detect a material misstatement when it exists. Misstatements can arise from fraud or error and are considered material if they could reasonably be expected to influence the economic decisions of users taken on these financial statements.</li><li>As part of an audit, we exercise professional judgment and maintain professional skepticism throughout the audit. We also identify and assess the risks of material misstatement of the financial statements, design and perform audit procedures responsive to those risks, and obtain audit evidence that is sufficient and appropriate to provide a basis for our opinion.</li></ol>',
              ar: '<ol><li>سنقوم بأعمال المراجعة وفقاً للمعايير الدولية للمراجعة المعتمدة في المملكة العربية السعودية. تتطلب تلك المعايير منا الالتزام باستقلاليتنا والوفاء بمسئوليات آداب وسلوك المهنة الأخرى ذات الصلة بأعمال المراجعة.</li><li>تتمثل أهدافنا في الحصول على تأكيد معقول فيما إذا كانت القوائم المالية ككل خالية من تحريف جوهري، ناتج عن غش أو خطأ، وإبداء الرأي فيما إذا كانت القوائم المالية تظهر بعدل، من كافة النواحي الجوهرية، المركز المالي للشركة وفقاً للمعايير الدولية للتقارير المالية المعتمدة في المملكة العربية السعودية.</li><li>إن التأكيد المعقول هو مستوى عالٍ من التأكيد، إلا أنه ليس ضماناً على أن المراجعة ستكشف دائماً عن تحريف جوهري موجود. ويمكن أن تنشأ التحريفات عن غش أو خطأ وتُعد جوهرية إذا أمكن بشكل معقول توقع أنها ستؤثر على القرارات الاقتصادية التي يتخذها المستخدمون بناءً على هذه القوائم المالية.</li><li>كجزء من المراجعة، فإننا نمارس الحكم المهني ونحافظ على نزعة الشك المهني خلال المراجعة. كما أننا نقوم بتحديد وتقويم مخاطر التحريفات الجوهرية في القوائم المالية، وتصميم وتنفيذ إجراءات مراجعة لمواجهة تلك المخاطر، والحصول على أدلة مراجعة كافية وملائمة لإبداء رأينا.</li></ol>'
            },
            { head: true, en: 'Audit Responsibilities and Limitations (continued)', ar: 'مسئوليات وقيود المراجعة (تتمة)' },
            {
              en: '<ul><li>There are inherent limitations in the audit process, including the use of judgment and selective testing of data and the possibility that collusion or forgery may preclude the detection of material error or fraud.</li><li>As part of our audit, we will also: (a) consider the Company\'s internal control over financial reporting solely for the purpose of planning our audit; (b) conclude on the appropriateness of management\'s use of the going concern basis of accounting; and (c) evaluate the overall presentation, structure, and content of the financial statements.</li><li>In accordance with International Standards on Auditing, we will communicate certain matters related to the conduct and results of the audit to those charged with governance, including: our views about significant qualitative aspects of the Company\'s accounting practices; significant difficulties encountered during the audit; uncorrected misstatements; disagreements with management; and other significant matters.</li><li>We will communicate in writing significant deficiencies in internal control identified during the audit. You should not rely on the draft report for submission to any party.</li></ul>',
              ar: '<ul><li>هناك قيود ملازمة لعملية المراجعة تشتمل على استخدام التقديرات، وفحص البيانات بشكل اختياري، واحتمال وجود تواطؤ أو تزوير يمكن أن يحول دون كشف أخطاء أو غش جوهرية.</li><li>كجزء من أعمال المراجعة، سنقوم أيضاً بـ: (أ) الأخذ بعين الاعتبار نظام الرقابة الداخلية للشركة لغرض تخطيط أعمال المراجعة فقط؛ (ب) استنتاج مدى ملائمة تطبيق الإدارة لمبدأ الاستمرارية في المحاسبة؛ و(ج) تقويم العرض العام وهيكل ومحتوى القوائم المالية.</li><li>طبقاً للمعايير الدولية للمراجعة، سنقوم بإبلاغ الأشخاص المسئولين عن الحوكمة عن بعض الأمور المتعلقة بتنفيذ المراجعة ونتائجها، بما في ذلك: وجهة نظرنا بشأن النواحي النوعية الهامة للممارسات المحاسبية؛ الصعوبات الهامة التي تمت مواجهتها أثناء المراجعة؛ الأخطاء غير المصححة؛ أية خلافات مع الإدارة؛ وأية أمور أخرى هامة.</li><li>سنقوم بالإبلاغ خطياً عن مواطن الضعف الهامة في نظام الرقابة الداخلية. يتعين عليكم عدم الاعتماد على مسودة أي تقرير لتقديمها لأي جهة.</li></ul>'
            }
          ]
        },
{
          rows: [
            { head: true, en: 'Management\'s Responsibilities and Representations', ar: 'مسئوليات وتأكيدات الإدارة' },
            {
              en: '<ol><li>Our audit will be conducted on the basis that management acknowledge and understand that they have responsibility for the preparation and fair presentation of the financial statements in accordance with International Financial Reporting Standards endorsed in the Kingdom of Saudi Arabia.</li><li>For such internal control as management determines is necessary to enable the preparation of financial statements free from material misstatement, whether due to fraud or error.</li><li>To provide us with: (1) access, on a timely basis, to all information relevant to the preparation of the financial statements; (2) additional information that we may request for the purpose of the audit; and (3) unrestricted access to persons within the Company from whom we determine it necessary to obtain audit evidence.</li><li>Management is responsible for apprising us of all allegations involving financial improprieties received by management or those charged with governance, regardless of source, and providing us full access to these allegations and any internal investigations.</li><li>We will make specific inquiries of management about the representations contained in the financial statements. At the conclusion of the engagement, we will also obtain written representations from management that all transactions have been recorded and reflected in the financial statements, and that management has provided us with all relevant information as contemplated in this Agreement.</li></ol>',
              ar: '<ol><li>ستتم مراجعتنا على أساس أن الإدارة على دراية وعلم بأنهم مسئولون عن إعداد وعرض القوائم المالية عرضاً عادلاً طبقاً للمعايير الدولية للتقارير المالية المعتمدة في المملكة العربية السعودية.</li><li>نظام الرقابة الداخلية الذي تراه الإدارة ضرورياً لتمكينها من إعداد قوائم مالية خالية من التحريفات الجوهرية الناتجة عن الغش أو الخطأ.</li><li>تمكيننا من: (1) الوصول في الوقت المناسب لكافة المعلومات المتعلقة بإعداد القوائم المالية مثل السجلات والمستندات؛ (2) الحصول على أية معلومات إضافية قد نطلبها لأغراض المراجعة؛ و(3) الوصول غير المقيد لأي شخص داخل الشركة.</li><li>إن الإدارة مسئولة عن إبلاغنا بكافة الإدعاءات بشأن عدم صحة المعلومات المالية المستلمة من الإدارة أو الأشخاص المسئولين عن الحوكمة، بصرف النظر عن مصدرها، وتمكيننا من الوصول الكامل لجميع هذه الادعاءات.</li><li>سنقوم بتوجيه استفسارات محددة إلى الإدارة بشأن التأكيدات التي تضمنتها القوائم المالية. وعند انتهاء عملنا، سنقوم بالحصول على تأكيدات خطية من الإدارة بأن جميع المعاملات قد تم تسجيلها وإظهارها في القوائم المالية، وأن الإدارة قدمت لنا كافة المعلومات اللازمة.</li></ol>'
            },
            { head: true, en: 'Responsibility of the Electronic Upload of the Financial Statements', ar: 'مسؤولية الإيداع الإلكتروني للقوائم المالية' },
            {
              en: 'In accordance with H.E the Minister of Commerce and Investment\'s Resolution No. 353/Q dated 18 Safar 1436H regarding the adoption of electronic upload platform for the financial statements ("QAWAEM"), your consent to this letter of engagement is considered as an authorization for Al Shalahy Chartered Accountants to upload the Company\'s financial statements and selected summarized financial information forms to QAWAEM after issuing the audit report. The Company\'s management is fully responsible for any matters related to this upload, while our responsibility is solely restricted to upload a soft copy of the financial statements to QAWAEM.',
              ar: 'وفقاً لقرار معالي وزير التجارة والاستثمار رقم (353/ق) تاريخ 18 صفر 1436هـ بشأن إقرار برنامج الإيداع الإلكتروني للقوائم المالية ("قوائم")، فإن موافقتكم على خطاب الارتباط هذا يُعتبر بمثابة تفويض مكتب الشلاحي محاسبون قانونيون لإيداع القوائم المالية ونماذج البيانات المالية الملخصة للشركة إلكترونياً لدى قوائم وذلك بعد إصدار تقرير المراجعة. تكون المسؤولية بالكامل على إدارة الشركة عن أي من المسائل المتعلقة بهذا الإيداع الإلكتروني، في حين تقتصر مسؤوليتنا على إيداع نسخة إلكترونية من القوائم المالية لدى قوائم.'
            },
{ head: true, en: 'Fees and Billings', ar: 'الأتعاب والفواتير' },
{
              en: '<ol><li>Our estimated fees for audit services of <strong>{{clientName}}</strong> for the year ended 31 December {{year}} amount to SAR <span class="f" contenteditable="true" spellcheck="false">35,000</span>.</li><li>When estimating these fees, it was assumed that your staff will provide us with appropriate assistance in preparing schedules and other matters on a regular basis. In addition to those fees, incidental expenses that you may incur on your behalf, which include additional copies of the reports in case of your request and expenses of travel, accommodation for our employees during visits outside the city of Riyadh, and VAT.</li><li>Fee notes are payable upon receipt.</li><li>Our estimated pricing and schedule achievement is based upon, among other things, our preliminary review of the Company records and representations. Should our assumptions be incorrect or should the condition of records require additional commitments by us beyond those upon which our estimates are based, we may adjust our fees.</li><li>Fees do not include VAT.</li></ol>',
              ar: '<ol><li>تقدر أتعابنا لقاء خدمات المراجعة لشركة <strong>{{clientName}}</strong> للسنة المالية المنتهية في 31 ديسمبر {{year}} بمبلغ <span class="f" contenteditable="true" spellcheck="false">35,000</span> ريال سعودي.</li><li>وعند تقدير هذه الأتعاب، تم الافتراض بأن يقدم موظفيكم لنا المساعدة الملائمة في إعداد الجداول والأمور الأخرى بصورة منتظمة. وتضاف إلى تلك الأتعاب المصاريف النثرية التي قد نتكبدها نيابة عنكم والتي تشتمل على نسخاً إضافية من التقارير في حال طلبكم ذلك ومصاريف السفر والإقامة لموظفينا أثناء الزيارات خارج مدينة الرياض وكذلك ضريبة القيمة المضافة.</li><li>تستحق سداد الفواتير عند استلامها.</li><li>تم تحديد أتعابنا المقدرة بناءً على مراجعتنا المبدئية لسجلات الشركة وتأكيدات موظفيها. إذا كانت افتراضاتنا غير صحيحة أو كانت حالة السجلات تتطلب منا التزامات إضافية، عندئذ سنقوم بتعديل أتعابنا وتواريخ الإنجاز المقررة.</li><li>الأتعاب لا تشمل ضريبة القيمة المضافة.</li></ol>'
            }
          ]
        },
{
          rows: [
{ head: true, en: 'Confidentiality and Limitations', ar: 'المحافظة على السرية والقيود' },
{
              en: '<ul><li>We follow professional standards of confidentiality and will treat Client Information in accordance with the IFAC Code of Ethics Section 140. Either of us may use electronic media to correspond without breaching confidentiality obligations.</li><li>You and any others for whom Services are provided may not recover from us any amount with respect to loss of profit, data or goodwill, or any other consequential, incidental, indirect, punitive, or special damages in connection with claims arising out of this Agreement.</li><li>You and any others for whom Services are provided may not recover from us aggregate damages more than the fees actually paid for the Services that directly caused the loss.</li><li>You shall make any claim relating to the Services no later than within 12 months of the act or omission alleged to have caused the claim.</li><li>To the fullest extent permitted by applicable law, you shall indemnify us against all claims by third parties and resulting liabilities, losses, damages, costs, and expenses arising out of or relating to the Services.</li></ul>',
              ar: '<ul><li>نحن نتبع المعايير المهنية بشأن المحافظة على السرية واعتبار المعلومات المتعلقة بكم معلومات سرية طبقاً لما نص عليه القسم 140 من قواعد سلوك وأخلاقيات المهنة الصادر عن مجلس المعايير الدولية. يجوز لأي منا استخدام الوسائل الإلكترونية في المراسلة دون أن يعتبر ذلك خرقاً لالتزامات المحافظة على السرية.</li><li>لا يجوز لكم أو لأي أشخاص آخرين تقدم لهم الخدمات أن يستردوا منا أي مبلغ يتعلق بفقدان الأرباح، أو البيانات، أو الشهرة أو أية أضرار عرضية أو غير مباشرة أو جزائية متعلقة بمطالبات ناتجة عن هذه الاتفاقية.</li><li>لا يجوز لكم ولأي أشخاص آخرين قدمت لهم الخدمات أن يستردوا منا إجمالي خسائر تزيد عن الأتعاب المدفوعة فعلاً لقاء الخدمات التي نشأت عنها الخسارة.</li><li>يجب ألا تتعدى مدة تقديم أية مطالبات تتعلق بالخدمات موعد أقصاه 12 شهراً من تاريخ وقوع ذلك التصرف أو الإغفال المزعوم الذي نتجت عنه المطالبة.</li><li>بالقدر الأقصى الذي تسمح به القوانين المرعية، يجب عليكم تعويضنا وكذلك مكاتبنا وكافة أشخاص مكتب الشلاحي محاسبون قانونيون عن كافة مطالبات الأطراف الثالثة وما ينتج عنها من التزامات وخسائر وأضرار وتكاليف ومصاريف الناتجة عن أو المتعلقة بالخدمات أو بهذه الاتفاقية.</li></ul>'
            },
{ head: true, en: 'Other Matters', ar: 'الأمور الأخرى' },
{
              en: 'The Company shall provide us with copies of any important documents including its financial statements prior to publication or filing for our review. In case of engaging us to perform Audit Services for a subsequent fiscal year, the terms and conditions set forth in this Agreement shall apply, except as specifically modified by the parties. Changes in the scope of the Audit Services and estimated fees for subsequent fiscal years will be communicated in supplemental letters.',
              ar: 'ستقوم الشركة بتزويدنا بنسخ عن أي مستندات عامة تشتمل على القوائم المالية قبل نشرها أو تقديمها لمراجعتها. في حالة تعيينا للقيام بخدمات المراجعة لسنة مالية لاحقة، فإن شروط وأحكام هذه الاتفاقية تنطبق بشأن أداء خدمات المراجعة وذلك باستثناء ما يتم تعديله بشكل خاص أو إضافته من قبل الأطراف. سيتم تبيان التغيرات في نطاق خدمات المراجعة والأتعاب المقدرة في السنوات المالية اللاحقة في خطابات إلحاقية.'
            }
          ]
        },
{
          rows: [
            { head: true, en: 'Approval', ar: 'الموافقة' },
            {
              en: 'We appreciate the opportunity to be of assistance to the Company. If this Agreement accurately reflects the terms and conditions on which the Company has agreed to engage us, please sign below on behalf of the Company, and return it to us.<br><br>Sincerely,<br><br>By <strong>Alshalahy Chartered Accountants</strong><br><br><strong>Khalid Bin Alhumaidi Alshalahy</strong><br>Certified Public Accountant<br>Registration no. 538<br><br><br>We agree to the above terms:<br><br>For and on behalf of <strong>{{clientName}}</strong><br><br>Signature: &nbsp;&nbsp;_______________________________<br>Name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_______________________________<br>Stamp: &nbsp;&nbsp;&nbsp;&nbsp;_______________________________',
              ar: 'نقدر الفرصة التي أعطيتمونا لتقديم خدماتنا للشركة. إذا كانت هذه الاتفاقية تعكس الشروط والأحكام التي وافقت بموجبها الشركة على تعييننا، فأننا نأمل التكرم بالتوقيع أدناه نيابة عن الشركة على هذه النسخة من الخطاب وإعادتها إلينا.<br><br>ولكم خالص تحياتنا،<br><br>عن <strong>مكتب الشلاحي محاسبون قانونيون</strong><br><br><strong>خالد بن الحميدي الشلاحي</strong><br>محاسب قانوني<br>قيد سجل المحاسبين القانونيين (538)<br><br><br>نوافق على الشروط أعلاه:<br><br>نيابةً عن <strong>{{clientName}}</strong><br><br>التوقيع: &nbsp;&nbsp;_______________________________<br>الاسم: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_______________________________<br>الختم: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_______________________________'
            }
          ]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       5. AUP  — 3 pages matching خطاب_اجراءات_متفق_عليها
    ══════════════════════════════════════════════════════════ */
    {
      id: 'agreed-procedures',
      title: 'خطاب ارتباط — إجراءات متفق عليها',
      pages: [
        {
          rows: [
            {
              full: '<strong>خطاب ارتباط لمهمة تنفيذ إجراءات متفق عليها</strong>'
            },
            {
              full: 'طلبت شركة {{clientName}} تنفيذ مهمة إجراءات متفق عليها بشأن كميات خام رمل السيلكا عالى النسبة، المستغلة والمنتجة بواسطة شركة {{clientName}} من خلال مواقع الشركة لغرض تقديم نتائجه لوكالة الوزارة للثروة المعدنية. وإننا نرسل هذا الخطاب تأكيداً لفهمنا لشروط وأهدافها وطبيعة وحدود الخدمات التي سنقدمها. سنقوم بأداء مهمتنا وفقًا للمعيار الدولي للخدمات ذات الصلة 4400 (المعدل)، والمعتمدة في المملكة العربية السعودية. عند تنفيذ الإجراءات المتفق عليها، سوف نلتزم بالمعايير الدولية لأخلاقيات المحاسبين المحترفين الصادرة عن مجلس معايير الأخلاقيات الدولية للمحاسبين، والتي لا تتطلب منا أن نكون مستقلين.'
            },
            {
              full: 'تتضمن الإجراءات المتفق عليها والتي يتم تنفيذها بموجب المعيار الدولي 4400 (المعدل) تنفيذ الإجراءات المتفق عليها مع الشركة وإبلاغ النتائج في تقرير الإجراءات المتفق عليها. النتائج هي النتائج الحقيقية للإجراءات المتفق عليها التي تم تنفيذها. وتقر الشركة بأن الإجراءات مناسبة لغرض المهمة. نحن لا نقدم أي تمثيل فيما يتعلق بمدى ملاءمة الإجراءات. سيتم أداء الإجراءات المتفق عليها على أساس أن الشركة مسؤولة عن الموضوع الذي يتم تنفيذ الإجراءات المتفق عليها عليه. علاوة على ذلك، فإن الإجراءات التي سنقوم بها لن تشكل تدقيقاً أو مراجعة، وبالتالي لن يتم تقديم أي تأكيد.'
            },
            {
              full: 'الإجراءات التي سنقوم بتنفيذها هي فقط لغرض مساعدة الإدارة على تقديم نتائج الإجراءات التي قمنا بها لوكالة الوزارة للثروة المعدنية والخاص بالكميات المنتجة، والمستغلة، والمقابل المالي لها، من خام رمل السيلكا عالى النسبة من موقع الشركة، وذلك عن السنة المالية المنتهية في 31 ديسمبر {{year}}م. وبناءً على ذلك، سيتم توجيه تقريرنا إلى إدارة الشركة. لذلك قد لا يكون التقرير مناسبًا لأي غرض آخر.'
            }
          ]
        },
        {
          rows: [
            {
              full: '<strong>نطاق العمل</strong><ol><li>الحصول على بيان من الشركة يفيد بعدم وجود أى نتاج خلال الفترة حيث أنه مازال الموقع في مرحلة التجهيز.</li><li>مطابقة البيان بالإجراء (1) مع سجلات الشركة والقوائم المالية المعتمدة عن الفترة من 1 يناير {{year}}م حتى 31 ديسمبر {{year}}م.</li><li>الحصول على نموذج تقرير سنوي لحامل رخصة استغلال لكل الخامات من الشركة بالكميات المستغلة والمقابل المالي لها "التقرير".</li><li>مطابقة المقابل المالي للطن الواحد المستغل مع الرسوم المحددة من قبل وكالة الوزارة للثروة المعدنية وفقاً لشروط وأحكام منح رخصة الاستغلال والرسوم.</li></ol>'
            },
            {
              full: '<strong>تقرير الإجراءات المتفق عليها</strong><br>سنصدر تقريرنا الذي سيتم توجيهه إلى الشركة ويصف الإجراءات المتفق عليها ونتائج الإجراءات التي تم تنفيذها.'
            },
            {
              full: '<strong>أحكام عامة</strong><br>توفر شروطنا وأحكامنا العامة، المرفقة، مزيدًا من التفاصيل حول مسؤولياتنا، وتشكل، جنباً إلى جنب مع خطاب الارتباط هذا، الاتفاقية الكاملة بيننا فيما يتعلق بارتباطنا. في حالة وجود أي تعارض، تسود شروط خطاب المشاركة هذا.<br><br>أوراق العمل التي يتم إعدادها بالاشتراك مع عملنا هي ملك لمكتب الشلاحي محاسبون قانونيون، وتشكل معلومات سرية ومملوكة لنا وسوف نحتفظ بها وفقاً لسياساتنا وإجراءاتنا.<br><br>نتطلع إلى التعاون الكامل مع موظفيك ونثق في أنهم سيوفرون لنا أي سجلات ووثائق ومعلومات أخرى مطلوبة فيما يتعلق بمشاركتنا. في حال واجهنا أي صعوبات في الحصول على المعلومات التي قد تؤثر على قدرتنا على إبلاغك بالتقرير، فسوف نلفت انتباهك إلى هذه الصعوبات على الفور حتى يمكن حلها بسرعة.'
            }
          ]
        },
        {
          rows: [
            {
              full: '<strong>الأتعاب</strong><br>يتم احتساب أتعابنا على أساس الوقت المستغرق والمصروفات المتكبدة مع مراعاة درجة المسؤولية المتضمنة والخبرة والمهارة المطلوبة. نقدر إجمالي أتعابنا بمبلغ <span class="f" contenteditable="true" spellcheck="false">5,000</span> ريال سعودي (خمسة الآلاف ريال سعودي) غير شاملة ضريبة القيمة المضافة. يفترض هذا التقدير أننا سوف نتلقى المساعدة المناسبة من موظفيكم.<br><br>سنطلب ضمن ممارستنا دفعة مقدمة بنسبة 50% عند بدء عملنا و50% عند إصدار مسودة تقريرنا. سيتم إصدار فاتورة بالمصروفات التي يتم تحملها من جانبنا، إن وجدت، بشكل منفصل.'
            },
            {
              full: 'يعكس هذا الخطاب الاتفاق الكامل بين الشركة ومكتب الشلاحي محاسبون قانونيون فيما يتعلق بالخدمات الموضحة طيه ويحل محل أي مقترحات ومراسلات وتفاهمات سابقة سواء كانت مكتوبة أو شفهية. ستظل الاتفاقيات الواردة في هذه الوثيقة سارية بعد اكتمال أو إنهاء التعاقد موضوع هذه الرسالة.<br><br>سنكون ممتنين في حال قمتم بتأكيد موافقتكم على شروط تعاقدنا من خلال التوقيع على النسخة المرفقة من هذه الرسالة وإعادتها إلينا.<br><br>تفضلوا بقبول فائق الاحترام،<br>نيابةً عن الشلاحي محاسبون قانونيون<br><br><strong>خالد بن الحميدي الشلاحي</strong><br>محاسب قانوني<br>قيد سجل المحاسبين القانونيين رقم (538)<br><br>المرفقات: شروط عمل الشلاحي محاسبون قانونيون<br><br>نؤكد نحن شركة {{clientName}}<br><br>التوقيع: ______________________________________<br>التاريخ: ______________________________________<br>الاسم: ______________________________________<br>المسمى الوظيفي: ______________________________'
            }
          ]
        }
      ]
    }
  ];

  constructor(private http: HttpClient) {}
  ngOnInit(): void { this.loadClients(); }

  get filteredClients(): ClientLookup[] {
    if (!this.clientSearchTerm.trim()) return this.clients;
    const q = this.clientSearchTerm.toLowerCase();
    return this.clients.filter(c => c.name.toLowerCase().includes(q));
  }
  toggleClientDropdown(): void {
    this.isClientDropdownOpen = !this.isClientDropdownOpen;
    if (!this.isClientDropdownOpen) this.clientSearchTerm = '';
  }
  selectClient(client: ClientLookup): void {
    this.selectedClientId     = client.id;
    this.isClientDropdownOpen = false;
    this.clientSearchTerm     = '';
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.client-dd-wrap')) {
      this.isClientDropdownOpen = false;
      this.clientSearchTerm     = '';
    }
  }

  get selectedTemplate(): ContractTemplate {
    return this.contractTemplates.find(t => t.id === this.selectedTemplateId) || this.contractTemplates[0];
  }

  get displayedPages(): ContractPage[] {
    return this.selectedTemplate.pages;
  }
  get selectedClient(): ClientLookup | null {
    return this.clients.find(c => String(c.id) === String(this.selectedClientId)) || null;
  }
  get clientName(): string { return this.selectedClient?.name || '..............................'; }
  get year(): string {
    if (!this.contractDate) return new Date().getFullYear().toString();
    const d = new Date(this.contractDate);
    return isNaN(d.getTime()) ? new Date().getFullYear().toString() : String(d.getFullYear());
  }

  get contractDateAr(): string {
    if (!this.contractDate) return '';
    const parts = this.contractDate.split('-');
    if (parts.length === 3) {
      return this.toArabicDigits(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    return this.toArabicDigits(this.contractDate);
  }

  private toArabicDigits(value: string): string {
    const map = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(value).replace(/\d/g, digit => map[Number(digit)]);
  }

  private toArabicDigitsInHtmlText(value: string): string {
    return value
      .split(/(<[^>]*>)/g)
      .map(part => part.startsWith('<') ? part : this.toArabicDigits(part))
      .join('');
  }

  private fixArabicListsDirectionForPdf(html: string): string {
    if (!html) return '';

    return html.replace(/<(ol|ul)([^>]*)>([\s\S]*?)<\/\1>/gi, (_listMatch, tag, _attrs, content) => {
      let index = 0;
      const isOrdered = String(tag).toLowerCase() === 'ol';

      const items = String(content).replace(/<li([^>]*)>([\s\S]*?)<\/li>/gi, (_liMatch, _liAttrs, liContent) => {
        index++;
        const marker = isOrdered ? `${this.toArabicDigits(String(index))}.` : '•';

        return `<div class="pdf-ar-list-item"><span class="pdf-ar-list-marker">${marker}</span><span class="pdf-ar-list-text">${liContent}</span></div>`;
      });

      return `<div class="pdf-ar-list">${items}</div>`;
    });
  }
  private getTodayDate(): string { return new Date().toISOString().slice(0, 10); }

  private loadClients(): void {
    this.isClientsLoading = true;
    this.http.get<any>(`${this.baseUrl}api/Clients/Lookup?language=ar`).subscribe({
      next: (res) => {
        this.clients = this.normalizeClients(res);
        if (this.clients.length && !this.selectedClientId) this.selectedClientId = this.clients[0].id;
        this.isClientsLoading = false;
      },
      error: (err) => { console.error(err); this.clients = []; this.isClientsLoading = false; }
    });
  }
  private normalizeClients(res: any): ClientLookup[] {
    const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data :
                 Array.isArray(res?.items) ? res.items : Array.isArray(res?.result) ? res.result : [];
    return list.map((item: any) => ({
      id:   item.id   ?? item.value    ?? item.clientId ?? item.Id,
      name: item.name ?? item.text     ?? item.nameAr   ?? item.clientName ?? item.Name ?? ''
    })).filter((x: ClientLookup) => x.id !== undefined && x.name);
  }

  openDoc(templateId?: string): void {
    if (templateId) this.selectedTemplateId = templateId;
    this.isEditorOpen = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  showGallery(): void { this.isEditorOpen = false; window.scrollTo({ top: 0, behavior: 'smooth' }); }

applyVariables(value: string, isArabic = false): string {
  if (!value) return '';

  let replaced = value
    .replace(/\{\{clientName\}\}/g, this.clientName)
    .replace(/\{\{date\}\}/g, isArabic ? this.contractDateAr : (this.contractDate || ''))
    .replace(/\{\{year\}\}/g, isArabic ? this.toArabicDigits(this.year) : this.year);

  if (isArabic) {
    replaced = this.toArabicDigitsInHtmlText(replaced);
    replaced = this.fixArabicListsDirectionForPdf(replaced);
  }

  return replaced;
}

  handleSave(): void {
    const fields = document.querySelectorAll<HTMLElement>('.f');
    const data: string[] = [];
    fields.forEach(field => {
      const value = field.innerText.replace(/[.…]/g, '').trim();
      field.classList.toggle('ok', value.length > 0);
      data.push(field.innerText.trim());
    });
    localStorage.setItem('contractFields', JSON.stringify(data));
    alert('تم حفظ البيانات بنجاح');
  }

  async exportContractAsPdf(): Promise<void> {
    if (this.isExporting) return;
    this.isExporting = true;
    try {
      await this.waitForRender(300);
      const pages = document.querySelectorAll<HTMLElement>('.doc-page');
      if (!pages.length) { alert('لم يتم العثور على صفحات العقد'); return; }
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        page.classList.add('export-page');
        const canvas = await html2canvas(page, {
          scale: 4, useCORS: true, allowTaint: true, backgroundColor: '#ffffff',
          scrollX: 0, scrollY: 0, windowWidth: page.scrollWidth, windowHeight: page.scrollHeight
        });
        page.classList.remove('export-page');
        if (i > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, 210, 297);
      }
      const safeClient   = this.clientName.replace(/[\\/:*?"<>|]/g, '-');
      const safeTemplate = this.selectedTemplate.title.replace(/[\\/:*?"<>|]/g, '-');
      pdf.save(`${safeTemplate}-${safeClient}.pdf`);
    } catch (err) { console.error(err); alert('حدث خطأ أثناء تجهيز ملف PDF');
    } finally { this.isExporting = false; }
  }

  async exportContractAsImages(): Promise<void> {
    if (this.isExporting) return;
    this.isExporting = true;
    try {
      await this.waitForRender(300);
      const pages = document.querySelectorAll<HTMLElement>('.doc-page');
      if (!pages.length) { alert('لم يتم العثور على صفحات العقد'); return; }
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        page.classList.add('export-page');
        const canvas = await html2canvas(page, {
          scale: 4, useCORS: true, allowTaint: true, backgroundColor: '#ffffff',
          scrollX: 0, scrollY: 0, windowWidth: page.scrollWidth, windowHeight: page.scrollHeight
        });
        page.classList.remove('export-page');
        const link    = document.createElement('a');
        link.download = `${this.selectedTemplate.id}-page-${i + 1}.png`;
        link.href     = canvas.toDataURL('image/png', 1.0);
        link.click();
        await this.waitForRender(250);
      }
    } catch (err) { console.error(err); alert('حدث خطأ أثناء تجهيز الصور');
    } finally { this.isExporting = false; }
  }

  private waitForRender(delay = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}
