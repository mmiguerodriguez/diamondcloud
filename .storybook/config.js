import { configure } from '@kadira/storybook';

function loadStories() {
  require('../imports/ui/stories/TeamsLayout.jsx');
}

configure(loadStories, module);
