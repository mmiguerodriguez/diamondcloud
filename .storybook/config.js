import { configure } from '@kadira/storybook';
import '../client/main.scss';

function loadStories() {
  require('../imports/ui/stories');
}

configure(loadStories, module);
