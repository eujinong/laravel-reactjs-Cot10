import {
  RESPONSE_STATUS
} from '../configs/enums';

const AppHelper = {
  getStatusAlertData: (data) => {
    const {
      message, status
    } = data;

    switch (status) {
      case RESPONSE_STATUS.ERROR:
      case RESPONSE_STATUS.FAIL:
        return {
          color: 'danger',
          children: message
        };
      case RESPONSE_STATUS.SUCCESS:
      default:
        return {
          color: 'success',
          children: message
        };
    }
  }
};

export default AppHelper;
