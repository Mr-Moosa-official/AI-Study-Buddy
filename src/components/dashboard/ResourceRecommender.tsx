
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { recommendResourcesAction } from '@/app/actions';
import type { RecommendResourcesOutput } from '@/ai/flows/recommend-relevant-study-resources';
import { useToast } from '@/hooks/use-toast';
import Loader from '../Loader';

const formSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  userKnowledgeLevel: z.string().min(1, 'Please select a knowledge level.'),
  availableResources: z
    .string()
    .min(1, 'Please provide at least one resource.'),
});

export default function ResourceRecommender() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecommendResourcesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      userKnowledgeLevel: '',
      availableResources: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    const response = await recommendResourcesAction(values);
    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    }
    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Resource Finder</CardTitle>
        <CardDescription>
          Discover the best materials for any topic.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Photosynthesis" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userKnowledgeLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Knowledge Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availableResources"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Resources</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste URLs, book titles, etc., separated by commas."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Thinking...' : 'Get Recommendations'}
            </Button>
          </form>
        </Form>

        {(isLoading || result) && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Recommendations</h4>
            <Card className="bg-secondary/50">
              <ScrollArea className="h-48">
                <CardContent className="p-4">
                  {isLoading && <Loader text="Finding best resources..." />}
                  {result && (
                    <div className="space-y-4 text-sm">
                      <div>
                        <h5 className="font-semibold text-primary">
                          Recommended
                        </h5>
                        <p className="whitespace-pre-wrap">
                          {result.recommendedResources}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-primary">
                          Reasoning
                        </h5>
                        <p className="whitespace-pre-wrap text-muted-foreground">
                          {result.reasoning}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
