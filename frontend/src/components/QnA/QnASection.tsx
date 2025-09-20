import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the mentor matching work?",
    answer:
      "Our intelligent matching system connects you with mentors based on your goals, skills, and industry preferences. You can browse mentor profiles and send mentorship requests to those who align with your needs.",
  },
  {
    question: "Is there a cost for mentorship sessions?",
    answer:
      "Pricing varies by mentor. Many mentors offer free initial consultations, while others may charge for their expertise. Each mentor sets their own rates, which are clearly displayed on their profile.",
  },
  {
    question: "How do I schedule sessions with my mentor?",
    answer:
      "Once a mentor accepts your mentorship request, they'll provide you with their Calendly link. You can then easily book sessions that work for both of your schedules, with automatic time zone handling.",
  },
  {
    question: "What qualifications do mentors have?",
    answer:
      "All our mentors are verified industry experts with proven track records in their respective fields including entrepreneurship, business, STEM, and more. We carefully review each mentor's credentials before approval.",
  },
  {
    question: "Can I work with multiple mentors?",
    answer:
      "Absolutely! You can send mentorship requests to multiple mentors and work with several mentors simultaneously, each offering unique perspectives and expertise in different areas.",
  },
  {
    question: "How do I provide feedback after sessions?",
    answer:
      "After each mentorship session, you'll receive a structured feedback form where you can share your experience and help improve the platform for future mentees and mentors.",
  },
];

const QnASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-amber-100/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
            <span className="text-slate-800">Frequently Asked </span>
            <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Everything you need to know about our mentorship platform
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 px-6 py-2 hover:shadow-primary transition-all duration-300 hover:-translate-y-1"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline hover:text-amber-600 text-slate-800 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 pt-2 pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default QnASection;
