import React, { useMemo, useState } from "react";

// ---------------------------------------------
// SkillSwitch MVP — Single-file React prototype
// Tailwind CSS classes, no external UI libs
// ---------------------------------------------

const Button = ({ children, onClick, variant = "primary", className = "", ...props }) => {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[.98] focus:outline-none focus:ring";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",
    secondary: "border border-slate-300 text-slate-800 hover:bg-slate-100",
    ghost: "text-blue-700 hover:bg-blue-50",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-300",
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ title, children, footer, className = "" }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
    {title && <div className="px-5 pt-5 text-lg font-semibold text-slate-900">{title}</div>}
    <div className={`px-5 ${title ? "pt-3" : "pt-5"} pb-5`}>{children}</div>
    {footer && <div className="border-t border-slate-100 px-5 py-3">{footer}</div>}
  </div>
);

const Badge = ({ children, color = "blue" }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-${color}-50 text-${color}-700`}>{children}</span>
);

// Util: simple pill
const Pill = ({ children }) => (
  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{children}</span>
);

// Modals
const Modal = ({ open, onClose, title, children, actions }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>✕</button>
        </div>
        <div className="max-h-[60vh] overflow-auto px-5 py-4 text-slate-700">{children}</div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">{actions}</div>
      </div>
    </div>
  );
};

// Fake data
const employees = [
  { id: "e001", name: "Иван Петров", role: "Data Analyst", dept: "Маркетинг", skills: { SQL: 80, Tableau: 75, Python: 65 } },
  { id: "e002", name: "Анна Смирнова", role: "Product Manager", dept: "Продукт", skills: { Leadership: 60, UX: 70, Analytics: 65 } },
  { id: "e003", name: "Дмитрий Орлов", role: "ML Engineer", dept: "R&D", skills: { Python: 85, ML: 78, MLOps: 62 } },
  { id: "e004", name: "Елена Лебедева", role: "HRBP", dept: "HR", skills: { Communication: 88, Coaching: 72, Analytics: 40 } },
];

const gigs = [
  { id: "p101", title: "Аналитика клиентов", skills: ["SQL", "Tableau"], duration: "2 мес", load: "40%", desc: "Воронка, когортный анализ, LTV." },
  { id: "p102", title: "HR‑AI MVP", skills: ["ML", "UX"], duration: "1 мес", load: "20%", desc: "Прототип ассистента для HR‑процессов." },
  { id: "p103", title: "Автоматизация отчётности", skills: ["Python", "ETL"], duration: "6 недель", load: "30%", desc: "Сбор и публикация метрик в дашборде." },
];

const plans = [
  { id: "pilot", name: "Pilot", price: "0 €", desc: "Бесплатно 30 дней, до 300 сотрудников", features: ["Основные функции", "Быстрый старт"] },
  { id: "growth", name: "Growth", price: "3 €/сотр/мес", desc: "Подходит для компаний от 300 сотрудников", features: ["Основные функции", "Персонификация стоимости"] },
  { id: "ent", name: "Enterprise", price: "Индивидуально", desc: "SSO, SLA, кастомные интеграции", features: ["SSO", "SLA", "Интеграции"] },
];

// Screens enum
const screens = {
  LANDING: "landing",
  ONBOARD: "onboard",
  GRAPH: "graph",
  GIGS: "gigs",
  DASH: "dash",
  PRICING: "pricing",
  PROFILE: "profile",
};

export default function SkillSwitchMVP() {
  const [screen, setScreen] = useState(screens.LANDING);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState({ type: null, payload: null });
  const [importedCount, setImportedCount] = useState(0);
  const [selectedEmp, setSelectedEmp] = useState(employees[0]);
  const [calcHeadcount, setCalcHeadcount] = useState(500);

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(null), 1800);
  };

  const kpis = useMemo(() => (
    [
      { label: "Активные сотрудники", value: 245 },
      { label: "Запущенные проекты", value: 12 },
      { label: "Принято AI‑рекомендаций", value: "58%" },
      { label: "Вовлечённость", value: "72%" },
    ]
  ), []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Topbar onNav={setScreen} />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-8">
        {screen === screens.LANDING && (
          <Landing onTry={() => setScreen(screens.ONBOARD)} onDemo={() => setScreen(screens.ONBOARD)} />
        )}
        {screen === screens.ONBOARD && (
          <Onboarding
            onImportCSV={() => {
              setImportedCount(256);
              showToast("Успешно импортировано 256 сотрудников");
            }}
            onImportHRIS={() => setModal({ type: "hris" })}
            onBuildGraph={() => setScreen(screens.GRAPH)}
            onSkip={() => setScreen(screens.GRAPH)}
            importedCount={importedCount}
          />
        )}
        {screen === screens.GRAPH && (
          <Graph
            employees={employees}
            onAI={() => setModal({ type: "ai" })}
            onCreateProject={() => setModal({ type: "create_project" })}
            onOpenGigs={() => setScreen(screens.GIGS)}
            onOpenProfile={(e) => {
              setSelectedEmp(e);
              setScreen(screens.PROFILE);
            }}
            onOpenPaths={() => setScreen(screens.PROFILE)}
          />
        )}
        {screen === screens.GIGS && (
          <Gigs
            gigs={gigs}
            onApply={(p) => setModal({ type: "applied", payload: p })}
            onCreate={() => setModal({ type: "create_project" })}
            onPublish={() => {
              showToast("Проект опубликован");
              setScreen(screens.DASH);
            }}
          />
        )}
        {screen === screens.DASH && (
          <Dashboard kpis={kpis} onWeekly={() => setModal({ type: "report" })} onExport={() => setModal({ type: "export" })} onPricing={() => setScreen(screens.PRICING)} />
        )}
        {screen === screens.PRICING && (
          <Pricing
            plans={plans}
            headcount={calcHeadcount}
            onHeadcount={(n) => setCalcHeadcount(n)}
            onTry={() => setScreen(screens.ONBOARD)}
            onContact={() => setModal({ type: "contact" })}
          />
        )}
        {screen === screens.PROFILE && (
          <Profile employee={selectedEmp} onCourse={() => setModal({ type: "courses" })} onProjects={() => setScreen(screens.GIGS)} onPath={() => setModal({ type: "path" })} />
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">{toast}</div>
      )}

      {/* Modals */}
      <Modal
        open={modal.type === "hris"}
        onClose={() => setModal({ type: null })}
        title="Выберите HR‑систему"
        actions={<>
          <Button variant="secondary" onClick={() => setModal({ type: null })}>Отмена</Button>
          <Button onClick={() => { setModal({ type: null }); showToast("HRIS подключена"); }}>Подключить</Button>
        </>}
      >
        <div className="grid grid-cols-2 gap-3">
          {['Workday','SAP','BambooHR','Greenhouse','Personio','Oracle HCM'].map(x => (
            <Card key={x} className="cursor-pointer hover:shadow-md">
              <div className="text-sm font-medium">{x}</div>
              <div className="mt-1 text-xs text-slate-500">OAuth / API</div>
            </Card>
          ))}
        </div>
      </Modal>

      <Modal
        open={modal.type === "ai"}
        onClose={() => setModal({ type: null })}
        title="Рекомендации AI — шаги на 30 дней"
        actions={<>
          <Button variant="secondary" onClick={() => setModal({ type: null })}>Закрыть</Button>
          <Button variant="success" onClick={() => { setModal({ type: null }); showToast("Рекомендации применены"); }}>Применить</Button>
        </>}
      >
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" defaultChecked />
            <div>
              <div className="font-medium">Пройти курс «Data Visualization»</div>
              <div className="text-sm text-slate-500">10 часов, Coursera</div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <div>
              <div className="font-medium">Участвовать в проекте «HR Analytics»</div>
              <div className="text-sm text-slate-500">20% загрузки, 6 недель</div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <div>
              <div className="font-medium">Менторская сессия по Leadership</div>
              <div className="text-sm text-slate-500">2 встречи по 60 минут</div>
            </div>
          </li>
        </ul>
      </Modal>

      <Modal
        open={modal.type === "create_project"}
        onClose={() => setModal({ type: null })}
        title="Создать Project‑Gig"
        actions={<>
          <Button variant="secondary" onClick={() => setModal({ type: null })}>Отмена</Button>
          <Button onClick={() => { setModal({ type: null }); showToast("Черновик проекта создан"); }}>Сохранить черновик</Button>
        </>}
      >
        <form className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Название</label>
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Например: Автоматизация отчётности" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Навыки</label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Python, ETL" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Длительность</label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="6 недель" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Загрузка</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2"><option>20%</option><option>30%</option><option>40%</option><option>60%</option></select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Отдел</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2"><option>Маркетинг</option><option>Продукт</option><option>R&D</option><option>HR</option></select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Описание</label>
            <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2" rows={3} placeholder="Кратко опиши цели и ожидания" />
          </div>
          <div className="flex items-center justify-end"><Button variant="success" onClick={(e)=>{e.preventDefault(); setModal({ type: null });}}>Опубликовать</Button></div>
        </form>
      </Modal>

      <Modal
        open={modal.type === "applied"}
        onClose={() => setModal({ type: null })}
        title="Отклик отправлен"
        actions={<Button onClick={() => setModal({ type: null })}>Ок</Button>}
      >
        <div className="text-sm">Заявка на участие в проекте «{modal.payload?.title}» отправлена HR.</div>
      </Modal>

      <Modal
        open={modal.type === "report"}
        onClose={() => setModal({ type: null })}
        title="Еженедельный отчёт"
        actions={<Button onClick={() => setModal({ type: null })}>Скачать PDF</Button>}
      >
        <div className="space-y-3 text-sm">
          <div>— Запущенные проекты: 12 → 14</div>
          <div>— Вовлечённость: 72% → 74%</div>
          <div>— Закрытые вакансии внутренним наймом: 4</div>
        </div>
      </Modal>

      <Modal
        open={modal.type === "export"}
        onClose={() => setModal({ type: null })}
        title="Экспорт данных"
        actions={<>
          <Button variant="secondary" onClick={() => setModal({ type: null })}>Отмена</Button>
          <Button onClick={() => { setModal({ type: null }); showToast("Экспорт начат")}}>Скачать</Button>
        </>}
      >
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm"><input type="radio" name="export" defaultChecked/> CSV</label>
          <label className="inline-flex items-center gap-2 text-sm"><input type="radio" name="export"/> PNG</label>
        </div>
      </Modal>

      <Modal
        open={modal.type === "contact"}
        onClose={() => setModal({ type: null })}
        title="Связаться с менеджером"
        actions={<Button onClick={() => { setModal({ type: null }); showToast("Заявка отправлена")}}>Отправить</Button>}
      >
        <div className="grid grid-cols-2 gap-4">
          <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Имя" />
          <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Email" />
          <input className="col-span-2 rounded-lg border border-slate-300 px-3 py-2" placeholder="Компания" />
          <textarea className="col-span-2 rounded-lg border border-slate-300 px-3 py-2" rows={3} placeholder="Кратко опишите запрос" />
        </div>
      </Modal>

      <Modal
        open={modal.type === "courses"}
        onClose={() => setModal({ type: null })}
        title="Курсы для развития навыков"
        actions={<Button onClick={() => setModal({ type: null })}>Готово</Button>}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { id: "c301", title: "Data Visualization", skill: "Data Analysis", time: "10 ч", vendor: "Coursera" },
            { id: "c302", title: "SQL Advanced", skill: "SQL", time: "8 ч", vendor: "Udemy" },
            { id: "c303", title: "Leadership Basics", skill: "Leadership", time: "6 ч", vendor: "edX" },
          ].map((c) => (
            <Card key={c.id} title={c.title} footer={<Button variant="ghost">Открыть</Button>}>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Pill>{c.skill}</Pill>
                <span>·</span>
                <span>{c.time}</span>
                <span>·</span>
                <span>{c.vendor}</span>
              </div>
            </Card>
          ))}
        </div>
      </Modal>

      <Modal
        open={modal.type === "path"}
        onClose={() => setModal({ type: null })}
        title="Карьерный путь"
        actions={<Button onClick={() => setModal({ type: null })}>Закрыть</Button>}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2"><Pill>Data Analyst</Pill> → <Pill>Product Analyst</Pill> → <Pill>Analytics Lead</Pill></div>
          <div className="text-sm text-slate-600">Рекомендуемые шаги: курс по коммуникациям, участие в проекте по продуктовой аналитике, менторство.</div>
        </div>
      </Modal>
    </div>
  );
}

// --------------------------- Components ---------------------------
function Topbar({ onNav }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold">SS</div>
          <div className="text-lg font-semibold">SkillSwitch</div>
        </div>
        <nav className="hidden gap-2 md:flex">
          <Button variant="ghost" onClick={() => onNav("landing")}>Главная</Button>
          <Button variant="ghost" onClick={() => onNav("onboard")}>Импорт</Button>
          <Button variant="ghost" onClick={() => onNav("graph")}>Граф навыков</Button>
          <Button variant="ghost" onClick={() => onNav("gigs")}>Проекты</Button>
          <Button variant="ghost" onClick={() => onNav("dash")}>Дашборд</Button>
          <Button variant="ghost" onClick={() => onNav("pricing")}>Тарифы</Button>
        </nav>
      </div>
    </header>
  );
}

function Landing({ onTry, onDemo }) {
  return (
    <section>
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold leading-tight">AI‑платформа для развития и внутренней мобильности сотрудников</h1>
          <p className="mt-4 text-lg text-slate-600">Единый профиль навыков, сопоставление с задачами и вакансиями, AI‑сопровождение карьеры и запуск внутренних ротаций.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={onTry}>Попробовать бесплатно</Button>
            <Button variant="secondary" onClick={onDemo}>Посмотреть демо</Button>
          </div>
          <div className="mt-6 flex gap-2 text-sm text-slate-500">
            <Pill>GDPR‑ready</Pill><Pill>Без IT‑разработки</Pill><Pill>Project‑gigs</Pill>
          </div>
        </div>
        <Card className="md:translate-y-2">
          <div className="grid grid-cols-3 gap-3">
            {[
              { t: "AI‑сопровождение", d: "Рекомендации роста" },
              { t: "Граф навыков", d: "Поиск экспертизы" },
              { t: "Project‑gigs", d: "Временные роли" },
            ].map((x, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold">{x.t}</div>
                <div className="text-xs text-slate-500">{x.d}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-slate-500">Кликайте по кнопкам — всё интерактивно.</div>
        </Card>
      </div>
    </section>
  );
}

function Onboarding({ onImportCSV, onImportHRIS, onBuildGraph, onSkip, importedCount }) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Онбординг / Импорт данных</h2>
      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="text-sm text-slate-600">Начнём работу — импортируйте сотрудников из HR‑системы или CSV.</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Button onClick={onImportHRIS}>Импорт из HRIS</Button>
              <Button variant="secondary" onClick={onImportCSV}>Загрузить CSV</Button>
            </div>
            <div className="mt-5 flex items-center gap-3 text-sm">
              <Button variant="ghost" onClick={onSkip}>Пропустить и продолжить демо</Button>
              {importedCount > 0 && <span className="text-emerald-600">Успешно импортировано: {importedCount}</span>}
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-4 text-white">
            <div className="text-sm opacity-90">Шаг 1 из 4</div>
            <div className="mt-1 text-lg font-semibold">Импорт данных</div>
            <div className="mt-4 h-2 rounded-full bg-white/30">
              <div className="h-2 w-1/4 rounded-full bg-white" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onBuildGraph}>Построить граф навыков</Button>
        </div>
      </Card>
    </section>
  );
}

function Graph({ employees, onAI, onCreateProject, onOpenGigs, onOpenProfile, onOpenPaths }) {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold">Граф навыков сотрудников</h2>
        <div className="flex gap-2">
          <Button onClick={onAI}>Рекомендации AI</Button>
          <Button variant="secondary" onClick={onCreateProject}>Создать проект</Button>
          <Button variant="ghost" onClick={onOpenGigs}>Посмотреть вакансии</Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-[280px_1fr_320px]">
        <Card title="Фильтры">
          <div className="space-y-3 text-sm">
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Поиск по навыкам" />
            <select className="w-full rounded-lg border border-slate-300 px-3 py-2"><option>Отдел</option><option>Маркетинг</option><option>Продукт</option><option>R&D</option><option>HR</option></select>
            <select className="w-full rounded-lg border border-slate-300 px-3 py-2"><option>Роль</option><option>Analyst</option><option>Engineer</option><option>Manager</option></select>
            <select className="w-full rounded-lg border border-slate-300 px-3 py-2"><option>Уровень навыка</option><option>40+</option><option>60+</option><option>80+</option></select>
          </div>
        </Card>
        <Card title="Визуализация">
          <div className="grid grid-cols-3 gap-4">
            {employees.map((e) => (
              <button key={e.id} onClick={() => onOpenProfile(e)} className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{e.name}</div>
                  <span className="text-xs text-slate-500">{e.dept}</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">{e.role}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(e.skills).slice(0,3).map(([k,v]) => (
                    <span key={k} className="rounded-md bg-white px-2 py-1 text-xs shadow-sm">{k} · {v}</span>
                  ))}
                </div>
                <div className="mt-4 h-1.5 w-full rounded-full bg-slate-200">
                  <div className="h-1.5 rounded-full bg-blue-600 transition-all group-hover:w-5/6 w-2/3" />
                </div>
              </button>
            ))}
          </div>
        </Card>
        <Card title="Панель рекомендаций">
          <ul className="space-y-3 text-sm">
            <li>
              <div className="font-medium">Назначить проект «CRM‑внедрение» Ивану Петрову</div>
              <div className="text-slate-500">SQL, Tableau, 40% загрузки</div>
            </li>
            <li>
              <div className="font-medium">Рекомендовано обучение: «Data‑Driven Leadership»</div>
              <div className="text-slate-500">6 ч · edX</div>
            </li>
            <li>
              <div className="font-medium">Внутренняя ротация: Анна → Product Analytics</div>
              <div className="text-slate-500">3 месяца</div>
            </li>
          </ul>
          <div className="mt-4"><Button variant="ghost" onClick={onOpenPaths}>Карьерные пути</Button></div>
        </Card>
      </div>
    </section>
  );
}

function Gigs({ gigs, onApply, onCreate, onPublish }) {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold">Project‑Gigs / Внутренние проекты</h2>
        <div className="flex gap-2">
          <Button onClick={onCreate}>Создать проект</Button>
          <Button variant="secondary" onClick={onPublish}>Опубликовать</Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gigs.map((p) => (
          <Card key={p.id} title={p.title} footer={
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500">{p.duration} · {p.load}</div>
              <Button onClick={() => onApply(p)} variant="success">Откликнуться</Button>
            </div>
          }>
            <div className="flex flex-wrap gap-2">
              {p.skills.map((s) => (<Pill key={s}>{s}</Pill>))}
            </div>
            <p className="mt-3 text-sm text-slate-600">{p.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Dashboard({ kpis, onWeekly, onExport, onPricing }) {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold">HR‑Dashboard / Мониторинг</h2>
        <div className="flex gap-2">
          <Button onClick={onWeekly}>Еженедельный отчёт</Button>
          <Button variant="secondary" onClick={onExport}>Экспорт данных</Button>
          <Button variant="ghost" onClick={onPricing}>Тарифы</Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <div className="text-3xl font-bold">{k.value}</div>
            <div className="mt-1 text-sm text-slate-600">{k.label}</div>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Рост навыков">
          <div className="h-28 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50"></div>
        </Card>
        <Card title="Заполнение позиций">
          <div className="h-28 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50"></div>
        </Card>
        <Card title="Участие в проектах">
          <div className="h-28 rounded-xl bg-gradient-to-r from-violet-50 to-fuchsia-50"></div>
        </Card>
      </div>
    </section>
  );
}

function Pricing({ plans, headcount, onHeadcount, onTry, onContact }) {
  const monthly = Math.max(0, Math.round(headcount * 3));
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Тарифы</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.id} className={p.id === "growth" ? "ring-2 ring-blue-600" : ""}>
            <div className="flex items-baseline justify-between">
              <div className="text-lg font-semibold">{p.name}</div>
              <div className="text-sm text-slate-500">{p.price}</div>
            </div>
            <div className="mt-1 text-sm text-slate-600">{p.desc}</div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {p.features.map((f) => (<li key={f}>{f}</li>))}              {p.features.map((f) => (<li key={f}>{f}</li>))}\ul>
            <div className="mt-4 flex gap-2">
              {p.id === "pilot" && <Button onClick={onTry}>Попробовать бесплатно</Button>}
              {p.id === "growth" && <Button onClick={onTry}>Рассчитать стоимость</Button>}
              {p.id === "ent" && <Button onClick={onContact}>Связаться с менеджером</Button>}
            </div>
          </Card>
        ))}
      </div>
      <Card title="Калькулятор стоимости (Growth)">
        <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
          <div>
            <input type="range" min={300} max={5000} value={headcount} onChange={(e)=>onHeadcount(parseInt(e.target.value))} className="w-full" />
            <div className="mt-2 text-sm text-slate-600">Количество сотрудников: <span className="font-semibold">{headcount}</span></div>
          </div>
          <div className="rounded-xl bg-slate-100 p-4 text-center">
            <div className="text-xs text-slate-500">Итого (оценка)</div>
            <div className="text-2xl font-bold">≈ {monthly} € / мес</div>
          </div>
        </div>
      </Card>
    </section>
  );
}

function Profile({ employee, onCourse, onProjects, onPath }) {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold">Профиль сотрудника</h2>
        <div className="flex gap-2">
          <Button onClick={onCourse}>Развить навык</Button>
          <Button variant="secondary" onClick={onProjects}>Посмотреть проекты</Button>
          <Button variant="ghost" onClick={onPath}>Построить карьерный путь</Button>
        </div>
      </div>
      <Card>
        <div className="grid items-start gap-6 md:grid-cols-[220px_1fr]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-24 w-24 rounded-2xl bg-slate-200" />
            <div className="text-lg font-semibold">{employee.name}</div>
            <div className="text-sm text-slate-600">{employee.role} · {employee.dept}</div>
          </div>
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(employee.skills).map(([skill, val]) => (
                <div key={skill}>
                  <div className="flex items-center justify-between text-sm"><span className="font-medium">{skill}</span><span className="text-slate-500">{val}</span></div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: `${val}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="text-sm font-medium">Рекомендации AI</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                <li>Пройти курс «Data Visualization»</li>
                <li>Участие в проекте «HR Analytics»</li>
                <li>Менторская сессия по Leadership</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
