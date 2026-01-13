import fallbackLogo from '@/assets/images/logos/fallback.png';
import frecciarossaLogo from '@/assets/images/logos/FR.png';
import intercityLogo from '@/assets/images/logos/IC.png';
import italoLogo from '@/assets/images/logos/italo.png';
import regionaleLogo from '@/assets/images/logos/REnoTI.png';
import regionaleVeloceTTPER from '@/assets/images/logos/RVnoTI.png';
import regionaleVeloceLogo from '@/assets/images/logos/RV.png';
import intercityNotteLogo from '@/assets/images/logos/NI.png';
import frecciarossa1000Logo from '@/assets/images/logos/FR1000.png';

const LOGO_MAP = {
    fallback: fallbackLogo,
    FR: frecciarossaLogo,
    IC: intercityLogo,
    unknown: italoLogo,
    REnoTI: regionaleLogo,
    RVnoTI: regionaleVeloceTTPER,
    RV: regionaleVeloceLogo,
    NI: intercityNotteLogo,
    FR1000: frecciarossa1000Logo
};

export const getTrainLogo = (logoId) => {
    return LOGO_MAP[logoId] || LOGO_MAP.fallback;
};