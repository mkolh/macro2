import React from 'react';
import { Card } from '../components/Card';
import { CardHeader } from '../components/CardHeader';
import { ExplainText } from '../components/ExplainText';

export function DistributionTab() {
  return (
    <Card>
      <CardHeader title="Distributional analytics" subtitle="Not available" />
      <ExplainText>
        Distribution, inequality, and union data are not part of the uploaded JSON structure. This tab has been disabled until
        those series are provided in the file.
      </ExplainText>
    </Card>
  );
}
