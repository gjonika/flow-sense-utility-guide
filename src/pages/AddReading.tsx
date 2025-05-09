
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// List of suppliers per utility type
const suppliersByType = {
  electricity: [{ id: 'elektrum', name: 'Elektrum', requiresReading: true, unit: 'kWh' }],
  gas: [{ id: 'ignitis', name: 'Ignitis', requiresReading: true, unit: 'm³' }],
  hotWater: [{ id: 'klaipedosEnergija', name: 'Klaipėdos Energija', requiresReading: true, unit: 'm³' }],
  water: [{ id: 'klaipedosVanduo', name: 'Klaipėdos Vanduo', requiresReading: true, unit: 'm³' }],
  housing: [{ id: 'paslauga', name: 'Paslaugos Būstui', requiresReading: false }],
  internet: [{ id: 'telia', name: 'Telia', requiresReading: false, unit: 'GB' }],
  phone: [{ id: 'arvilas', name: 'Arvilas', requiresReading: false }],
  renovation: [{ id: 'paslauga', name: 'Paslaugos Būstui', requiresReading: false }],
  loan: [{ id: 'bank', name: 'Bank', requiresReading: false }],
  interest: [{ id: 'bank', name: 'Bank', requiresReading: false }],
  insurance: [{ id: 'various', name: 'Various', requiresReading: false }],
  waste: [{ id: 'kratc', name: 'KRATC', requiresReading: false }],
};

const AddReading = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [suppliers, setSuppliers] = useState<Array<{ id: string, name: string, requiresReading: boolean, unit?: string }>>([]);
  const [requiresReading, setRequiresReading] = useState(true);
  const [lastReading, setLastReading] = useState<number | null>(null);
  const [unit, setUnit] = useState<string | undefined>(undefined);

  // Schema dynamically created based on whether reading is required
  const createSchema = (readingRequired: boolean) => {
    const baseSchema = {
      utilityType: z.string({
        required_error: "Please select a utility type.",
      }),
      supplier: z.string({
        required_error: "Please select a supplier.",
      }),
      cost: z.string().min(1, {
        message: "Cost is required.",
      }),
      date: z.date({
        required_error: "Please select a date.",
      }),
      notes: z.string().optional(),
    };
    
    if (readingRequired) {
      return z.object({
        ...baseSchema,
        reading: z.string().min(1, {
          message: "Reading value is required.",
        }),
      });
    } else {
      return z.object({
        ...baseSchema,
        reading: z.string().optional(),
      });
    }
  };

  const form = useForm<any>({
    resolver: zodResolver(createSchema(requiresReading)),
    defaultValues: {
      date: new Date(),
      notes: "",
      reading: "",
    },
  });

  // Update suppliers when utility type changes
  useEffect(() => {
    const type = form.watch("utilityType");
    if (type && type in suppliersByType) {
      const typeSuppliers = suppliersByType[type as keyof typeof suppliersByType];
      setSuppliers(typeSuppliers);
      setSelectedType(type);
      
      // Reset supplier when type changes
      form.setValue("supplier", "");
    }
  }, [form.watch("utilityType")]);

  // Update reading requirements when supplier changes
  useEffect(() => {
    const supplier = form.watch("supplier");
    const selectedSupplier = suppliers.find(s => s.id === supplier);
    
    if (selectedSupplier) {
      setRequiresReading(!!selectedSupplier.requiresReading);
      setUnit(selectedSupplier.unit);
      
      // Fetch last reading if supplier requires reading
      if (selectedSupplier.requiresReading) {
        fetchLastReading(form.getValues("utilityType"), supplier);
      }
    }
  }, [form.watch("supplier"), suppliers]);

  // Fetch the last reading for this utility type and supplier
  const fetchLastReading = async (utilityType: string, supplier: string) => {
    try {
      const { data, error } = await supabase
        .from('utility_entries')
        .select('reading')
        .eq('utilitytype', utilityType)
        .eq('supplier', supplier)
        .order('readingdate', { ascending: false })
        .limit(1);
      
      if (!error && data && data.length > 0 && data[0].reading) {
        setLastReading(data[0].reading);
      } else {
        setLastReading(null);
      }
    } catch (error) {
      console.error('Error fetching last reading:', error);
      setLastReading(null);
    }
  };

  // Form submission
  async function onSubmit(values: any) {
    setIsSubmitting(true);
    
    try {
      // Prepare data for Supabase
      const entryData = {
        readingdate: values.date.toISOString(),
        utilitytype: values.utilityType,
        supplier: values.supplier,
        reading: values.reading ? parseFloat(values.reading) : null,
        unit: unit || null,
        amount: parseFloat(values.cost),
        notes: values.notes || null
      };
      
      // Insert into Supabase
      const { error } = await supabase.from('utility_entries').insert(entryData);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: t('success.reading'),
        description: t('success.readingDesc'),
      });
      
      // Reset form
      form.reset({
        utilityType: "",
        supplier: "",
        reading: "",
        cost: "",
        date: new Date(),
        notes: "",
      });
      
    } catch (error) {
      console.error('Error saving reading:', error);
      toast({
        title: t('error.load'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('addReading.title')}</h1>
        <p className="text-muted-foreground">
          {t('addReading.subtitle')}
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('addReading.formTitle')}</CardTitle>
          <CardDescription>
            {t('addReading.formDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="utilityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('addReading.utilityType')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('addReading.utilityTypeDesc')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="electricity">{t('utility.electricity')}</SelectItem>
                          <SelectItem value="gas">{t('utility.gas')}</SelectItem>
                          <SelectItem value="hotWater">{t('utility.hotWater')}</SelectItem>
                          <SelectItem value="water">{t('utility.water')}</SelectItem>
                          <SelectItem value="housing">{t('utility.housing')}</SelectItem>
                          <SelectItem value="internet">{t('utility.internet')}</SelectItem>
                          <SelectItem value="phone">{t('utility.phone')}</SelectItem>
                          <SelectItem value="renovation">{t('utility.renovation')}</SelectItem>
                          <SelectItem value="loan">{t('utility.loan')}</SelectItem>
                          <SelectItem value="interest">{t('utility.interest')}</SelectItem>
                          <SelectItem value="insurance">{t('utility.insurance')}</SelectItem>
                          <SelectItem value="waste">{t('utility.waste')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t('addReading.utilityTypeDesc')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('addReading.supplier')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedType}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('addReading.supplierDesc')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers.map(supplier => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t('addReading.supplierDesc')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                "w-full pl-3 text-left font-normal",
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
                      <FormDescription>
                        {t('addReading.dateDesc')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('addReading.cost')}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 65.50" {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('addReading.costDesc')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {(selectedType && form.watch("supplier")) && (
                <FormField
                  control={form.control}
                  name="reading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('addReading.reading')}</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input 
                            placeholder={lastReading !== null ? `Previous: ${lastReading}` : "e.g. 120"} 
                            {...field}
                            disabled={!requiresReading}
                          />
                          {unit && <span className="ml-2">{unit}</span>}
                        </div>
                      </FormControl>
                      <FormDescription>
                        {requiresReading 
                          ? t('addReading.readingDesc')
                          : "This utility type doesn't require meter readings"
                        }
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t('addReading.submitting') : t('addReading.submit')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddReading;
