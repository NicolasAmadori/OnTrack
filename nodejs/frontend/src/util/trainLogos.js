import ferrovieLogo from '@/assets/images/logos/ferrovie_dello_stato_italiane.png';
import frecciarossaLogo from '@/assets/images/logos/frecciarossa.png';
import intercityLogo from '@/assets/images/logos/intercity.png';
import italoLogo from '@/assets/images/logos/italo.png';
import regionaleLogo from '@/assets/images/logos/regionale.png';
import regionaleVeloceLogo from '@/assets/images/logos/regionale_veloce.png';

const normalizeDenomination = (denom) => {
    if (!denom) return 'ferrovie';
    const d = denom.toLowerCase().replace(/\s+/g, '');
    if (d.includes('frecciarossa')) return 'frecciarossa';
    if (d.includes('intercity')) return 'intercity';
    if (d.includes('italo')) return 'italo';
    if (d === 'regionale') return 'regionale';
    if (d.includes('regionaleveloce') || d.includes('regionale veloce')) return 'regionaleVeloce';
    return 'ferrovie';
};

const LOGO_MAP = {
  ferrovie: ferrovieLogo,
  frecciarossa: frecciarossaLogo,
  intercity: intercityLogo,
  italo: italoLogo,
  regionale: regionaleLogo,
  regionaleVeloce: regionaleVeloceLogo
};

export const getTrainLogo = (denomination) => {
    return LOGO_MAP[normalizeDenomination(denomination)];
};