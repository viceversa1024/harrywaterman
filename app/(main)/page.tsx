import { getAltBios } from '@/lib/alts';
import HomeContent from './components/HomeContent';

export default function Home() {
  const altBios = getAltBios();
  return <HomeContent altBios={altBios} />;
}
