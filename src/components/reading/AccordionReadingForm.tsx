import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { suppliersByType } from "@/utils/supplierData";

// Schema for the form
const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date.",
  }),
  readings: z.array(
    z.object({
      utilityType: z.string(),
      supplier: z.string(),
      reading: z.string().optional(),
      cost: z.string().min(1, "Cost is required"),
      notes: z.string().optional(),
    })
  ),
});

type FormData = z.infer<typeof formSchema>;

export function AccordionReadingForm() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastReadings, setLastReadings] = useState<Record<string, number | null>>({});

  // Initialize form with all utility types
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      readings: Object.entries(suppliersByType).flatMap(([type, suppliers]) =>
        suppliers.map((supplier) => ({
          utilityType: type,
          supplier: supplier.id,
          reading: "",
          cost: "",
          notes: "",
        }))
      ),
    },
  });

  // Fetch last readings for all utility types on mount
  const fetchLastReadings = async () => {
    try {
      const readings: Record<string, number | null> = {};
      
      for (const [type, suppliers] of Object.entries(suppliersByType)) {
        for (const supplier of suppliers) {
          if (supplier.requiresReading) {
            const { data, error } = await supabase
              .from('utility_entries')
              .select('reading')
              .eq('utilitytype', type)
              .eq('supplier', supplier.id)
              .order('readingdate', { ascending: false })
              .limit(1);
            
            if (!error && data && data.length > 0 && data[0].reading) {
              readings[`${type}-${supplier.id}`] = data[0].reading;
            } else {
              readings[`${type}-${supplier.id}`] = null;
            }
          }
        }
      }
      
      setLastReadings(readings);
    } catch (error) {
      console.error('Error fetching last readings:', error);
    }
  };

  // Fetch last readings on mount
  useState(() => {
    fetchLastReadings();
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Filter out empty entries (where cost is empty)
      const validReadings = data.readings.filter(
        (reading) => reading.cost.trim() !== ""
      );
      
      // Prepare data for batch insert
      const readingsToInsert = validReadings.map((reading) => {
        const supplier = suppliersByType[reading.utilityType as keyof typeof suppliersByType]
          .find((s) => s.id === reading.supplier);
        
        return {
          readingdate: data.date.toISOString(),
          utilitytype: reading.utilityType,
          supplier: reading.supplier,
          reading: reading.reading ? parseFloat(reading.reading) : null,
          unit: supplier?.unit || null,
          amount: parseFloat(reading.cost),
          notes: reading.notes || null,
        };
      });
      
      // Skip if no valid readings
      if (readingsToInsert.length === 0) {
        toast({
          title: t('error.noReadings'),
          description: t('error.noReadingsDesc'),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Insert into Supabase
      const { error } = await supabase.from('utility_entries').insert(readingsToInsert);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: t('success.readings'),
        description: t('success.readingsDesc'),
      });
      
      // Reset form costs and readings, keep the date
      const currentDate = form.getValues("date");
      form.reset({
        date: currentDate,
        readings: Object.entries(suppliersByType).flatMap(([type, suppliers]) =>
          suppliers.map((supplier) => ({
            utilityType: type,
            supplier: supplier.id,
            reading: "",
            cost: "",
            notes: "",
          }))
        ),
      });
      
      // Refresh last readings
      fetchLastReadings();
      
    } catch (error) {
      console.error('Error saving readings:', error);
      toast({
        title: t('error.load'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('addMonthly.title')}</CardTitle>
        <CardDescription>{t('addMonthly.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Common date for all readings */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('addReading.date')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full sm:w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t('addReading.pickDate')}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <Accordion type="multiple" className="w-full" defaultValue={["electricity"]}>
              {Object.entries(suppliersByType).map(([type, suppliers], typeIndex) => (
                <AccordionItem key={type} value={type}>
                  <AccordionTrigger className="text-lg font-medium">
                    {t(`utility.${type}`)}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 py-2">
                      {suppliers.map((supplier, supplierIndex) => {
                        const readingIndex = form.getValues("readings").findIndex(
                          (r) => r.utilityType === type && r.supplier === supplier.id
                        );
                        
                        const lastReading = lastReadings[`${type}-${supplier.id}`];
                        
                        return (
                          <div key={supplier.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-md">
                            {/* Supplier Name */}
                            <div>
                              <FormLabel>{supplier.name}</FormLabel>
                              {supplier.requiresReading && supplier.unit && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {t('addMonthly.unit')}: {supplier.unit}
                                </p>
                              )}
                            </div>
                            
                            {/* Reading Field (if required) */}
                            <div>
                              {supplier.requiresReading ? (
                                <FormField
                                  control={form.control}
                                  name={`readings.${readingIndex}.reading`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>{t('addReading.reading')}</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder={lastReading !== null ? `Previous: ${lastReading}` : t('addReading.enterReading')}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              ) : (
                                <p className="text-xs mt-6 text-muted-foreground">
                                  {t('addMonthly.noReading')}
                                </p>
                              )}
                            </div>
                            
                            {/* Cost Field */}
                            <FormField
                              control={form.control}
                              name={`readings.${readingIndex}.cost`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('addReading.cost')}</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="e.g. 65.50" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            {/* Notes Field */}
                            <div className="col-span-1 md:col-span-3">
                              <FormField
                                control={form.control}
                                name={`readings.${readingIndex}.notes`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t('addReading.notes')}</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        {...field}
                                        placeholder={t('addReading.notesPlaceholder')}
                                        className="min-h-[60px]"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('addMonthly.submitting') : t('addMonthly.submit')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
