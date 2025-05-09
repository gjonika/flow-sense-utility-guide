
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface NotesFieldProps {
  form: any;
}

export const NotesField = ({ form }: NotesFieldProps) => {
  const { t } = useLanguage();

  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('addReading.notes')}</FormLabel>
          <FormControl>
            <Input
              placeholder="Any additional notes or comments"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
