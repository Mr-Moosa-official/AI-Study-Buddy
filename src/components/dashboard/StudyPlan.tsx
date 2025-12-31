
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
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { XIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  generateDailyStudyPlanAction,
  adaptStudyPlanBasedOnProgressAction,
} from '@/app/actions';
import Loader from '../Loader';
import type { TestScore } from '@/lib/types';

interface StudyPlanProps {
  studyPlan: string | null;
  setStudyPlan: (plan: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setReminders: (reminders: string) => void;
  completedTopics: string[];
  setCompletedTopics: (topics: string[]) => void;
  testScores: TestScore[];
}

const formSchema = z.object({
  deadlines: z.string().min(1, 'Deadlines are required.'),
  subjectDifficulty: z.string().min(1, 'Subject difficulty is required.'),
  pastPerformance: z.string().min(1, 'Past performance is required.'),
});

export default function StudyPlan({
  studyPlan,
  setStudyPlan,
  isLoading,
  setIsLoading,
  setReminders,
  completedTopics,
  setCompletedTopics,
  testScores,
}: StudyPlanProps) {
  const [topicInput, setTopicInput] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deadlines: '',
      subjectDifficulty: '',
      pastPerformance: '',
    },
  });

  async function onGenerate(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setStudyPlan(null);
    setReminders(values.deadlines);
    const response = await generateDailyStudyPlanAction(values);
    if (response.success) {
      setStudyPlan(response.data.dailyPlan);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
      setReminders('');
    }
    setIsLoading(false);
  }

  async function onAdapt() {
    if (!studyPlan) return;

    setIsLoading(true);
    const response = await adaptStudyPlanBasedOnProgressAction({
      currentStudyPlan: studyPlan,
      completedTopics,
      practiceTestScores: testScores,
      upcomingDeadlines: form.getValues('deadlines').split('\n'),
    });
    if (response.success) {
      setStudyPlan(response.data.adaptedStudyPlan);
      toast({ title: 'Success', description: 'Your plan has been adapted!' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    }
    setIsLoading(false);
  }

  const handleAddTopic = () => {
    if (topicInput.trim() && !completedTopics.includes(topicInput.trim())) {
      setCompletedTopics([...completedTopics, topicInput.trim()]);
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setCompletedTopics(completedTopics.filter((t) => t !== topicToRemove));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Personalized Study Plan</CardTitle>
        <CardDescription>
          Tell the AI what you're working on, and get a tailored plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onGenerate)} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="deadlines"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upcoming Deadlines</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Math exam - Fri&#10;History essay - 2 weeks"
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subjectDifficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Difficulty</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Math: Hard&#10;History: Easy&#10;Physics: Medium"
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastPerformance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Past Performance</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Struggling with integrals in Math.&#10;Good at memorizing dates in History."
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {studyPlan ? 'Regenerate Plan' : 'Generate Plan'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onAdapt}
                disabled={!studyPlan || isLoading}
                className="flex-1"
              >
                Adapt Based on Progress
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

      {(isLoading || studyPlan) && (
        <>
          <CardHeader>
            <CardTitle>Today's Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <Card className="bg-secondary/50">
              <ScrollArea className="h-64">
                <CardContent className="p-4">
                  {isLoading && <Loader text="Generating your personalized plan..." />}
                  {studyPlan && (
                    <p className="text-sm whitespace-pre-wrap">{studyPlan}</p>
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <div>
                <Label htmlFor="completed-topic-input">Completed Topics</Label>
                <div className="flex gap-2 mt-2">
                <Input
                    id="completed-topic-input"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="e.g. Chapter 5 Reading"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                />
                <Button onClick={handleAddTopic}>Add</Button>
                </div>
            </div>
            {completedTopics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                {completedTopics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="pl-3 pr-1">
                    {topic}
                    <button onClick={() => handleRemoveTopic(topic)} className="ml-1 rounded-full p-0.5 hover:bg-destructive/20">
                        <XIcon className="h-3 w-3" />
                    </button>
                    </Badge>
                ))}
                </div>
            )}
          </CardFooter>
        </>
      )}
    </Card>
  );
}
