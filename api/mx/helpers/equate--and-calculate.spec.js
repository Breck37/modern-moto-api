import { mockResults, mockUncalculatePicks, expectedEquatedPicks } from '../helpers/test-utils';
import equateAndCalculate from './equate-and-calculate';

describe('mx - Equate and Calculate Points', () => {
  it('returns empty object if either value is empty', () => {
    const emptyRaceResults = equateAndCalculate(null, mockUncalculatePicks);
    const emptyPicksToCalculate = equateAndCalculate(mockResults, []);
    const nullPicksToCalculate = equateAndCalculate(mockResults, null);
    expect(emptyRaceResults).toEqual({});
    expect(emptyPicksToCalculate).toEqual({});
    expect(nullPicksToCalculate).toEqual({});
  })
  
  it('successfully equates picks and fastest lap', () => {
    const equatedResults = equateAndCalculate(mockResults, mockUncalculatePicks);
    console.log({ equatedResults })
    expect(equatedResults.calculatedPicks).toMatchObject(expectedEquatedPicks)
  })
})