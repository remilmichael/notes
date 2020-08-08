import Alert from './Alert'
import { checkProps } from '../../../testUtils';


describe('checking prop types', () => {
    it('should not throw any prop type errors', () => {
        checkProps(Alert, { type: 'danger', message: 'This is a sample message' });
    });
});