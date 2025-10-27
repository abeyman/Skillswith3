import React, { useMemo, useState } from "react";

// ---------------------------------------------
// SkillSwitch MVP — Single-file React prototype
// Tailwind CSS classes, no external UI libs
// ---------------------------------------------

const Button = ({ children, onClick, variant = "primary", className = "", ...props }) => {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium transition active:scale-[.98] focus:outline-none focus:ring";
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
  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-${color}-50 text-${color}-700`}>{children}</span>
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

// Fixed data - исправлены некорректные объекты
const employees = [
  { id: "e001", name: "Иван Петров", role: "Data Analyst", dept: "Маркетинг", skills: { SQL: 80, Tableau: 75, Python: 65 } },
  { id: "e002", name: "Анна Смирнова", role: "Product Manager", dept: "Продукт", skills: { Leadership: 60, UX: 70, Analytics: 65 } },
  { id: "e003", name: "Дмитрий Орлов", role: "ML Engineer", dept: "R&D", skills: { Python: 85, ML: 78, MLOps: 62 } },
  { id: "e004", name: "Елена Лебедева", role: "HRBP", dept: "HR", skills: { Communication: 88, Coaching: 72, Analytics: 40 } },
];

const gigs = [
  { id: "p101", title: "Аналитика клиентов", skills: ["SQL", "Tableau"], duration: "2 мес", load: "40%", desc: "Воронка, когортный анализ, LTV." },
  { id: "p102", title: "HR-AI MVP", skills: ["ML", "UX"], duration: "3 мес", load: "20%", desc: "Прототип ассистента для HR-процессов." },
  { id: "p103", title: "Автоматизация отчётности", skills: ["Python", "SQL"], duration: "1 мес", load: "30%", desc: "Сбор и публикация метрик в дашборде." },
];

const plans = [
  { id: "pilot", name: "Pilot", price: "0 €", desc: "Бесплатно 3 месяца для 300 сотрудников", features: ["Основные функции", "Быстрый старт"] },
  { id: "growth", name: "Growth", price: "3 €/сотр/мес", desc: "Полный функционал для средних компаний", features: ["Основные функции", "Персонификация стоимости"] },
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
  const [modal, setModal] = useState({ type: null, payload: null });
  const [toast, setToast] = useState("");
  const [importedCount, setImportedCount] = useState(0);
  const [headcount, setHeadcount] = useState(300);

  const showToast = (t) => { setToast(t); setTimeout(() => setToast(""), 2000); };

  const monthly = useMemo(() => Math.max(0, Math.round(headcount * 3)), [headcount]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Topbar onNav={setScreen} />

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {screen === screens.LANDING && (
          <Landing onGetStarted={() => setScreen(screens.ONBOARD)} onOpenPricing={() => setScreen(screens.PRICING)} />
        )}
        {screen === screens.ONBOARD && (
          <Onboard
            importedCount={importedCount}
            onImportHRIS={() => setModal({ type: "hris" })}
            onImportCSV={() => setModal({ type: "csv" })}
            onBuildGraph={() => setScreen(screens.GRAPH)}
            onSkip={() => setScreen(screens.GRAPH)}
          />
        )}
        {screen === screens.GRAPH && (
          <Graph
            employees={employees}
            onOpenGigs={() => setScreen(screens.GIGS)}
            onOpenDash={() => setScreen(screens.DASH)}
          />
        )}
        {screen === screens.GIGS && (
          <Gigs
            gigs={gigs}
            onApply={(p) => setModal({ type: "applied", payload: p })}
            onCreate={() => setModal({ type: "create-gig" })}
            onPublish={() => setModal({ type: "publish" })}
          />
        )}
        {screen === screens.DASH && (
          <Dash onOpenPaths={() => setModal({ type: "path" })} />
        )}
        {screen === screens.PRICING && (
          <Pricing
            plans={plans}
            headcount={headcount}
            onHeadcount={setHeadcount}
            onTry={() => setToast("Запрос на демо отправлен")}
            onContact={() => setToast("Мы свяжемся с вами")}
          />
        )}
        {screen === screens.PROFILE && (
          <Profile employee={employees[0]} onCourse={() => {}} onProjects={() => {}} onPath={() => setModal({ type: "path" })} />
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">{toast}</div>
      )}

      {/* Modals */}
      <Modal
        open={modal.type === "hris"}
        onClose={() => setModal({ type: null })}
        title="Выберите HR-систему"
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
        title="AI Рекомендации"
        actions={<Button onClick={() => setModal({ type: null })}>Закрыть</Button>}
      >
        <div className="space-y-3 text-sm">
          <div>• Ивану: курс «Advanced SQL», проект «Автоматизация отчётности»</div>
          <div>• Анне: курс «Product Analytics 101», проект «Аналитика клиентов»</div>
          <div>• Дмитрию: «MLOps Basics», наставничество</div>
        </div>
      </Modal>

      <Modal
        open={modal.type === "csv"}
        onClose={() => setModal({ type: null })}
        title="Загрузка CSV"
        actions={<>
          <Button variant="secondary" onClick={() => setModal({ type: null })}>Отмена</Button>
          <Button onClick={() => { setModal({ type: null }); showToast("Загружено 300 сотрудников"); }}>Загрузить</Button>
        </>}
      >
        <div className="text-sm text-slate-600">Выберите CSV-файл с колонками: name, role, dept, skills.</div>
      </Modal>

      <Modal
        open={modal.type === "publish"}
        onClose={() => setModal({ type: null })}
        title="Публикация проектов"
        actions={<Button onClick={() => { setModal({ type: null }); showToast("Опубликовано"); }}>Опубликовать</Button>}
      >
        <div className="space-y-2 text-sm">
          <div>3 проекта готовы к публикации</div>
          <ul className="list-disc pl-5">
            {gigs.map(g => (<li key={g.id}>{g.title}</li>))}
          </ul>
        </div>
      </Modal>

      <Modal
        open={modal.type === "create-gig"}
        onClose={() => setModal({ type: null })}
        title="Новый проект"
        actions={<>
          <Button variant="secondary" onClick={() => setModal({ type: null })}>Отмена</Button>
          <Button onClick={() => { setModal({ type: null }); showToast("Проект создан"); }}>Создать</Button>
        </>}
      >
        <form className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Название</label>
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Например, «Дашборд по продажам»" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Навыки</label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="SQL, Python, Tableau" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Длительность</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2"><option>1 мес</option><option>2 мес</option><option>3 мес</option></select>
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
          <div className="flex items-center justify-end">
            <Button onClick={(e) => { e.preventDefault(); setModal({ type: null }); }}>Опубликовать</Button>
          </div>
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
        open={modal.type === "path"}
        onClose={() => setModal({ type: null })}
        title="Карьерный путь"
        actions={<Button onClick={() => setModal({ type: null })}>Закрыть</Button>}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2"><Pill>Data Analyst</Pill> → <Pill>Product Analyst</Pill> → <Pill>Analytics Lead</Pill></div>
          <div className="text-sm text-slate-600">Рекомендуемые шаги: курс по продуктовой аналитике, участие в проекте по продуктовой аналитике, менторство.</div>
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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold">SS</div>
          <div className="text-lg font-semibold">SkillSwitch</div>
        </div>
        <nav className="flex items-center gap-1">
          <Button variant="ghost" onClick={() => onNav("landing")}>Главная</Button>
          <Button variant="ghost" onClick={() => onNav("onboard")}>Онбординг</Button>
          <Button variant="ghost" onClick={() => onNav("graph")}>Graph</Button>
          <Button variant="ghost" onClick={() => onNav("gigs")}>Проекты</Button>
          <Button variant="ghost" onClick={() => onNav("dash")}>Дашборд</Button>
          <Button variant="ghost" onClick={() => onNav("pricing")}>Тарифы</Button>
          <Button variant="ghost" onClick={() => onNav("profile")}>Профиль</Button>
        </nav>
      </div>
    </header>
  );
}

function Landing({ onGetStarted, onOpenPricing }) {
  return (
    <section className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[1.3fr_.7fr]">
        <Card>
          <h1 className="text-3xl font-bold">Skill Graph & Project-Gigs</h1>
          <p className="mt-2 text-slate-600">Платформа для управления навыками и внутренними проектами.</p>
          <div className="mt-4 flex gap-3">
            <Button onClick={onGetStarted}>Начать</Button>
            <Button variant="secondary" onClick={onOpenPricing}>Тарифы</Button>
          </div>
        </Card>
        <Card title="Быстрые метрики">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Сотр.", value: 300 },
              { label: "Навыков", value: 120 },
              { label: "Проектов", value: 8 },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-slate-100 p-4 text-center">
                <div className="text-2xl font-bold">{m.value}</div>
                <div className="text-xs text-slate-500">{m.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

function Onboard({ importedCount, onImportHRIS, onImportCSV, onBuildGraph, onSkip }) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Онбординг / Импорт данных</h2>
      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="text-sm text-slate-600">Начнём работу — импортируйте сотрудников из HR-системы или CSV.</div>
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

function Graph({ employees, onOpenGigs, onOpenDash }) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Skill Graph</h2>
      <Card>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-slate-600">Сотрудники и их ключевые навыки.</div>
            <ul className="mt-3 space-y-2 text-sm">
              {employees.map((e) => (
                <li key={e.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{e.name}</div>
                    <div className="text-slate-500">{e.role} · {e.dept}</div>
                  </div>
                  <div className="flex gap-2">
                    {Object.keys(e.skills).slice(0, 3).map((s) => (
                      <Pill key={s}>{s}: {e.skills[s]}</Pill>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <Button onClick={onOpenGigs}>К проектам</Button>
              <Button variant="secondary" onClick={onOpenDash}>К дашборду</Button>
            </div>
          </div>
          <div className="rounded-xl bg-slate-100 p-4 text-sm text-slate-700">
            <div>Здесь могла быть ваша визуализация графа :)</div>
          </div>
        </div>
      </Card>
    </section>
  );
}

function Dash({ onOpenPaths }) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Дашборд (HR)</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Подбор под проекты">
          <div className="text-sm text-slate-600">AI-подбор сотрудников под открытые проектные роли</div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-xl bg-slate-100 p-4">
              <div className="font-medium">CRM-внедрение — Analyst</div>
              <div className="text-slate-500">Иван Петров (SQL 80, Tableau 75)</div>
            </div>
            <div className="rounded-xl bg-slate-100 p-4">
              <div className="font-medium">HR-AI MVP — UX</div>
              <div className="text-slate-500">Анна Смирнова (UX 70)</div>
            </div>
          </div>
        </Card>
        <Card title="Learning">
          <ul className="space-y-3 text-sm">
            <li>
              <div className="font-medium">Назначить проект «CRM-внедрение» Ивану Петрову</div>
              <div className="text-slate-500">SQL, Tableau, 40% загрузки</div>
            </li>
            <li>
              <div className="font-medium">Рекомендовано обучение: «Data-Driven Leadership»</div>
              <div className="text-slate-500">6 ч · edX</div>
            </li>
            <li>
              <div className="font-medium">Внутренняя ротация: Анна → Product Analytics</div>
              <div className="text-slate-500">3 месяца</div>
            </li>
          </ul>
          <div className="mt-4"><Button variant="ghost" onClick={onOpenPaths}>Карьерные пути</Button></div>
        </Card>
        <Card title="Софт / Интеграции">
          <div className="grid grid-cols-2 gap-3">
            {[{ name: 'Workday', vendor: 'HRIS' }, { name: 'Okta', vendor: 'SSO' }, { name: 'Tableau', vendor: 'BI' }, { name: 'Slack', vendor: 'Comm' }].map((c) => (
              <Card key={c.name} className="cursor-default">
                <div className="font-medium">{c.name}</div>
                <span>{c.vendor}</span>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

function Gigs({ gigs, onApply, onCreate, onPublish }) {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold">Project-Gigs / Внутренние проекты</h2>
        <div className="flex gap-2">
          <Button onClick={onCreate}>Создать проект</Button>
          <Button variant="secondary" onClick={onPublish}>Опубликовать</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {gigs.map((g) => (
          <Card key={g.id}>
            <div className="text-lg font-semibold">{g.title}</div>
            <div className="mt-1 text-sm text-slate-600">{g.desc}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {g.skills.map((s) => (<Pill key={s}>{s}</Pill>))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => onApply(g)}>Откликнуться</Button>
              <Button variant="secondary">Подробнее</Button>
            </div>
          </Card>
        ))}
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
              {p.features.map((f) => (<li key={f}>{f}</li>))}</ul>
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
      <h2 className="text-2xl font-bold">Профиль сотрудника</h2>
      <Card>
        <div className="grid gap-4 md:grid-cols-[1fr_.9fr]">
          <div>
            <div className="text-lg font-semibold">{employee.name}</div>
            <div className="text-slate-500">{employee.role} · {employee.dept}</div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {Object.entries(employee.skills).map(([k,v]) => (
                <div key={k} className="rounded-xl bg-slate-100 p-3 text-sm"><span className="font-medium">{k}</span>: {v}</div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={onCourse}>Курс</Button>
              <Button variant="secondary" onClick={onProjects}>Проекты</Button>
              <Button variant="ghost" onClick={onPath}>Карьерный путь</Button>
            </div>
          </div>
          <div className="rounded-xl bg-slate-100 p-4 text-sm text-slate-700">
            <div className="text-sm font-medium">Рекомендации AI</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                <li>Пройти курс «Data Visualization»</li>
                <li>Участие в проекте «HR Analytics»</li>
                <li>Менторская сессия по Leadership</li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
}
