// Small inline SVG icons (no icon library needed).
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

const make = (children) =>
  function Icon({ size = 20, ...rest }) {
    return (
      <svg {...base} width={size} height={size} {...rest}>
        {children}
      </svg>
    );
  };

export const SearchIcon = make(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.500-3.500" /></>);
export const CartIcon = make(<><circle cx="9" cy="20" r="1.300" /><circle cx="18" cy="20" r="1.300" /><path d="M2 3h3l2.600 12.200a1 1 0 0 0 1 .800h9.200a1 1 0 0 0 1-.800L21 7H6" /></>);
export const TrashIcon = make(<><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="m6 6 1 14h10l1-14" /><path d="M10 11v5M14 11v5" /></>);
export const PlusIcon = make(<path d="M12 5v14M5 12h14" />);
export const MinusIcon = make(<path d="M5 12h14" />);
export const ArrowRightIcon = make(<path d="M5 12h14m-6-6 6 6-6 6" />);
export const CheckIcon = make(<path d="m5 12.500 4.500 4.500L19 7" />);
export const PhoneIcon = make(<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />);
export const MailIcon = make(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>);
export const PinIcon = make(<><path d="M12 21s7-6.100 7-11.500A7 7 0 0 0 5 9.500C5 14.900 12 21 12 21z" /><circle cx="12" cy="9.500" r="2.500" /></>);
export const GridIcon = make(<><rect x="4" y="4" width="6.500" height="6.500" rx="1.200" /><rect x="13.500" y="4" width="6.500" height="6.500" rx="1.200" /><rect x="4" y="13.500" width="6.500" height="6.500" rx="1.200" /><rect x="13.500" y="13.500" width="6.500" height="6.500" rx="1.200" /></>);
export const TabletIcon = make(<><circle cx="12" cy="12" r="8" /><path d="M5.500 18.500 18.500 5.500" /></>);
export const CapsuleIcon = make(<><rect x="3" y="8.500" width="18" height="7" rx="3.500" transform="rotate(-35 12 12)" /><path d="m9.200 14.800 5.600-5.600" /></>);
export const SyrupIcon = make(<><path d="M9 3h6v3H9z" /><path d="M8 6h8v2.500l1 2V20a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-9.500l1-2z" /><path d="M7 14h10" /></>);
export const InjectionIcon = make(<><path d="m18 3 3 3M16 5l3 3-9 9-3-3zM7 14l-4 4m1 3 3-3" /><path d="M13 8l3 3" /></>);
export const DropsIcon = make(<path d="M12 3s6 6.400 6 10.500a6 6 0 0 1-12 0C6 9.400 12 3 12 3z" />);
export const CreamIcon = make(<><path d="M5 8h14l-1 12H6z" /><path d="M8 8V5h8v3" /><path d="M9 13h6" /></>);
export const LotionIcon = make(<><path d="M10 3h4v3h-4zM14 4.500h3.500" /><rect x="7" y="6" width="10" height="15" rx="2" /><path d="M7 12h10" /></>);
export const SachetIcon = make(<><path d="M5 4h14v16H5z" /><path d="M5 7h14M5 17h14" /><path d="M10 11.500h4" /></>);
export const OthersIcon = make(<><path d="M4 8.500 12 4l8 4.500v7L12 20l-8-4.500z" /><path d="m4 8.500 8 4.500 8-4.500M12 13v7" /></>);

export const ShieldCheckIcon = make(<><path d="M12 3 5 6v5c0 4.500 3 8 7 10 4-2 7-5.500 7-10V6z" /><path d="m9 12 2 2 4-4" /></>);
export const TruckIcon = make(<><path d="M3 6h11v10H3z" /><path d="M14 9h4l3 3v4h-7" /><circle cx="7" cy="18" r="1.800" /><circle cx="17" cy="18" r="1.800" /></>);
export const HeadsetIcon = make(<><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.500" /><rect x="17" y="14" width="4" height="6" rx="1.500" /><path d="M19 20c0 1-2 2-5 2" /></>);
export const TagIcon = make(<><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.500" cy="8.500" r="1.300" /></>);
export const StarIcon = make(<path d="M12 3.500l2.600 5.300 5.900.900-4.300 4.100 1 5.800L12 16.900l-5.200 2.700 1-5.800-4.300-4.100 5.900-.900z" />);
export const ChevronRightIcon = make(<path d="m9 6 6 6-6 6" />);
export const ChevronLeftIcon = make(<path d="m15 6-6 6 6 6" />);

// Filled social icons (used in the footer).
const makeFilled = (children) =>
  function Icon({ size = 20, ...rest }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...rest}>
        {children}
      </svg>
    );
  };
export const FacebookIcon = makeFilled(<path d="M13.500 21v-7.500h2.600l.4-3h-3V8.700c0-.9.3-1.500 1.600-1.500h1.600V4.500c-.3 0-1.200-.1-2.300-.1-2.300 0-3.900 1.400-3.900 4v2.100H8v3h2.500V21z" />);
export const YouTubeIcon = makeFilled(<path fillRule="evenodd" d="M21.600 7.200a2.500 2.500 0 0 0-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800C22 15.200 22 12 22 12s0-3.200-.4-4.800zM10 15V9l5.200 3z" />);
export const TikTokIcon = makeFilled(<path d="M16.600 3h-3v11.600a2.500 2.500 0 1 1-2.500-2.500c.3 0 .5 0 .8.1V9.100a5.600 5.600 0 1 0 4.700 5.500V8.800a6.400 6.400 0 0 0 3.700 1.200V7a3.700 3.700 0 0 1-3.700-4z" />);

export function WhatsAppIcon({ size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...rest}>
      <path d="M12.040 2a9.900 9.900 0 0 0-8.500 14.900L2 22l5.300-1.400A9.900 9.900 0 1 0 12.040 2zm0 1.800a8.100 8.100 0 1 1-4.300 15l-.3-.2-3.100.8.800-3-.2-.3A8.100 8.100 0 0 1 12.040 3.800zM8.900 7.500c-.2 0-.5.100-.7.300-.3.300-1 1-1 2.400s1 2.700 1.200 2.900c.1.200 2 3.100 4.900 4.300 2.400 1 2.900.8 3.400.7.600-.1 1.700-.7 1.900-1.400.2-.7.200-1.200.2-1.300-.1-.1-.3-.2-.6-.3l-1.800-.9c-.2-.1-.4-.1-.6.100l-.8 1c-.1.200-.3.200-.6.100-.3-.1-1.200-.4-2.200-1.400-.8-.8-1.400-1.700-1.500-2-.2-.3 0-.4.100-.6l.4-.5c.1-.1.200-.3.200-.5.100-.2 0-.4 0-.5l-.8-2c-.2-.5-.4-.5-.6-.5z" />
    </svg>
  );
}

// Maps a category name to its icon component.
export const CATEGORY_ICONS = {
  All: GridIcon,
  Tablets: TabletIcon,
  Capsules: CapsuleIcon,
  Syrup: SyrupIcon,
  Injection: InjectionIcon,
  Drops: DropsIcon,
  Cream: CreamIcon,
  Lotion: LotionIcon,
  Sachet: SachetIcon,
  Others: OthersIcon,
};

// Solid star for a saved favorite.
export const StarFilledIcon = makeFilled(<path d="M12 3.500l2.600 5.300 5.900.900-4.300 4.100 1 5.800L12 16.900l-5.200 2.700 1-5.800-4.300-4.100 5.900-.900z" stroke="currentColor" strokeWidth="1.600" strokeLinejoin="round" />);

// Lucide-style icons for the mobile menu (inlined, so no extra package is needed).
export const HomeIcon = make(<><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></>);
export const ShoppingCartIcon = make(<><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></>);
export const LucideStarIcon = make(<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />);
