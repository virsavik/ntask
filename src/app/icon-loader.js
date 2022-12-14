import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBars,
  faCalculator,
  faCalendar,
  faCopy,
  faEye,
  faHome,
  faInfoCircle,
  faList,
  faListCheck,
  faUsers,
  faMessage,
} from '@fortawesome/free-solid-svg-icons';

const loadIcon = () => {
  library.add(
    faHome,
    faInfoCircle,
    faUsers,
    faEye,
    faBars,
    faList,
    faCalculator,
    faCalendar,
    faListCheck,
    faCopy,
    faMessage
  );
};

export default loadIcon;
