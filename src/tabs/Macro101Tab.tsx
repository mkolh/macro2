import React from 'react';
import { Card } from '../components/Card';
import { CardHeader } from '../components/CardHeader';
import { ExplainText } from '../components/ExplainText';
import { macro101Cards } from '../data/dummyData';

export function Macro101Tab() {
  return (
    <div className="card-grid cols-2">
      {macro101Cards.map((card) => (
        <Card key={card.title}>
          <CardHeader title={card.title} subtitle="Macro 101" />
          <ExplainText>{card.content}</ExplainText>
        </Card>
      ))}
    </div>
  );
}
