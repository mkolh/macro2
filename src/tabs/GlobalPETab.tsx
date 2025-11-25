import React from 'react';
import { Card } from '../components/Card';
import { CardHeader } from '../components/CardHeader';
import { ExplainText } from '../components/ExplainText';

export function GlobalPETab() {
  return (
    <Card>
      <CardHeader title="Global political economy" subtitle="Not available" />
      <ExplainText>
        Core-periphery, trade openness, and capital flow indicators are not bundled in the new macro JSON input. Add those
        metrics to the dataset to bring this view back.
      </ExplainText>
    </Card>
  );
}
