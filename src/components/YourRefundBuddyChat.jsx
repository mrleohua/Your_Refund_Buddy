import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Trash2, BookOpen, HelpCircle, Info, Link as LinkIcon, FileDown, ShieldCheck } from "lucide-react";

/**
 * Your Refund Buddy — Australian Tax Deduction Helper
 * General info only — not tax/financial advice.
 * Rules reference ATO + H&R Block AU deduction guide.
 */

const KB = [
  {
    id: "work_clothing",
    title: "Clothing & Laundry",
    match: [/uniform/i, /hi[- ]?vis/i, /steel[- ]?cap/i, /protective/i, /logo/i, /laundry/i, /dry\s?clean/i],
    summary:
      "Occupation‑specific, protective, or compulsory uniforms (and their cleaning) are generally deductible. Conventional clothing is not.",
    caveats: [
      "Laundry claims should be reasonable. Keep simple records; small amounts may not need receipts but evidence is best.",
    ],
    links: [
      { label: "ATO: Clothing & laundry", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/occupation-and-industry-specific-guides/clothing-laundry-and-dry-cleaning-expenses" },
      { label: "H&R Block: Deduction guide", url: "https://www.hrblock.com.au/tax-academy/guide-tax-deductions-in-australia" },
    ],
  },
  {
    id: "home_office",
    title: "Working from Home",
    match: [/work(ing)? from home/i, /home\s*office/i, /WFH/i, /telework/i, /remote/i, /electricity/i, /power bill/i],
    summary:
      "Claim either a fixed hourly rate for home‑office running costs or actual costs. Phone/internet may be partly deductible if work‑related.",
    caveats: [
      "Keep a record of hours worked from home and evidence for expenses.",
      "Avoid double‑counting between methods.",
    ],
    links: [
      { label: "ATO: Working from home", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/working-from-home-expenses" },
      { label: "H&R Block: WFH tips", url: "https://www.hrblock.com.au/tax-academy/guide-tax-deductions-in-australia" },
    ],
  },
  {
    id: "car_travel",
    title: "Car & Work Travel",
    match: [/car/i, /vehicle/i, /logbook/i, /cents per km/i, /travel/i, /uber/i, /taxi/i, /parking/i, /toll/i],
    summary:
      "Travel between workplaces or for duties can be deductible. Home‑to‑work commuting is private.",
    caveats: [
      "Use cents‑per‑km (capped) or logbook % of actual costs.",
      "Keep receipts and a representative logbook/records.",
      "Ride‑share, parking and tolls may be deductible when the travel itself qualifies.",
    ],
    links: [
      { label: "ATO: Car & travel", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/car-expenses-and-other-travel-expenses" },
      { label: "H&R Block: Travel examples", url: "https://www.hrblock.com.au/tax-academy/guide-tax-deductions-in-australia" },
    ],
  },
  {
    id: "tools_tech",
    title: "Tools, Equipment, Devices & Software",
    match: [/tool/i, /equipment/i, /laptop/i, /computer/i, /headset/i, /ipad/i, /tablet/i, /software/i, /subscription/i],
    summary:
      "Work‑related tools/tech are deductible to the extent of work use. Low‑cost items may be written off; others are claimed over time.",
    caveats: [
      "Apportion private vs work use.",
      "Keep purchase receipts and, where needed, a usage diary.",
    ],
    links: [
      { label: "ATO: Tools & assets", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/tools-equipment-and-other-assets" },
      { label: "ATO: Depreciation", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/decline-in-value-depreciation" },
      { label: "H&R Block: Devices & tools", url: "https://www.hrblock.com.au/tax-academy/guide-tax-deductions-in-australia" },
    ],
  },
  {
    id: "self_education",
    title: "Self‑education & Training",
    match: [/course/i, /tuition/i, /self[- ]?education/i, /cpd/i, /training/i, /conference/i, /seminar/i],
    summary:
      "Deductible when the study maintains or improves skills for your current job (not for a new career).",
    caveats: [
      "Covers course fees, materials, some travel, and depreciation of study equipment proportionate to work relevance.",
    ],
    links: [
      { label: "ATO: Self‑education", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/self-education-expenses" },
      { label: "H&R Block: Education examples", url: "https://www.hrblock.com.au/tax-academy/guide-tax-deductions-in-australia" },
    ],
  },
  {
    id: "donations",
    title: "Gifts & Donations (DGR)",
    match: [/donation/i, /charity/i, /dgr/i, /gift/i],
    summary:
      "Donations to deductible gift recipients (DGRs) may be deductible if you receive no material benefit in return.",
    caveats: [
      "Keep receipts and confirm the charity’s DGR status.",
    ],
    links: [
      { label: "ATO: Gifts & donations", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/gifts-and-donations" },
      { label: "H&R Block: Donation tips", url: "https://www.hrblock.com.au/tax-academy/guide-tax-deductions-in-australia" },
    ],
  },
  {
    id: "fees_tax_insurance",
    title: "Professional Fees, Tax Agent Fees & Income Protection",
    match: [/union/i, /membership/i, /professional/i, /registration/i, /tax agent/i, /manag(ing|ement) tax/i, /income protection/i],
    summary:
      "Union/professional memberships related to your work are generally deductible. So are registered tax agent fees. Income protection premiums (outside super) are commonly deductible.",
    caveats: [
      "If held via super, the fund may claim the deduction instead of you.",
      "Keep invoices and note coverage periods.",
    ],
    links: [
      { label: "ATO: Other work expenses", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/other-work-related-expenses" },
      { label: "ATO: Managing tax affairs", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/cost-of-managing-tax-affairs" },
      { label: "H&R Block: Fees & insurance", url: "https://www.hrblock.com.au/tax-academy/guide-tax-deductions-in-australia" },
    ],
  },
  {
    id: "phone_internet",
    title: "Phone & Internet",
    match: [/phone/i, /mobile/i, /cell/i, /internet/i, /data/i, /plan/i],
    summary:
      "Claim the work‑related percentage of phone and internet using a reasonable method (e.g., a 4‑week diary).",
    caveats: [
      "If using a home‑office fixed rate, check what’s included vs. separate to avoid double counting.",
    ],
    links: [
      { label: "ATO: Phone & internet", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/phone-data-and-internet-expenses" },
      { label: "H&R Block: Phone/internet", url: "https://www.hrblock.com.au/tax-academy/guide-tax-deductions-in-australia" },
    ],
  },
  {
    id: "rental_investment",
    title: "Investment & Rental Property",
    match: [/rental/i, /landlord/i, /property manager/i, /interest/i, /investment/i, /shares/i, /etf/i, /brokerage/i, /bank fees/i],
    summary:
      "Interest on investment loans, agent fees, bank fees on investment accounts, certain property expenses and some depreciation may be deductible. Repairs (not improvements) are deductible.",
    caveats: [
      "Apportion for any private use or periods not available for rent.",
      "Initial repairs or capital improvements are treated differently to repairs.",
    ],
    links: [
      { label: "ATO: Rental properties", url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/investing-in-property/rental-properties" },
      { label: "ATO: Investments & assets", url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets" },
      { label: "H&R Block: Investment examples", url: "https://www.hrblock.com.au/tax-academy/guide-tax-deductions-in-australia" },
    ],
  },
  {
    id: "super",
    title: "Personal Super Contributions (Concessional)",
    match: [/super/i, /superannuation/i, /contribution/i, /salary sacrifice/i],
    summary:
      "Personal concessional contributions may be deductible if you lodge a notice of intent and receive an acknowledgment from your fund (caps/timing apply).",
    caveats: [
      "Check annual caps and your fund’s process.",
    ],
    links: [
      { label: "ATO: Deducting personal super", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals/add-to-your-super/claiming-deductions-for-personal-super-contributions" },
      { label: "H&R Block: Super contributions", url: "https://www.hrblock.com.au/tax-academy/guide-tax-deductions-in-australia" },
    ],
  },
  {
    id: "non_deductible_common",
    title: "Commonly NOT Deductible",
    match: [/coffee/i, /lunch/i, /commute/i, /make[- ]?up/i, /groom/i, /parking at home/i, /fines?/i, /childcare/i],
    summary:
      "Private or domestic costs — commuting, everyday clothing, grooming, lunches, fines, childcare — are generally not deductible.",
    caveats: [
      "Narrow exceptions can apply (e.g., protective clothing, travel on duty).",
    ],
    links: [
      { label: "ATO: Deductions you can claim", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim" },
      { label: "H&R Block: Common mistakes", url: "https://www.hrblock.com.au/tax-academy/guide-tax-deductions-in-australia" },
    ],
  },
];

function classify(query) {
  const text = query.toLowerCase();
  for (const item of KB) {
    if (item.match.some((re) => re.test(text))) return item;
  }
  return null;
}

function suggestFollowUps(topicId) {
  switch (topicId) {
    case "car_travel":
      return ["Is this travel between workplaces or carrying bulky tools?","Approximately what % of total car use is for work?","Do you keep a logbook or track work kilometres?"];
    case "home_office":
      return ["Roughly how many hours per week do you work from home?","Do you want to use a per‑hour method or actual costs?","Do you also want to claim phone/internet separately?"];
    case "tools_tech":
      return ["Is the item used mainly for your current job?","What percentage is private vs work use?","Was the cost low enough to claim upfront or a larger asset?"];
    case "self_education":
      return ["Is the course directly related to your current role?","What expenses are you looking to claim (fees, materials, travel)?"];
    case "phone_internet":
      return ["Do you have a 4‑week usage diary to estimate the work %?","Is the plan shared with family or solely yours?"];
    case "donations":
      return ["Is the organisation a registered DGR?","Did you receive anything material in return (e.g., raffle, dinner)?"];
    case "fees_tax_insurance":
      return ["Is the policy held outside super?","Which professional body or union is this for?"];
    case "rental_investment":
      return ["Is it a repair or an improvement?","Any private use or holiday stays to apportion?"];
    default:
      return ["Is this expense directly related to earning your current income?","Were you reimbursed by your employer?","Do you have records and a reasonable method to apportion any private use?"];
  }
}

function Badge({ children }) {
  return <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium text-zinc-700 border-zinc-200 bg-zinc-50">{children}</span>;
}

const BotBubble = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-[90%] rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 p-4">
    <div className="flex items-start gap-3">
      <div className="mt-0.5"><ShieldCheck className="w-5 h-5 text-zinc-700"/></div>
      <div className="prose prose-sm text-zinc-800">{children}</div>
    </div>
  </motion.div>
);

const UserBubble = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-[90%] rounded-2xl bg-zinc-900 text-zinc-50 p-4 ml-auto">
    {children}
  </motion.div>
);

function LinkButton({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-zinc-700 hover:text-zinc-900 underline decoration-zinc-300 hover:decoration-zinc-700">
      <LinkIcon className="w-4 h-4" /> {children}
    </a>
  );
}

function QuickChip({ label, onClick }) {
  return <button onClick={onClick} className="text-xs md:text-sm rounded-full border border-zinc-200 bg-white px-3 py-1 hover:bg-zinc-50 active:scale-[0.98]">{label}</button>;
}

export default function YourRefundBuddyChat() {
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem("yrb-chat") || "[]"); } catch { return []; }
  });
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem("yrb-chat", JSON.stringify(messages)); } catch {}
  }, [messages]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const starter = useMemo(() => (
    <>
      <div className="flex items-center gap-2 text-zinc-50">
        <BookOpen className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Your Refund Buddy</h2>
      </div>
      <p className="mt-1 text-sm text-zinc-50/90">
        Ask me if a specific expense is likely <strong>deductible</strong> in Australia. I’ll ask a couple of follow‑ups and point you to ATO & H&R Block resources. This is general info — not tax advice.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {["Is a laptop deductible?","Can I claim travel from home to work?","Are charity donations deductible?","Can I claim my phone plan?","Can I claim laundry for my uniform?","Is income protection insurance deductible?"].map((q) => (
          <QuickChip key={q} label={q} onClick={() => setInput(q)} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>Australia only</Badge>
        <Badge>General guidance</Badge>
        <Badge>Records required</Badge>
      </div>
    </>
  ), []);

  function respond(query) {
    const topic = classify(query) || {
      id: "generic",
      title: "Work‑related expense (general test)",
      summary: "An expense is deductible if it is directly related to earning your income, you paid for it (and weren’t reimbursed), and you have records.",
      caveats: ["Apportion any private use. Keep receipts or reasonable records."],
      links: [
        { label: "ATO: Deductions you can claim", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim" },
        { label: "H&R Block: Deduction guide", url: "https://www.hrblock.com.au/tax-academy/guide-tax-deductions-in-australia" },
      ],
    };

    const followUps = suggestFollowUps(topic.id);

    const botMsg = {
      role: "assistant",
      ts: Date.now(),
      topic: topic.title,
      content: (
        <div>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <p className="text-sm"><strong>{topic.title}</strong></p>
          </div>
          <p className="mt-2 text-sm leading-relaxed">{topic.summary}</p>
          {topic.caveats?.length ? (
            <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700 space-y-1">
              {topic.caveats.map((c, i) => (<li key={i}>{c}</li>))}
            </ul>
          ) : null}
          {followUps?.length ? (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-800"><HelpCircle className="w-4 h-4"/> Follow‑up questions</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {followUps.map((f, i) => (<QuickChip key={i} label={f} onClick={() => setInput(f)} />))}
              </div>
            </div>
          ) : null}
          {topic.links?.length ? (
            <div className="mt-3 space-y-1">
              {topic.links.map((l, i) => (<div key={i}><LinkButton href={l.url}>{l.label}</LinkButton></div>))}
            </div>
          ) : null}
        </div>
      ),
    };

    setMessages((m) => [...m, { role: "user", ts: Date.now(), content: query }, botMsg]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const q = input.trim();
    setInput("");
    respond(q);
  }

  function resetChat() { setMessages([]); }

  function exportTranscript() {
    const plain = messages
      .map((m) => `${new Date(m.ts).toLocaleString()} - ${m.role.toUpperCase()}\n${typeof m.content === 'string' ? m.content : (m.role === 'user' ? m.content : m.topic || '')}`)
      .join("\n\n---\n\n");
    const blob = new Blob([plain], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "your-refund-buddy-transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Your Refund Buddy</h1>
        <div className="flex items-center gap-2">
          <button onClick={exportTranscript} className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50">
            <FileDown className="w-4 h-4"/> Export
          </button>
          <button onClick={resetChat} className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50">
            <Trash2 className="w-4 h-4"/> Reset
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr]">
        <div className="rounded-2xl bg-white/90 backdrop-blur shadow-sm ring-1 ring-zinc-200">
          <div className="p-4 border-b border-zinc-200">
            <div className="flex items-center gap-2 text-sm text-zinc-700">
              <ShieldCheck className="w-4 h-4"/>
              General information only — not tax advice. Check the ATO & H&R Block links and keep records.
            </div>
          </div>

          <div ref={listRef} className="p-4 h-[60vh] overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <BotBubble>{starter}</BotBubble>
            ) : (
              messages.map((m, idx) => (m.role === "user" ? <UserBubble key={idx}>{m.content}</UserBubble> : <BotBubble key={idx}>{m.content}</BotBubble>))
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., Is income protection insurance deductible?"
                className="flex-1 rounded-xl border border-zinc-300 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
              />
              <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 text-white px-4 py-3 text-sm hover:bg-black active:scale-[0.99]">
                <Send className="w-4 h-4"/> Ask
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 p-4">
          <div className="flex items-center gap-2 mb-2"><BookOpen className="w-4 h-4"/><h3 className="font-medium">Popular guidance</h3></div>
          <ul className="text-sm space-y-2">
            <li><LinkButton href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim">ATO: Deductions you can claim</LinkButton></li>
            <li><LinkButton href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/working-from-home-expenses">ATO: Working from home</LinkButton></li>
            <li><LinkButton href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/car-expenses-and-other-travel-expenses">ATO: Car & travel</LinkButton></li>
            <li><LinkButton href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/tools-equipment-and-other-assets">ATO: Tools & equipment</LinkButton></li>
            <li><LinkButton href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/self-education-expenses">ATO: Self‑education</LinkButton></li>
            <li><LinkButton href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/phone-data-and-internet-expenses">ATO: Phone & internet</LinkButton></li>
            <li><LinkButton href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/cost-of-managing-tax-affairs">ATO: Managing tax affairs</LinkButton></li>
            <li><LinkButton href="https://www.ato.gov.au/individuals-and-families/investments-and-assets/investing-in-property/rental-properties">ATO: Rental properties</LinkButton></li>
            <li><LinkButton href="https://www.hrblock.com.au/tax-academy/guide-tax-deductions-in-australia">H&R Block: Guide to tax deductions</LinkButton></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
