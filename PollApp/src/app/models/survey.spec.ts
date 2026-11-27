import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Survey, byEndDate, deadlineLabel, isPast, today } from './survey';

const survey = (endDate?: string): Survey => ({ id: 1, category: 'c', title: 't', endDate, questions: [] });

describe('survey date helpers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 27, 12));
  });
  afterEach(() => vi.useRealTimers());

  it('formats today with an offset', () => {
    expect(today()).toBe('2026-11-27');
    expect(today(5)).toBe('2026-12-02');
  });

  it('treats the end date as the last open day', () => {
    expect(isPast(survey('2026-11-27'))).toBe(false);
    expect(isPast(survey('2026-11-26'))).toBe(true);
    expect(isPast(survey())).toBe(false);
  });

  it('labels the deadline like the design', () => {
    expect(deadlineLabel(survey('2026-11-27'))).toBe('Ends today');
    expect(deadlineLabel(survey('2026-11-28'))).toBe('Ends in 1 Day');
    expect(deadlineLabel(survey('2026-11-30'))).toBe('Ends in 3 Days');
    expect(deadlineLabel(survey('2026-11-01'))).toBe('Ended on 01.11.2026');
    expect(deadlineLabel(survey())).toBe('No end date');
  });

  it('sorts the earliest end first and open-ended surveys last', () => {
    const sorted = [survey(), survey('2026-12-01'), survey('2026-11-28')].sort(byEndDate);
    expect(sorted.map((s) => s.endDate)).toEqual(['2026-11-28', '2026-12-01', undefined]);
  });
});
