import type { ElementType } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type StatsCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: ElementType;
  trend?: { value: number; positive: boolean };
};

export const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatsCardProps) => {
  const TrendIcon = trend?.positive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {trend ? (
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium',
              trend.positive ? 'text-green-600' : 'text-red-600'
            )}
          >
            <TrendIcon className="h-4 w-4 shrink-0" aria-hidden />
            <span>{Math.abs(trend.value)}%</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
