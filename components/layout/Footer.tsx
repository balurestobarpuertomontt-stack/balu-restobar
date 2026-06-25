import { SITE, NAV_LINKS } from "@/lib/constants";
import { Instagram, Facebook } from "@/components/ui/Icons";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-balu-charcoal py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-display text-2xl mb-4">
            <span className="text-balu-gold">Balu</span> Restobar
          </h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            {SITE.slogan}. Experiencia gastronómica premium en el corazón de Puerto Montt.
          </p>
        </div>
        <div>
          <h4 className="text-balu-gold text-sm uppercase tracking-widest mb-4">Navegación</h4>
          <ul className="space-y-2">
            {NAV_LINKS.slice(0, 5).map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-neutral-500 text-sm hover:text-neutral-300 transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-balu-gold text-sm uppercase tracking-widest mb-4">Contacto</h4>
          <p className="text-neutral-500 text-sm mb-2">{SITE.address}</p>
          <p className="text-neutral-500 text-sm mb-2">{SITE.phoneDisplay}</p>
          <p className="text-neutral-500 text-sm mb-4">{SITE.hours}</p>
          <div className="flex gap-4">
            <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="h-5 w-5 text-neutral-500 hover:text-balu-gold transition-colors" />
            </a>
            <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className="h-5 w-5 text-neutral-500 hover:text-balu-gold transition-colors" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-neutral-600 text-xs">
        © {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
