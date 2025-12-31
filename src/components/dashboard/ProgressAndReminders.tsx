
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { TestScore } from '@/lib/types';

interface ProgressAndRemindersProps {
  reminders: string;
  testScores: TestScore[];
  onAddTestScore: (score: TestScore) => void;
}

const formSchema = z.object({
  subject: z.string().min(1, 'Subject is required.'),
  score: z.coerce.number().min(0, 'Score must be positive.').max(100, 'Score cannot exceed 100.'),
});

export default function ProgressAndReminders({
  reminders,
  testScores,
  onAddTestScore,
}: ProgressAndRemindersProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      score: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddTestScore(values);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track & Remember</CardTitle>
        <CardDescription>
          Log your scores and keep an eye on deadlines.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="progress">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>
          <TabsContent value="progress" className="mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Calculus" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Score (%)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 85" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Score
                </Button>
              </form>
            </Form>
            <Separator className="my-4" />
            <h4 className="text-sm font-medium mb-2">Logged Scores</h4>
            <ScrollArea className="h-40">
              {testScores.length > 0 ? (
                <div className="space-y-2">
                  {testScores.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm p-2 rounded-md bg-secondary"
                    >
                      <span className="font-medium text-secondary-foreground">
                        {item.subject}
                      </span>
                      <span className="font-mono text-primary">{item.score}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No scores logged yet.
                </p>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="reminders" className="mt-4">
            <ScrollArea className="h-[280px]">
              {reminders ? (
                <p className="text-sm whitespace-pre-wrap">{reminders}</p>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No reminders. Generate a study plan to see deadlines here.
                </p>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
