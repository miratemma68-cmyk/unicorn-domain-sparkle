import { useLanguage } from "@/contexts/LanguageContext";

export const SalesConditionsSection = () => {
  const { t } = useLanguage();

  const items = [
    { title: t('sales.c1Title'), desc: t('sales.c1Desc') },
    { title: t('sales.c2Title'), desc: t('sales.c2Desc') },
    { title: t('sales.c3Title'), desc: t('sales.c3Desc') },
    { title: t('sales.c4Title'), desc: t('sales.c4Desc') },
    { title: t('sales.c5Title'), desc: t('sales.c5Desc') },
    { title: t('sales.c6Title'), desc: t('sales.c6Desc') },
  ];

  return (
    <section id="conditions-vente" className="py-20 px-4 relative scroll-mt-44">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="tapestry-border litter-frame bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-gold medieval-glow text-center mb-8 break-words">
            {t('sales.title')}
          </h2>

          <p className="text-lg leading-relaxed text-center max-w-3xl mx-auto text-ivory/90 whitespace-pre-line">
            {t('sales.intro')}
          </p>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 mt-10 max-w-4xl mx-auto">
            {items.map((item) => (
              <div key={item.title} className="flex items-start gap-3 text-ivory/90">
                <span className="text-gold text-2xl leading-none mt-0.5">✦</span>
                <div>
                  <h3 className="text-xl font-display text-gold mb-1">{item.title}</h3>
                  <p className="leading-relaxed whitespace-pre-line">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
