import { Template } from 'meteor/templating';
import './accounts-templates.html';

Template['overrides-_loginButtonsLoggedOutSingleLoginButton'].replaces('_loginButtonsLoggedOutSingleLoginButton');