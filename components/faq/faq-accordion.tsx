"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  questions: FaqItem[];
}

export default function FaqAccordion({ questions }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      {questions.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index} className="border-b border-border">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex items-center justify-between w-full py-5 text-left group"
              aria-expanded={isOpen}
            >
              <span className="text-base font-medium text-foreground pr-4 group-hover:text-accent transition-colors">
                {item.question}
              </span>
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-muted-foreground">
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                isOpen ? "max-h-96 pb-5" : "max-h-0"
              }`}
            >
              <p className="text-sm text-muted-foreground leading-relaxed pr-10">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
