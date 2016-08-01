import { configure } from '@kadira/storybook';

function loadStories() {
  require('../imports/ui/stories');
}

configure(loadStories, module);
