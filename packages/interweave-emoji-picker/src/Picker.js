/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { getEmojiData } from 'interweave/lib/data/emoji';
import withEmoji from 'interweave/lib/loaders/withEmoji';
import EmojiList from './EmojiList';
import GroupsBar from './GroupsBar';
import PreviewBar from './PreviewBar';
import SearchBar from './SearchBar';

import type { Emoji, EmojiPath } from './types';

type PickerProps = {
  emojiPath: EmojiPath,
  groupIcons: { [key: string]: React$Node },
  hidePreview: boolean,
  hideSearch: boolean,
  hideShortcodes: boolean,
  messages: { [key: string]: string },
  onHoverEmoji: (emoji: Emoji) => void,
  onSearch: (query: string) => void,
  onSelectEmoji: (emoji: Emoji) => void,
  onSelectGroup: (group: string) => void,
};

type PickerState = {
  activeEmoji: ?Emoji,
  activeGroup: string,
  searchQuery: string,
};

class Picker extends React.Component<PickerProps, PickerState> {
  static childContextTypes = {
    messages: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    emojiPath: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    groupIcons: PropTypes.objectOf(PropTypes.node),
    hidePreview: PropTypes.bool,
    hideSearch: PropTypes.bool,
    hideShortcodes: PropTypes.bool,
    messages: PropTypes.objectOf(PropTypes.string),
    onHoverEmoji: PropTypes.func,
    onSearch: PropTypes.func,
    onSelectEmoji: PropTypes.func,
    onSelectGroup: PropTypes.func,
  };

  static defaultProps = {
    emojiPath: '',
    groupIcons: {},
    messages: {},
    hidePreview: false,
    hideSearch: false,
    hideShortcodes: false,
    onHoverEmoji() {},
    onSearch() {},
    onSelectEmoji() {},
    onSelectGroup() {},
  };

  state = {
    activeEmoji: null,
    activeGroup: 'smileys-people',
    searchQuery: '',
  };

  getChildContext() {
    const { messages } = this.props;

    return {
      messages: {
        // Emoji groups
        'smileys-people': 'Smileys & People',
        'animals-nature': 'Animals & Nature',
        'food-drink': 'Food & Drink',
        'travel-places': 'Travel & Places',
        activities: 'Activities',
        objects: 'Objects',
        symbols: 'Symbols',
        flags: 'Flags',
        // Custom groups
        frequent: 'Frequently Used',
        'search-results': 'Search Results',
        custom: 'Custom',
        // Misc
        search: 'Search…',
        'no-preview': '',
        // Overrides
        ...messages,
      },
    };
  }

  handleEnterEmoji = (emoji: Emoji) => {
    this.setState({
      activeEmoji: emoji,
    });

    this.props.onHoverEmoji(emoji);
  };

  handleLeaveEmoji = (emoji: Emoji) => {
    this.setState({
      activeEmoji: null,
    });
  };

  handleSearch = (query: string) => {
    this.setState({
      activeGroup: query ? '' : 'smileys-people',
      searchQuery: query,
    });

    this.props.onSearch(query);
  };

  handleSelectEmoji = (emoji: Emoji) => {
    this.props.onSelectEmoji(emoji);
  };

  handleSelectGroup = (group: string) => {
    this.setState({
      activeGroup: group,
    });

    this.props.onSelectGroup(group);
  };

  render() {
    const { emojiPath, groupIcons, hidePreview, hideSearch, hideShortcodes } = this.props;
    const { activeEmoji, activeGroup, searchQuery } = this.state;

    return (
      <div className="iep__picker">
        <GroupsBar
          activeGroup={activeGroup}
          emojiPath={emojiPath}
          groupIcons={groupIcons}
          onSelect={this.handleSelectGroup}
        />

        <EmojiList
          emojis={getEmojiData()}
          emojiPath={emojiPath}
          activeGroup={activeGroup}
          query={searchQuery}
          onEnter={this.handleEnterEmoji}
          onLeave={this.handleLeaveEmoji}
          onSelect={this.handleSelectEmoji}
        />

        {!hidePreview && (
          <PreviewBar
            emoji={activeEmoji}
            emojiPath={emojiPath}
            hideShortcodes={hideShortcodes}
          />
        )}

        {!hideSearch && (
          <SearchBar onChange={this.handleSearch} />
        )}
      </div>
    );
  }
}

export default withEmoji(Picker);
