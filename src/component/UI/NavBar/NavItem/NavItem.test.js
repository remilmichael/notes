import NavItem from './NavItem';
import { checkProps } from '../../../../testUtils';

describe('Checking prop types', () => {
    it('should not throw errors on prop types', () => {
        checkProps(NavItem, { link: 'http://somelink.com', children: 'Link Text' });
    });
});