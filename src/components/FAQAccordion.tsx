'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What technologies do you use?',
    answer:
      'We specialize in modern web and mobile technologies including Next.js, React, TypeScript, Node.js, Python, and cloud platforms like AWS, GCP, and Vercel. We choose the best stack for each project based on requirements, scalability needs, and performance goals.',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'Timelines vary by scope. A landing page or portfolio site takes 1-2 weeks. A full SaaS platform typically takes 6-12 weeks. We provide detailed timelines during our free consultation and always include buffer for testing and polish.',
  },
  {
    question: 'Do you offer ongoing maintenance and support?',
    answer:
      'Yes! Every project includes 30 days of free post-launch support. We also offer monthly maintenance plans that include performance monitoring, security updates, bug fixes, and feature enhancements starting at $499/month.',
  },
  {
    question: 'What is your pricing structure?',
    answer:
      'We offer both fixed-price projects and hourly engagements. Fixed-price works great for well-defined projects with clear requirements. Hourly is ideal for ongoing development and iterative work. All projects start with a free consultation and detailed proposal.',
  },
  {
    question: 'Can you work with our existing codebase?',
    answer:
      'Absolutely. We regularly take over existing projects, perform code audits, and modernize legacy codebases. We\'ll assess your current code quality, suggest improvements, and create a migration roadmap if needed.',
  },
  {
    question: 'Do you provide design services as well?',
    answer:
      'Yes, we offer end-to-end design and development. Our process starts with wireframes, moves to high-fidelity Figma mockups, and then pixel-perfect implementation. We focus on modern UI/UX that converts visitors into customers.',
  },
];

const FAQItemCard: React.FC<{
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}> = ({ item, isOpen, onToggle, index }) => {
  return (
    <div
      className={`border rounded-xl transition-all duration-300 ${
        isOpen
          ? 'border-accent/40 bg-accent/5 shadow-md shadow-accent/10'
          : 'border-gray-200/60 bg-surface hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer group focus-ring rounded-xl"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span
          className={`font-heading font-bold text-sm md:text-base transition-colors duration-200 ${
            isOpen ? 'text-accent' : 'text-primary group-hover:text-accent'
          }`}
        >
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-accent' : 'text-muted'
          }`}
        />
      </button>

      {/* Animated Answer */}
      <div
        id={`faq-answer-${index}`}
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{
          maxHeight: isOpen ? '300px' : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-5 pb-4 pt-0">
          <p className="text-muted text-sm leading-relaxed font-body">{item.answer}</p>
        </div>
      </div>
    </div>
  );
};

export const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full py-20 px-6 bg-surface">
      <div className="max-w-content mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-heading font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary">
            Frequently Asked Questions
          </h2>
          <p className="text-muted mt-3 max-w-xl mx-auto font-body text-sm">
            Everything you need to know about working with Dev Krafters. Can&apos;t find what you&apos;re looking for? Get in touch.
          </p>
        </div>

        {/* Accordion List */}
        <div className="max-w-2xl mx-auto space-y-3">
          {faqData.map((item, i) => (
            <FAQItemCard
              key={i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
