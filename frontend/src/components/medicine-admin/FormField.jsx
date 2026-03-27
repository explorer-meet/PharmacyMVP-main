import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form';

export function FormField({ label, error, children }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  );
}