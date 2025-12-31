
'use client';

import { useState } from 'react';
import type { TestScore } from '@/lib/types';
import StudyPlan from './StudyPlan';
import ProgressAndReminders from './ProgressAndReminders';
import ResourceRecommender from './ResourceRecommender';

export default function Dashboard() {
  const [studyPlan, setStudyPlan] = useState<string | null>(null);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [reminders, setReminders] = useState<string>('');
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [testScores, setTestScores] = useState<TestScore[]>([]);

  const handleAddTestScore = (score: TestScore) => {
    setTestScores((prev) => [...prev, score]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <StudyPlan
          studyPlan={studyPlan}
          setStudyPlan={setStudyPlan}
          isLoading={isPlanLoading}
          setIsLoading={setIsPlanLoading}
          setReminders={setReminders}
          completedTopics={completedTopics}
          setCompletedTopics={setCompletedTopics}
          testScores={testScores}
        />
      </div>
      <div className="space-y-6">
        <ProgressAndReminders
          reminders={reminders}
          testScores={testScores}
          onAddTestScore={handleAddTestScore}
        />
        <ResourceRecommender />
      </div>
    </div>
  );
}
