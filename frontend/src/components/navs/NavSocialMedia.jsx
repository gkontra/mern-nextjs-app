import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6';

const NEW_TAB = '(öffnet in neuem Tab)';

const SOCIAL_LINKS = [
  { href: 'https://www.instagram.com/gfn.gmbh/?hl=de', label: `GFN auf Instagram ${NEW_TAB}`, Icon: FaInstagram },
  { href: 'https://www.youtube.com/@GFNde', label: `GFN auf YouTube ${NEW_TAB}`, Icon: FaYoutube },
  { href: 'https://www.facebook.com/gfn.gmbh/?locale=de_DE', label: `GFN auf Facebook ${NEW_TAB}`, Icon: FaFacebookF },
  { href: 'https://www.linkedin.com/company/gfn-gmbh/', label: `GFN auf LinkedIn ${NEW_TAB}`, Icon: FaLinkedinIn },
  { href: 'https://x.com/', label: `X ${NEW_TAB}`, Icon: FaXTwitter },
];

const NavSocialMedia = () => {
  return (
    <nav className="nav-social-media" aria-label="Social Media">
      <ul>
        {SOCIAL_LINKS.map(({ href, label, Icon }) => (
          <li key={href}>
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <Icon aria-hidden="true" focusable="false" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavSocialMedia;
