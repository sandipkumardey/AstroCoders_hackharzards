import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "How does blockchain ticketing prevent fraud?",
      answer:
        "Blockchain ticketing creates an immutable record of ticket ownership and transfers. When a ticket is resold on our platform, the original ticket is automatically invalidated and a new ticket with a unique QR code is issued to the buyer. This prevents duplicate tickets and ensures only the current owner can use the ticket.",
    },
    {
      question: "What cryptocurrencies can I use to buy tickets?",
      answer:
        "Currently, our platform accepts Stellar USDC for ticket purchases. This provides a stable-value payment option that's fast and has low transaction fees. In the future, we plan to add support for additional cryptocurrencies.",
    },
    {
      question: "How do sellers receive their payment?",
      answer:
        "Sellers receive payment in Base-native tokens such as USDC, ETH, or custom tokens. Our cross-chain payment processor handles the conversion automatically, so sellers don't need to worry about managing multiple cryptocurrencies.",
    },
    {
      question: "What are NFT receipts and how do they work?",
      answer:
        "NFT receipts are digital collectibles that serve as proof of purchase for your tickets. They're minted on the Base blockchain and can include special perks like exclusive content, meet-and-greet opportunities, or discounts on merchandise. You can also trade them on NFT marketplaces after the event.",
    },
    {
      question: "Do I need a crypto wallet to use BlockTix?",
      answer:
        "While having a crypto wallet provides the full BlockTix experience, we also offer options for users without wallets. You can purchase tickets using traditional payment methods, and we'll create a custodial wallet for your tickets and NFTs that you can claim later.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm text-purple-600">
            <span>FAQ</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to know about blockchain ticketing
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-500">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
