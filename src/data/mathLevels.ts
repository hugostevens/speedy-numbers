
import { MathLevel } from '@/types';

export const levels: Record<string, MathLevel> = {
  'addition-0-4': {
    id: 'addition-0-4',
    name: 'Addition 0-4',
    operation: 'addition',
    range: [0, 4],
    description: 'Basic addition facts',
  },
  'addition-5-9': {
    id: 'addition-5-9',
    name: 'Addition 5-9',
    operation: 'addition',
    range: [5, 9],
    description: 'Basic addition facts',
  },
  'subtraction-0-4': {
    id: 'subtraction-0-4',
    name: 'Subtraction 0-4',
    operation: 'subtraction',
    range: [0, 4],
    description: 'Basic subtraction facts',
  },
  'subtraction-5-9': {
    id: 'subtraction-5-9',
    name: 'Subtraction 5-9',
    operation: 'subtraction',
    range: [5, 9],
    description: 'Basic subtraction facts',
  },
  'multiplication-0-4': {
    id: 'multiplication-0-4',
    name: 'Multiplication 0-4',
    operation: 'multiplication',
    range: [0, 4],
    description: 'Basic multiplication facts',
  },
  'multiplication-5-9': {
    id: 'multiplication-5-9',
    name: 'Multiplication 5-9',
    operation: 'multiplication',
    range: [5, 9],
    description: 'Basic multiplication facts',
  },
  'division-1-4': {
    id: 'division-1-4',
    name: 'Division 1-4',
    operation: 'division',
    range: [1, 4],
    description: 'Basic division facts',
  },
  'division-5-9': {
    id: 'division-5-9',
    name: 'Division 5-9',
    operation: 'division',
    range: [5, 9],
    description: 'Basic division facts',
  },
};
