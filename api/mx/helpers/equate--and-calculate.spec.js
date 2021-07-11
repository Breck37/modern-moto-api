import mockPicks from '../../../test-utils/mockPicks';
import mockPDFResults from '../../../test-utils/mockPDFResults';
import equateAndCalculate from './equate-and-calculate';

describe('Calculate Points', () => {
  it('mx', () => {
    const result = equateAndCalculate(mockPDFResults, mockPicks);
    console.log({ result })
  })

})