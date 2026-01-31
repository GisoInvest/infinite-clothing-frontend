import { useCurrency, CurrencyCode } from '@/contexts/CurrencyContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CurrencySelector() {
  const { currency, setCurrency, currencies } = useCurrency();

  return (
    <div className="flex items-center">
      <Select
        value={currency.code}
        onValueChange={(value) => setCurrency(value as CurrencyCode)}
      >
        <SelectTrigger className="w-[80px] h-9 bg-transparent border-primary/20 hover:border-primary/50 transition-colors focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent className="bg-card border-primary/20">
          {currencies.map((c) => (
            <SelectItem 
              key={c.code} 
              value={c.code}
              className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="font-medium">{c.code}</span>
                <span className="text-muted-foreground text-xs">({c.symbol})</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
