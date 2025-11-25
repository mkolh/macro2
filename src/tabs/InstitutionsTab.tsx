import React from 'react';
import { Card } from '../components/Card';
import { CardHeader } from '../components/CardHeader';
import { ExplainText } from '../components/ExplainText';

export function InstitutionsTab() {
  return (
    <Card>
      <CardHeader title="Institutions & policy" subtitle="Not available" />
      <ExplainText>
        Fiscal mix, tax structure, and lobbying data are not included in the new JSON format. Provide those series in the file to
        reactivate this tab.
      </ExplainText>
    </Card>
  );
}
