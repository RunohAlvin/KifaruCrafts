import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Globe } from "lucide-react";
import { 
  type Currency, 
  CURRENCY_SYMBOLS, 
  CURRENCY_NAMES 
} from "@/lib/currency";
import { useCurrencyStore } from "@/lib/store";

interface CurrencySelectorProps {
  onCurrencyChange?: (currency: Currency) => void;
  compact?: boolean;
}

export default function CurrencySelector({ onCurrencyChange, compact = false }: CurrencySelectorProps) {
  const { currency: selectedCurrency, setCurrency } = useCurrencyStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleCurrencyChange = (currency: Currency) => {
    setCurrency(currency);
    onCurrencyChange?.(currency);
    setIsOpen(false);
  };

  const currencies: Currency[] = ['KES', 'USD', 'EUR', 'GBP'];

  if (compact) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-kenyan-dark hover:text-kenyan-orange transition-colors"
          >
            <Globe className="w-4 h-4 mr-1" />
            {CURRENCY_SYMBOLS[selectedCurrency]}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="space-y-1">
            {currencies.map((currency) => (
              <Button
                key={currency}
                variant={selectedCurrency === currency ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start ${
                  selectedCurrency === currency 
                    ? "bg-kenyan-orange text-white" 
                    : "hover:bg-kenyan-orange hover:bg-opacity-10"
                }`}
                onClick={() => handleCurrencyChange(currency)}
              >
                <span className="font-mono mr-2">{CURRENCY_SYMBOLS[currency]}</span>
                {CURRENCY_NAMES[currency]}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-gray-500" />
      <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="w-32">
          <SelectValue>
            <span className="font-mono">{CURRENCY_SYMBOLS[selectedCurrency]}</span>
            <span className="ml-1">{selectedCurrency}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency} value={currency}>
              <div className="flex items-center space-x-2">
                <span className="font-mono">{CURRENCY_SYMBOLS[currency]}</span>
                <span>{CURRENCY_NAMES[currency]}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}