import { Metadata } from 'next';
import { KnowledgeHub } from '@/components/KnowledgeHub';

export const metadata: Metadata = {
  title: 'Knowledge Hub - HerHealth',
  description: 'Learn about health and wellness topics',
};

export default function KnowledgeHubPage() {
  return <KnowledgeHub />;
}
