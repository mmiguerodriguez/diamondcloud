import { configure } from '@kadira/storybook';

function loadStories() {
  require('../imports/ui/stories/TeamLayout.jsx');
}

configure(loadStories, module);
