import {
  Wallet, TrendingUp, TrendingDown, PiggyBank, Target, BarChart3,
  Search, Bell, Moon, Sun, Settings, ChevronRight, Plus,
  UtensilsCrossed, Car, Home, GraduationCap, PartyPopper, Smartphone, Zap, Wifi,
  Calendar, Sparkles, ArrowRight, CheckCircle2, Clock, Menu, X, Info,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/types/finance";

const registry: Record<IconName, React.ComponentType<LucideProps>> = {
  wallet: Wallet,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  piggyBank: PiggyBank,
  target: Target,
  barChart: BarChart3,
  search: Search,
  bell: Bell,
  moon: Moon,
  sun: Sun,
  settings: Settings,
  chevronRight: ChevronRight,
  plus: Plus,
  food: UtensilsCrossed,
  car: Car,
  home: Home,
  graduation: GraduationCap,
  party: PartyPopper,
  phone: Smartphone,
  bolt: Zap,
  wifi: Wifi,
  calendar: Calendar,
  sparkles: Sparkles,
  arrowRight: ArrowRight,
  checkCircle: CheckCircle2,
  clock: Clock,
  menu: Menu,
  x: X,
  info: Info,
};

export function Icon({ name, className, ...props }: { name: IconName } & LucideProps) {
  const Cmp = registry[name];
  return <Cmp className={className} strokeWidth={1.75} {...props} />;
}
